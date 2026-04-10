import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const rotations = [
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
  "rotate-0.5",
  "rotate-2",
  "-rotate-0.5",
];

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="relative min-h-screen w-full">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/60 border-b border-white/40">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[--text-muted]">Knowledge Canvas</p>
            <h1 className="text-lg font-semibold text-[--foreground]">My Learning Notes</h1>
          </div>
          <span className="text-xs text-[--text-muted]">{posts.length} notes</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {posts.length === 0 ? (
          <div className="glass-card px-8 py-16 text-center">
            <p className="text-[--text-muted] text-sm">No notes yet.</p>
            <p className="text-[--text-muted] text-xs mt-2">Publish your first conversation from the extension.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={`glass-card block break-inside-avoid p-5 ${rotations[i % rotations.length]} hover:rotate-0`}
              >
                <p className="text-[11px] text-[--text-muted] mb-2">{formatDate(post.date)}</p>
                <h2 className="text-[15px] font-semibold leading-snug mb-2">{post.title}</h2>
                <p className="text-[13px] text-[#4a4a4f] leading-relaxed line-clamp-4 mb-3">{post.summary}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
