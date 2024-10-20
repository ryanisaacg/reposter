import { AtpAgent } from "@atproto/api";
export async function scrapeBskyPost(url) {
    const agent = new AtpAgent({ service: "https://public.api.bsky.app" });
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const [_domain, _profile, actor, _post, id] = path.split("/");
    const profile = await agent.getProfile({ actor });
    const uri = `at://${profile.data.did}/app.bsky.feed.post/${id}`;
    const thread = await agent.getPostThread({ uri });
    const post = thread.data.thread.post;
    const record = post.record;
    return {
        author: post.author.displayName ?? null,
        handle: `@${post.author.handle}`,
        authorUrl: `https://bsky.app/profile/${post.author.handle}`,
        avatar: post.author.avatar ?? null,
        date: record.createdAt,
        title: null,
        content: record.text,
        permalink: String(url),
    };
}
