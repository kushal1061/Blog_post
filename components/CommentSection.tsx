'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/lib/UserContext'

interface Comment {
  id: string
  comment_text: string
  created_at: string
  user_id: string
  users: { name: string } | null
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user, role } = useUser()
  const supabase = createClient()

  const fetchComments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*, users(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    
    if (data) {
      setComments(data as any)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        comment_text: newComment.trim()
      })
    
    if (!error) {
      setNewComment('')
      fetchComments()
    }
    setSubmitting(false)
  }

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    
    if (!error) {
      setComments(comments.filter(c => c.id !== commentId))
    }
  }

  const canComment = user && role !== null
  
  return (
    <div className="space-y-8">
      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: 'var(--ink-text)' }}>
        Responses {comments.length > 0 && `(${comments.length})`}
      </h3>

      {canComment ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            required
            style={{
              width: '100%',
              minHeight: '80px',
              background: 'var(--ink-surface)',
              border: '1px solid var(--ink-border)',
              borderRadius: '8px',
              padding: '12px 14px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '14px',
              color: 'var(--ink-text)',
              resize: 'vertical',
              outline: 'none'
            }}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              style={{
                background: 'var(--ink-accent)',
                color: 'white',
                borderRadius: '99px',
                padding: '8px 20px',
                fontSize: '13px',
                border: 'none',
                cursor: (submitting || !newComment.trim()) ? 'not-allowed' : 'pointer',
                opacity: (submitting || !newComment.trim()) ? 0.7 : 1
              }}
              className="hover:opacity-90 transition-opacity"
            >
              {submitting ? 'Posting...' : 'Respond'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ background: 'var(--ink-surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--ink-border)', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>
          Please sign in to join the conversation.
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '32px 0', fontSize: '14px' }}>Loading responses...</div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '32px 0', fontSize: '14px', fontStyle: 'italic' }}>
          No responses yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="flex flex-col">
          {comments.map((comment) => {
            const canDelete = user && (role === 'admin' || user.id === comment.user_id)
            const authorName = comment.users?.name || 'Unknown'
            const initials = authorName.charAt(0).toUpperCase() || '?'
            
            return (
              <div key={comment.id} style={{ padding: '24px 0', borderBottom: '1px solid var(--ink-border)' }} className="group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ink-warm)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600 }}>
                      {initials}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-text)' }}>{authorName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                        {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{ fontSize: '12px', color: 'var(--ink-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      className="hover:text-[var(--ink-warm)] transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete comment"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--ink-text)', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {comment.comment_text}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
