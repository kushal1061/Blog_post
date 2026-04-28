'use client'

import { useUser } from '@/lib/UserContext'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Edit3, Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }

    async function fetchUserPosts() {
      setLoading(true)
      const start = (page - 1) * pageSize
      const end = start + pageSize - 1

      const { data, count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .range(start, end)

      if (!error && data) {
        setPosts(data)
        if (count !== null) setTotalPages(Math.ceil(count / pageSize))
      }
      setLoading(false)
    }

    fetchUserPosts()
  }, [user, userLoading, page, supabase, router])

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return

    console.log('Attempting to delete post:', postId)
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    
    if (error) {
      console.error('Delete error:', error)
      alert('Failed to delete post: ' + error.message)
    } else {
      console.log('Post deleted successfully')
      setPosts(posts.filter(p => p.id !== postId))
      // Refresh page if current page becomes empty and it's not the first page
      if (posts.length === 1 && page > 1) {
        setPage(page - 1)
      }
    }
  }

  if (userLoading || (loading && posts.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--ink-accent)]" />
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>Loading your stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 700, color: 'var(--ink-text)', letterSpacing: '-0.02em' }}>
            My Stories
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', marginTop: '12px', maxWidth: '480px', lineHeight: 1.6 }}>
            Manage your published editorial content, track your drafts, and refine your voice.
          </p>
        </div>
        <Link 
          href="/posts/create" 
          className="flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-300" 
          style={{ 
            background: 'var(--ink-text)', 
            color: 'var(--ink-bg)', 
            padding: '12px 24px', 
            borderRadius: '99px', 
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Plus className="w-4 h-4" />
          Write New Story
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="py-24 text-center bg-[var(--ink-surface)] rounded-2xl border border-[var(--ink-border)]">
          <div className="mb-6 opacity-20 flex justify-center">
             <Edit3 className="w-16 h-16" />
          </div>
          <p style={{ color: 'var(--ink-text)', fontSize: '18px', fontWeight: 500 }}>Your inkwell is empty.</p>
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginTop: '8px' }}>Start sharing your perspective with the world.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="group relative flex items-center justify-between p-8 bg-white border border-[var(--ink-border)] rounded-2xl hover:border-[var(--ink-accent)] hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="flex-1 min-w-0 pr-8">
                <Link href={`/posts/${post.id}`} className="block">
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '8px' }} className="group-hover:text-[var(--ink-accent)] transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-4" style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink-accent)]"></span>
                    Published {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {post.summary && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--ink-surface)] border border-[var(--ink-border)]">AI Summary Active</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  href={`/posts/${post.id}/edit`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[var(--ink-border)] hover:border-[var(--ink-accent)] hover:text-[var(--ink-accent)] hover:shadow-md transition-all duration-300"
                  title="Edit Story"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[var(--ink-border)] hover:border-red-200 hover:text-red-500 hover:shadow-md transition-all duration-300"
                  title="Delete Story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-[var(--ink-border)]">
          <button 
            disabled={page === 1}
            onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
            className={`flex items-center justify-center h-10 px-4 rounded-lg border border-[var(--ink-border)] transition-all duration-300 ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--ink-surface)] hover:border-[var(--ink-text)]'}`}
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            &larr; Newer
          </button>
          
          <div className="flex items-center gap-1.5 px-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                className={`w-8 h-8 rounded-lg transition-all duration-300 ${p === page ? 'bg-[var(--ink-text)] text-[var(--ink-bg)]' : 'hover:bg-[var(--ink-surface)] text-[var(--ink-muted)]'}`}
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                {p}
              </button>
            ))}
          </div>

          <button 
            disabled={page === totalPages}
            onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
            className={`flex items-center justify-center h-10 px-4 rounded-lg border border-[var(--ink-border)] transition-all duration-300 ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--ink-surface)] hover:border-[var(--ink-text)]'}`}
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            Older &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
