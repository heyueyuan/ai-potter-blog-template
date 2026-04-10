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

export interface PostDetail extends PostMeta {
  mainHtml: string;
  transcriptHtml: string;
}

const postsDir = path.join(process.cwd(), "content", "posts");

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

async function renderMd(md: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(md);
  return result.toString();
}

const HIDDEN_HEADINGS = /^##\s+(What I Was Working On|Transcript|Source)\b/im;

function splitContent(content: string): { main: string; hidden: string } {
  const lines = content.split("\n");
  const mainLines: string[] = [];
  const hiddenLines: string[] = [];
  let inHidden = false;

  for (const line of lines) {
    if (HIDDEN_HEADINGS.test(line)) {
      inHidden = true;
    } else if (inHidden && /^##\s+/.test(line) && !HIDDEN_HEADINGS.test(line)) {
      inHidden = false;
    }

    if (inHidden) {
      hiddenLines.push(line);
    } else {
      mainLines.push(line);
    }
  }

  return { main: mainLines.join("\n"), hidden: hiddenLines.join("\n") };
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

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const fullPath = path.join(postsDir, `${slug}.md`);
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(raw);
    const { main, hidden } = splitContent(content);
    const mainHtml = await renderMd(main);
    const transcriptHtml = hidden.trim() ? await renderMd(hidden) : "";
    return {
      slug,
      title: asString(data.title, slug),
      date: asString(data.date, ""),
      summary: asString(data.summary, ""),
      tags: asTags(data.tags),
      mainHtml,
      transcriptHtml,
    };
  } catch {
    return null;
  }
}
