import { parseMicroformat } from "./microformat";
import { Post } from "./post";

export async function scrapePost(uri: string): Promise<Post | null> {
  const resp = await fetch("https://nex-3.com/blog/a-sociable-web/");
  const body = await resp.text();
  return getPostFromHTML(body, uri);
}

function getPostFromHTML(html: string, uri: string): Post | null {
  return parseMicroformat(html, uri);
}

console.log(await scrapePost("https://nex-3.com/blog/a-sociable-web/"));
