import { mf2 } from "microformats-parser";
import { Post } from "./post";

type MicroformatRoot = ReturnType<typeof mf2>["items"][number];
type MicroformatProperty = MicroformatRoot["properties"][string][number];

export function parseMicroformat(html: string, uri: string): Post | null {
  const microformat = mf2(html, { baseUrl: uri });
  const hEntry = microformat.items.find((item) =>
    item.type?.includes("h-entry")
  );
  if (hEntry == null) {
    return null;
  }
  const {
    author: authorCard,
    name: title,
    published: date,
    url: permalink,
    content,
  } = hEntry.properties;
  const {
    name: author,
    url: authorUrl,
    photo: avatar,
  } = authorCard
    .filter(isPropertyRoot)
    .find((item) => item.type?.includes("h-card"))?.properties ?? {};

  return {
    author: propertyString(author),
    handle: new URL(uri).hostname,
    authorUrl: propertyString(authorUrl),
    avatar: propertyString(avatar),
    date: propertyString(date),
    title: propertyString(title),
    content: propertyString(content),
    permalink: propertyString(permalink),
  };
}

function isPropertyRoot(
  property: MicroformatProperty
): property is MicroformatRoot {
  return typeof property === "object" && "type" in property;
}

function propertyString(
  property: MicroformatProperty | MicroformatProperty[]
): string | null {
  if (typeof property === "string") {
    return property;
  } else if (Array.isArray(property)) {
    return property.length > 0 ? propertyString(property[0]) : null;
  } else {
    return property.value ? propertyString(property.value) : null;
  }
}
