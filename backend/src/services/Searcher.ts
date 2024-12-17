import { AxiosInstance, AxiosHeaders } from "axios";
import { createAxiosInstance } from "../utils/axiosInstance";
import * as cheerio from "cheerio";
import { config } from "../config";
import { Logger } from "../utils/logger";

interface sourceItem {
  messageId?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  description?: string;
  image?: string;
  cloudLinks?: string[];
  cloudType?: string;
}

export class Searcher {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = createAxiosInstance(
      config.telegram.baseUrl,
      AxiosHeaders.from({
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "cache-control": "max-age=0",
        priority: "u=0, i",
        "sec-ch-ua": '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      }),
      true
    );
  }

  private extractCloudLinks(text: string): { links: string[]; cloudType: string } {
    const links: string[] = [];
    let cloudType = "";
    Object.values(config.cloudPatterns).forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        links.push(...matches);
        cloudType = Object.keys(config.cloudPatterns)[index];
      }
    });
    return {
      links: [...new Set(links)],
      cloudType,
    };
  }

  async searchAll(keyword: string, channelId?: string, messageId?: string) {
    const allResults = [];
    const totalChannels = config.rss.channels.length;

    const channelList = channelId
      ? config.rss.channels.filter((channel) => channel.id === channelId)
      : config.rss.channels;

    for (let i = 0; i < channelList.length; i++) {
      const channel = channelList[i];
      try {
        const messageIdparams = messageId ? `before=${messageId}` : "";
        const url = `/${channel.id}${keyword ? `?q=${encodeURIComponent(keyword)}&${messageIdparams}` : `?${messageIdparams}`}`;
        console.log(`Searching in channel ${channel.name} with URL: ${url}`);
        const results = await this.searchInWeb(url, channel.id);
        console.log(`Found ${results.items.length} items in channel ${channel.name}`);
        if (results.items.length > 0) {
          const channelResults = results.items
            .filter((item: sourceItem) => item.cloudLinks && item.cloudLinks.length > 0)
            .map((item: sourceItem) => ({
              ...item,
              channel: channel.name,
              channelId: channel.id,
            }));

          allResults.push(...channelResults);
        }
      } catch (error) {
        Logger.error(`搜索频道 ${channel.name} 失败:`, error);
      }
    }

    return allResults;
  }

  async searchInWeb(url: string, channelId: string) {
    try {
      const response = await this.axiosInstance.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const items: sourceItem[] = [];
      // 遍历每个消息容器
      $(".tgme_widget_message_wrap").each((_, element) => {
        const messageEl = $(element);

        // 通过 data-post 属性来获取消息的链接 去除channelId 获得消息id
        const messageId = messageEl
          .find(".tgme_widget_message")
          .data("post")
          ?.toString()
          .split("/")[1];

        // 提取标题 (消息截取100长度)
        const title = messageEl.find(".js-message_text").text().trim().substring(0, 50) + "...";

        // 提取链接 (消息中的链接)
        // const link = messageEl.find('.tgme_widget_message').data('post');

        // 提取发布时间
        const pubDate = messageEl.find("time").attr("datetime");

        // 提取内容 (完整消息文本)
        const content = messageEl.find(".js-message_text").text();

        // 提取描述 (消息文本中"描述："后的内容)
        const description = content.split("描述：")[1]?.split("\n")[0]?.trim();

        // 提取图片
        const image = messageEl
          .find(".tgme_widget_message_photo_wrap")
          .attr("style")
          ?.match(/url\('(.+?)'\)/)?.[1];

        // 提取云盘链接
        const links = messageEl
          .find(".tgme_widget_message_text a")
          .map((_, el) => $(el).attr("href"))
          .get();
        const cloudInfo = this.extractCloudLinks(links.join(" "));
        // 添加到数组第一位
        items.unshift({
          messageId,
          title,
          pubDate,
          content,
          description,
          image,
          cloudLinks: cloudInfo.links,
          cloudType: cloudInfo.cloudType,
        });
      });
      return { items };
    } catch (error) {
      Logger.error(`RSS源解析错误: ${url}`, error);
      return {
        items: [],
      };
    }
  }
}
