import * as tumblr from "tumblr.js";
export async function scrapeTumblrPost(tumblrKey, url) {
    const client = new tumblr.Client({
        consumer_key: tumblrKey,
    });
    let username, id;
    const isUserSubdomain = url.hostname.split(".")[0] !== "www";
    const pathComponents = url.pathname.split("/");
    if (isUserSubdomain) {
        username = url.hostname.split(".")[0];
        id = url.pathname.split("/")[2];
    }
    else if (pathComponents[1] === "blog" && pathComponents[2] === "view") {
        username = pathComponents[3];
        id = pathComponents[4];
    }
    else {
        username = pathComponents[1];
        id = pathComponents[2];
    }
    let { blog, posts: [post], } = await client.blogPosts(username, {
        id,
        npf: true,
    });
    if (!post.content.length) {
        post = {
            ...post,
            ...post.trail[0],
        };
        blog = post.blog;
    }
    const textContent = post.content
        .filter((block) => block.type === "text")
        .reduce((combined, block) => combined + block.text + "\n", "");
    return {
        author: null,
        handle: blog.name,
        authorUrl: blog.url,
        avatar: blog.avatar[0].url,
        date: post.date,
        title: null,
        content: textContent,
        permalink: post.post_url,
    };
}
