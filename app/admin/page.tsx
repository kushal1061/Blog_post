'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { RoleGuard } from '@/components/RoleGuard'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  const [posts, setPosts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [postsRes, commentsRes] = await Promise.all([
      supabase.from('posts').select('id, title, users(name), created_at').order('created_at', { ascending: false }),
      supabase.from('comments').select('id, comment_text, post_id, posts(title), users(name), created_at').order('created_at', { ascending: false })
    ])

    if (postsRes.data) setPosts(postsRes.data)
    if (commentsRes.data) setComments(commentsRes.data)
    setLoading(false)
  }

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      setPosts(posts.filter(p => p.id !== id))
    } else {
      alert('Failed to delete post: ' + error.message)
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (!error) {
      setComments(comments.filter(c => c.id !== id))
    } else {
      alert('Failed to delete comment: ' + error.message)
    }
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="flex flex-col md:flex-row min-h-screen" style={{ marginTop: '-2rem' /* Offset layout gap if any */ }}>
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0" style={{ background: 'var(--ink-surface)', borderRight: '1px solid var(--ink-border)', padding: '32px 24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '32px' }}>
            Admin
          </h2>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('posts')}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'posts' ? 600 : 500,
                color: activeTab === 'posts' ? 'var(--ink-bg)' : 'var(--ink-text)',
                background: activeTab === 'posts' ? 'var(--ink-text)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              All Stories
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'comments' ? 600 : 500,
                color: activeTab === 'comments' ? 'var(--ink-bg)' : 'var(--ink-text)',
                background: activeTab === 'comments' ? 'var(--ink-text)' : 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              All Responses
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1" style={{ padding: '32px 48px', background: 'var(--ink-bg)' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '32px' }}>
            {activeTab === 'posts' ? 'Stories' : 'Responses'}
          </h1>

          {loading ? (
            <div style={{ padding: '48px 0', color: 'var(--ink-muted)', fontSize: '14px' }}>Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'posts' ? (
                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Title</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Author</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id}>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-text)', fontWeight: 500 }}>
                          <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                            {post.title}
                          </Link>
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-muted)' }}>{post.users?.name || 'Unknown'}</td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-muted)' }}>{new Date(post.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '13px', textAlign: 'right' }}>
                          <Link href={`/posts/${post.id}/edit`} style={{ color: 'var(--ink-accent)', textDecoration: 'none', marginRight: '16px', fontWeight: 500 }} className="hover:underline">
                            Edit
                          </Link>
                          <button onClick={() => handleDeletePost(post.id)} style={{ color: 'var(--ink-warm)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500, fontSize: '13px' }} className="hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>No stories found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Response</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Story</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Author</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600 }}>Date</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-border)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(comment => (
                      <tr key={comment.id}>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-text)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {comment.comment_text}
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <Link href={`/posts/${comment.post_id}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-[var(--ink-text)] transition-colors">
                            {comment.posts?.title || 'Unknown Post'}
                          </Link>
                        </td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-muted)' }}>{comment.users?.name || 'Unknown'}</td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '14px', color: 'var(--ink-muted)' }}>{new Date(comment.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '16px', borderBottom: '1px solid var(--ink-border)', fontSize: '13px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteComment(comment.id)} style={{ color: 'var(--ink-warm)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500, fontSize: '13px' }} className="hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {comments.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>No responses found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>

      </div>
    </RoleGuard>
  )
}
