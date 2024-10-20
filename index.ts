import { scrapeBskyPost } from "./bsky";
import { parseMicroformat } from "./microformat";
import { Post } from "./post";

export async function scrapePost(uri: string): Promise<Post | null> {
  const url = new URL(uri);
  if (url.hostname === "bsky.app") {
    return await scrapeBskyPost(url);
  }

  const resp = await fetch(uri);
  const body = await resp.text();

  return getPostFromHTML(body, uri);
}

function getPostFromHTML(html: string, uri: string): Post | null {
  return parseMicroformat(html, uri);
}

console.log(
  await scrapePost("https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l")
);
