import { Post } from "./post";
export declare function scrapeTumblrPost(tumblrKey: string | undefined, url: URL): Promise<Post | null>;
