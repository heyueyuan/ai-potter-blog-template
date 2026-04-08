import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-10 border-b border-zinc-800 pb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">AI-Porter Blog</p>
        <h1 className="mt-2 text-3xl font-semibold">Personal Knowledge Stream</h1>
        <p className="mt-3 text-sm text-zinc-400">Auto-published summaries from your AI conversations.</p>
      </header>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-400">
            No posts yet. Publish your first conversation from the extension.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="mb-2 text-xs text-zinc-500">{post.date}</div>
              <h2 className="text-lg font-medium">
                <Link href={`/posts/${post.slug}`} className="hover:text-zinc-300">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-400">{post.summary}</p>
              {post.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
