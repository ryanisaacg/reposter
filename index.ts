import { scrapeBskyPost } from "./bsky";
import { parseMicroformat } from "./microformat";
import { Post } from "./post";
import { scrapeTumblrPost } from "./tumblr";
import dotenv from "dotenv";

dotenv.config();

interface Config {
  tumblrConsumerKey?: string;
}

export async function scrapePost(
  config: Config,
  uri: string
): Promise<Post | null> {
  const url = new URL(uri);
  if (url.hostname === "bsky.app") {
    return await scrapeBskyPost(url);
  } else if (
    url.hostname === "tumblr.com" ||
    url.hostname.endsWith(".tumblr.com")
  ) {
    return await scrapeTumblrPost(config.tumblrConsumerKey, url);
  }

  const resp = await fetch(uri);
  const body = await resp.text();

  return getPostFromHTML(body, uri);
}

function getPostFromHTML(html: string, uri: string): Post | null {
  return parseMicroformat(html, uri);
}

console.log(
  await scrapePost(
    { tumblrConsumerKey: process.env.TUMBLR_CONSUMER_KEY },
    "https://www.tumblr.com/staff/764424099968729088/tumblr-tuesday-heartstopper-fanart"
  )
);
