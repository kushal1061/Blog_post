import { createClient } from '@/lib/supabaseServer'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const noOfWords = text ? text.split(/\s/g).length : 0;
  const minutes = noOfWords / wordsPerMinute;
  return Math.ceil(minutes);
}

function getAuthorName(users: any) {
  if (!users) return 'Unknown Author';
  if (Array.isArray(users)) return users[0]?.name || 'Unknown Author';
  return users.name || 'Unknown Author';
}

export default async function Home(props: {
  searchParams?: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams?.q || ''
  const page = parseInt(searchParams?.page || '1', 10)
  
  // If it's page 1 and no search query, we show a hero post.
  // We'll fetch one extra post on page 1 so the list still has a good amount.
  const isHome = page === 1 && !q;
  const pageSize = isHome ? 7 : 6; 
  const start = isHome ? 0 : (page - 1) * 6 + (q ? 0 : 1); 
  const end = start + pageSize - 1;

  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(`
      id, title, summary, image_url, created_at, body,
      users(name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end)

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: posts, count, error } = await query

  const totalPages = count ? Math.ceil((count - (q ? 0 : 1)) / 6) : 0
  const actualTotalPages = totalPages < 1 ? 1 : totalPages;

  let heroPost = null;
  let listPosts = posts || [];

  if (isHome && posts && posts.length > 0) {
    heroPost = posts[0];
    listPosts = posts.slice(1);
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Featured Hero Post */}
      {heroPost && (
        <div className="group transition-all duration-500 hover:-translate-y-1 hover:shadow-md bg-white rounded-2xl overflow-hidden border border-[var(--ink-border)] mb-8 flex flex-col md:flex-row">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center order-2 md:order-1">
            <div style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--ink-warm)', fontWeight: 600, marginBottom: '12px' }}>
              Featured story
            </div>
            <h1 className="hero-title" style={{ fontSize: '36px', maxWidth: '520px', lineHeight: 1.1, marginBottom: '16px' }}>
              <Link href={`/posts/${heroPost.id}`} className="hover:opacity-80 transition-opacity" style={{ textDecoration: 'none', color: 'inherit' }}>
                {heroPost.title}
              </Link>
            </h1>
            {heroPost.summary && (
              <p style={{ fontSize: '16px', color: 'var(--ink-muted)', maxWidth: '480px', lineHeight: 1.6, marginBottom: '24px' }}>
                {heroPost.summary}
              </p>
            )}
            <div className="flex items-center gap-3">
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--ink-warm)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                {getAuthorName(heroPost.users).charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                <span style={{ color: 'var(--ink-text)', fontWeight: 500 }}>{getAuthorName(heroPost.users)}</span>
                {' · '}
                {getReadingTime(heroPost.body)} min read
                {' · '}
                {new Date(heroPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
          {heroPost.image_url && (
            <Link href={`/posts/${heroPost.id}`} className="w-full md:w-1/2 lg:w-[45%] h-64 md:h-auto shrink-0 relative overflow-hidden order-1 md:order-2 border-b md:border-b-0 md:border-l border-[var(--ink-border)]">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={heroPost.image_url} alt={heroPost.title} className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
            </Link>
          )}
        </div>
      )}

      {/* Search Header */}
      <div style={{ marginBottom: '32px', padding: '0 28px' }}>
        <form action="/" method="GET" className="flex items-center" style={{
          background: 'var(--ink-surface)',
          border: '1px solid var(--ink-border)',
          borderRadius: '8px',
          padding: '9px 14px',
          maxWidth: '380px',
        }}>
          <Search style={{ width: '16px', height: '16px', color: 'var(--ink-muted)', marginRight: '8px' }} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search stories..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              color: 'var(--ink-text)'
            }}
          />
          <button type="submit" className="sr-only">Search</button>
        </form>
      </div>

      {error ? (
        <div style={{ padding: '0 28px', color: 'red' }}>
          Failed to load posts. Please verify database connection.
        </div>
      ) : listPosts && listPosts.length > 0 ? (
        <div className="flex flex-col px-7">
          {listPosts.map((post: any) => (
            <PostCard
               key={post.id}
               id={post.id}
               title={post.title}
               summary={post.summary}
               image_url={post.image_url}
               authorName={getAuthorName(post.users)}
               createdAt={post.created_at}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 28px', textAlign: 'center', color: 'var(--ink-muted)' }}>
          <p>No stories found.</p>
          {q && (
            <Link href="/" style={{ color: 'var(--ink-accent)', textDecoration: 'underline', marginTop: '16px', display: 'inline-block' }}>
              Clear search
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {actualTotalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          {page > 1 ? (
             <Link 
               href={`/?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${page - 1}`}
               style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--ink-text)' }}
               className="hover:bg-[var(--ink-warm-light)] transition-colors"
             >
               &larr;
             </Link>
          ) : (
             <div style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-border)', cursor: 'not-allowed' }}>
               &larr;
             </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {Array.from({ length: actualTotalPages }).map((_, i) => {
              const p = i + 1;
              const isActive = p === page;
              return (
                <Link
                  key={p}
                  href={`/?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${p}`}
                  style={{ 
                    width: '34px', 
                    height: '34px', 
                    borderRadius: '6px', 
                    border: '1px solid var(--ink-border)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textDecoration: 'none',
                    background: isActive ? 'var(--ink-text)' : 'transparent',
                    color: isActive ? 'var(--ink-bg)' : 'var(--ink-text)',
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                  className={!isActive ? "hover:bg-[var(--ink-warm-light)] transition-colors" : ""}
                >
                  {p}
                </Link>
              )
            })}
          </div>

          {page < actualTotalPages ? (
             <Link 
               href={`/?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${page + 1}`}
               style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--ink-text)' }}
               className="hover:bg-[var(--ink-warm-light)] transition-colors"
             >
               &rarr;
             </Link>
          ) : (
             <div style={{ width: '34px', height: '34px', borderRadius: '6px', border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-border)', cursor: 'not-allowed' }}>
               &rarr;
             </div>
          )}
        </div>
      )}
    </div>
  )
}
