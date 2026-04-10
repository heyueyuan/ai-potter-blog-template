import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { ExpandSection } from "./expand-section";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen w-full">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/60 border-b border-white/40">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-[--text-muted] hover:text-[--foreground] transition-colors text-sm"
          >
            &larr; Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <article className="glass-card p-8">
          <p className="text-xs text-[--text-muted] mb-2">{formatDate(post.date)}</p>
          <h1 className="text-2xl font-bold leading-tight mb-4">{post.title}</h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}

          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: post.mainHtml }}
          />

          {post.transcriptHtml && (
            <ExpandSection html={post.transcriptHtml} />
          )}
        </article>
      </main>
    </div>
  );
}
