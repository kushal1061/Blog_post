import Link from 'next/link'
import { PenSquare } from 'lucide-react'

interface PostCardProps {
  id: string
  title: string
  summary: string | null
  image_url: string | null
  authorName: string
  createdAt: string
}

export default function PostCard({ id, title, summary, image_url, authorName, createdAt }: PostCardProps) {
  return (
    <Link href={`/posts/${id}`} className="group block no-underline">
      <div className="flex flex-col md:flex-row gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-sm bg-white hover:bg-gray-50 rounded-xl" style={{ padding: '24px', borderBottom: '1px solid var(--ink-border)' }}>
        
        {/* Content Side */}
        <div className="flex-1 flex flex-col justify-between order-2 md:order-1">
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-warm)', fontWeight: 600, marginBottom: '8px' }}>
              Story
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px', color: 'var(--ink-text)' }}>
              {title}
            </h2>
            <div className="flex items-center gap-2 mb-2">
               <div style={{ background: 'var(--ink-accent-light)', color: 'var(--ink-accent)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', borderRadius: '99px', padding: '3px 8px', fontWeight: 500 }}>
                 <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }}></div>
                 AI summary
               </div>
            </div>
            <p className="line-clamp-3" style={{ fontSize: '13px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '16px' }}>
              {summary || 'No summary available for this story.'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ink-warm)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600 }}>
                {authorName?.charAt(0).toUpperCase() || '?'}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--ink-text)', fontWeight: 500 }}>{authorName}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="order-1 md:order-2 flex-shrink-0" style={{ width: '100%', maxWidth: '200px', height: '140px' }}>
          {image_url ? (
            <div className="w-full h-full rounded-[6px] overflow-hidden border border-[var(--ink-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={image_url} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="transition-colors duration-300 group-hover:bg-gray-100" style={{ width: '100%', height: '100%', background: 'var(--ink-surface)', borderRadius: '6px', border: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PenSquare className="w-6 h-6 text-[var(--ink-muted)] transition-transform duration-300 group-hover:scale-110 group-hover:text-[var(--ink-text)]" />
            </div>
          )}
        </div>

      </div>
    </Link>
  )
}
