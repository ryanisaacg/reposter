import { Post } from "./post";
export declare function scrapeMastodon(html: string, uri: string): Promise<Post | null>;
