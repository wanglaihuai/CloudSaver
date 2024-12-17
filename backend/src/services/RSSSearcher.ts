import RSSParser from "rss-parser";
import { AxiosInstance, AxiosHeaders } from "axios";
import { config } from "../config";
import { Logger } from "../utils/logger";
import { createAxiosInstance } from "../utils/axiosInstance";

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  description?: string;
  image?: string;
  cloudLinks?: string[];
}

export class RSSSearcher {
  private parser: RSSParser;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.parser = new RSSParser({
      customFields: {
        item: [
          ["content:encoded", "content"],
          ["description", "description"],
        ],
      },
    });

    this.axiosInstance = createAxiosInstance(
      config.rss.baseUrl,
      AxiosHeaders.from({
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/xml,application/xhtml+xml,text/html,application/rss+xml",
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

  async searchAll(keyword: string) {
    const allResults = [];

    for (let i = 0; i < config.rss.channels.length; i++) {
      const channel = config.rss.channels[i];
      try {
        const rssUrl = `${config.rss.baseUrl}/${
          channel.id
        }${keyword ? `/searchQuery=${encodeURIComponent(keyword)}` : ""}`;

        const results = await this.searchInRSSFeed(rssUrl);
        if (results.items.length > 0) {
          const channelResults = results.items
            .filter((item: RSSItem) => item.cloudLinks && item.cloudLinks.length > 0)
            .map((item: RSSItem) => ({
              ...item,
              channel: channel.name + "(" + channel.id + ")",
            }));

          allResults.push(...channelResults);
        }
      } catch (error) {
        Logger.error(`搜索频道 ${channel.name} 失败:`, error);
      }
    }

    return allResults;
  }

  async searchInRSSFeed(rssUrl: string) {
    try {
      const response = await this.axiosInstance.get(rssUrl);
      const feed = await this.parser.parseString(response.data);

      return {
        items: feed.items.map((item: RSSItem) => {
          const linkInfo = this.extractCloudLinks(item.content || item.description || "");
          return {
            title: item.title || "",
            link: item.link || "",
            pubDate: item.pubDate || "",
            image: item.image || "",
            cloudLinks: linkInfo.links,
            cloudType: linkInfo.cloudType,
          };
        }),
      };
    } catch (error) {
      Logger.error(`RSS源解析错误: ${rssUrl}`, error);
      return {
        items: [],
      };
    }
  }
}
