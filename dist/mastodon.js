import { JSDOM } from "jsdom";
import { createRestAPIClient } from "masto";
export async function scrapeMastodon(html, uri) {
    const { document } = new JSDOM(html).window;
    const mastodon = document.getElementById("mastodon");
    if (!mastodon) {
        return null;
    }
    const url = new URL(uri);
    const masto = createRestAPIClient({
        url: `https://${url.hostname}`,
    });
    const [_, _user, id] = url.pathname.split("/");
    const [post] = await masto.v1.statuses.fetch({
        id: [id],
    });
    const { document: postDocument } = new JSDOM(post.content).window;
    return {
        author: post.account.displayName,
        handle: post.account.username,
        authorUrl: post.account.url,
        avatar: post.account.avatar,
        date: post.createdAt,
        title: null,
        content: postDocument.documentElement.textContent,
        permalink: post.uri,
    };
}
