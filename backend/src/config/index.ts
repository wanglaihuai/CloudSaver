import dotenv from "dotenv";

// 加载.env文件
dotenv.config();

interface Channel {
  id: string;
  name: string;
}

interface CloudPatterns {
  baiduPan: RegExp;
  tianyi: RegExp;
  weiyun: RegExp;
  aliyun: RegExp;
  pan115: RegExp;
  quark: RegExp;
}

interface Cloud115Config {
  userId: string;
  cookie: string;
}
interface QuarkConfig {
  userId: string;
  cookie: string;
}
interface HttpProxyConfig {
  host: string;
  port: string;
}
interface Config {
  rss: {
    baseUrl: string;
    channels: Channel[];
  };
  telegram: {
    baseUrl: string;
  };
  httpProxy: HttpProxyConfig;
  cloudPatterns: CloudPatterns;
  cloud115: Cloud115Config;
  quark: QuarkConfig;
}

export const config: Config = {
  rss: {
    baseUrl: process.env.RSS_BASE_URL || "https://rsshub.rssforever.com/telegram/channel",
    channels: [
      {
        id: "guaguale115",
        name: "115网盘资源分享",
      },
      {
        id: "hao115",
        name: "115网盘资源分享频道",
      },
      {
        id: "yunpanshare",
        name: "网盘资源收藏(夸克)",
      },
    ],
  },

  telegram: {
    baseUrl: process.env.TELEGRAM_BASE_URL || "https://t.me/s",
  },

  httpProxy: {
    host: process.env.HTTP_PROXY_HOST || "127.0.0.1",
    port: process.env.HTTP_PROXY_PORT || "7890",
  },

  cloudPatterns: {
    baiduPan: /https?:\/\/(?:pan|yun)\.baidu\.com\/[^\s<>"]+/g,
    tianyi: /https?:\/\/cloud\.189\.cn\/[^\s<>"]+/g,
    weiyun: /https?:\/\/share\.weiyun\.com\/[^\s<>"]+/g,
    aliyun: /https?:\/\/\w+\.aliyundrive\.com\/[^\s<>"]+/g,
    // pan115有两个域名 115.com 和 anxia.com
    pan115: /https?:\/\/(?:115|anxia)\.com\/s\/[^\s<>"]+/g,
    quark: /https?:\/\/pan\.quark\.cn\/[^\s<>"]+/g,
  },

  cloud115: {
    userId: "",
    cookie: process.env.CLOUD115_COOKIE || "",
  },
  quark: {
    userId: process.env.QUARK_USER_ID || "",
    cookie: process.env.QUARK_COOKIE || "",
  },
};
