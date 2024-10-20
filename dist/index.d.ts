import { Post } from "./post";
interface Config {
    tumblrConsumerKey?: string;
}
export declare function scrapePost(config: Config, uri: string): Promise<Post | null>;
export {};
