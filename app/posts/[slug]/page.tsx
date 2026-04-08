import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <article>
        <p className="text-xs text-zinc-500">{post.date}</p>
        <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>
        {post.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className="md-content mt-10"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
