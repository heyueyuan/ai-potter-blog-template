import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

const postsDir = path.join(process.cwd(), "content", "posts");

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export async function getAllPosts(): Promise<PostMeta[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(postsDir);
  } catch {
    return [];
  }

  const markdownFiles = entries.filter((entry) => entry.endsWith(".md"));
  const posts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const fullPath = path.join(postsDir, fileName);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data } = matter(raw);
      const slug = fileName.replace(/\.md$/, "");
      return {
        slug,
        title: asString(data.title, slug),
        date: asString(data.date, ""),
        summary: asString(data.summary, ""),
        tags: asTags(data.tags)
      } satisfies PostMeta;
    })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<(PostMeta & { contentHtml: string }) | null> {
  const fullPath = path.join(postsDir, `${slug}.md`);
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(raw);
    const processed = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(content);
    return {
      slug,
      title: asString(data.title, slug),
      date: asString(data.date, ""),
      summary: asString(data.summary, ""),
      tags: asTags(data.tags),
      contentHtml: processed.toString()
    };
  } catch {
    return null;
  }
}
