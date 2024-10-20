import { scrapeBskyPost } from "./bsky";
import { scrapeMastodon } from "./mastodon";
import { parseMicroformat } from "./microformat";
import { Post } from "./post";
import { scrapeTumblrPost } from "./tumblr";

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

  return await getPostFromHTML(body, uri);
}

async function getPostFromHTML(
  html: string,
  uri: string
): Promise<Post | null> {
  return parseMicroformat(html, uri) ?? (await scrapeMastodon(html, uri));
}
