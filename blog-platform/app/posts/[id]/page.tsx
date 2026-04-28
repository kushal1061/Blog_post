import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CommentSection from '@/components/CommentSection'

export const dynamic = 'force-dynamic'

function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const noOfWords = text ? text.split(/\s/g).length : 0;
  const minutes = noOfWords / wordsPerMinute;
  return Math.ceil(minutes);
}

function RoleBadge({ role }: { role: string }) {
  if (!role) return null;
  const normalized = role.toLowerCase();
  
  let bg = '#F7F4EF';
  let color = '#7A7268';
  let text = 'Viewer';
  
  if (normalized === 'author') {
    bg = '#EAF2EE';
    color = '#2E5E4E';
    text = 'Author';
  } else if (normalized === 'admin') {
    bg = '#FAF0E6';
    color = '#C4783A';
    text = 'Admin';
  }
  
  return (
    <span style={{
      background: bg,
      color: color,
      fontSize: '10px',
      padding: '2px 8px',
      borderRadius: '99px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      display: 'inline-block'
    }}>
      {text}
    </span>
  );
}

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params
  const supabase = await createClient()

  // Note: we fetch users(name, role) assuming the `users` table has a role column.
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      users(name, role)
    `)
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Get current user to determine if they can edit
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'viewer'
  if (user) {
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userData) {
      role = userData.role
    }
  }

  const canEdit = user && (role === 'admin' || post.author_id === user.id)
  const readingTime = getReadingTime(post.body);
  const authorName = post.users?.name || 'Unknown Author';
  const authorRole = post.users?.role || 'viewer';

  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 16px' }} className="md:px-6">
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-warm)', fontWeight: 600, marginBottom: '16px' }}>
          Story
        </div>
        
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px', color: 'var(--ink-text)', marginBottom: '24px' }}>
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--ink-warm)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink-text)' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 600 }}>{authorName}</span>
                <RoleBadge role={authorRole} />
              </div>
              <div style={{ color: 'var(--ink-muted)', marginTop: '2px' }}>
                {readingTime} min read · {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
          
          {canEdit && (
            <Link href={`/posts/${id}/edit`} style={{ fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'underline' }}>
              Edit Post
            </Link>
          )}
        </div>
      </div>

      {post.image_url && (
        <div style={{ margin: '28px 0' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={post.image_url} 
            alt={post.title} 
            style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--ink-border)', objectFit: 'cover' }} 
          />
        </div>
      )}

      {/* AI Summary */}
      {post.summary && (
        <aside style={{ background: 'var(--ink-accent-light)', borderLeft: '3px solid var(--ink-accent)', borderRadius: 0, padding: '16px 20px', margin: '0 0 32px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink-accent)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '8px' }}>
            AI-generated summary
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-text)', lineHeight: 1.6, margin: 0 }}>
            {post.summary}
          </p>
        </aside>
      )}

      {/* Body Content */}
      <div 
        className="prose prose-lg max-w-none" 
        dangerouslySetInnerHTML={{ __html: post.body }} 
      />

      <hr style={{ border: 'none', borderTop: '1px solid var(--ink-border)', margin: '40px 0' }} />

      {/* Comments Section Component */}
      <CommentSection postId={id} />
    </article>
  )
}
