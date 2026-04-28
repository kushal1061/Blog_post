'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/components/RoleGuard'
import TiptapEditor from '@/components/TiptapEditor'

export default function EditPost(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const id = params.id
  
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingStep, setLoadingStep] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadPost() {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
      if (data) {
        setTitle(data.title)
        setBody(data.body)
        setImagePreview(data.image_url)
      } else if (error) {
        setError('Failed to load post data.')
      }
      setLoading(false)
    }
    loadPost()
  }, [id, supabase])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setLoadingStep('Uploading image...')
    setError(null)

    try {
      let image_url = imagePreview
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile)
        
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
        
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)
          
        image_url = publicUrl
      }

      // Do NOT regenerate AI summary on edit (as per instructions)
      setLoadingStep('Updating your story...')
      const { error: updateError } = await supabase
        .from('posts')
        .update({ title, body, image_url })
        .eq('id', id)

      if (updateError) throw new Error(`Post update failed: ${updateError.message}`)

      router.push(`/posts/${id}`)
      router.refresh()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
      setLoadingStep(null)
    }
  }

  return (
    <RoleGuard allowedRoles={['author', 'admin']}>
      <div className="max-w-3xl mx-auto mt-8 px-4 md:px-0">
        
        {/* Form Side */}
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 700, color: 'var(--ink-text)', marginBottom: '24px' }}>
            Edit story
          </h1>
          
          {error && <div style={{ background: 'var(--ink-warm-light)', color: 'var(--ink-warm)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--ink-warm)', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>{error}</div>}
          
          {loading ? (
            <div style={{ padding: '32px 0', color: 'var(--ink-muted)', fontSize: '14px' }}>Loading editor...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Title"
                  style={{
                    width: '100%',
                    fontSize: '22px',
                    fontFamily: 'Georgia, serif',
                    fontWeight: 700,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--ink-border)',
                    borderRadius: 0,
                    padding: '10px 0',
                    color: 'var(--ink-text)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '8px', fontWeight: 500 }}>Featured Image (Optional)</label>
                <div className="flex items-center w-full">
                  {imagePreview ? (
                    <div className="relative w-full rounded-lg overflow-hidden" style={{ border: '1px solid var(--ink-border)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', color: 'var(--ink-warm)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '140px', border: '1.5px dashed var(--ink-border)', borderRadius: '8px', cursor: 'pointer', background: 'var(--ink-surface)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '20px', paddingBottom: '24px' }}>
                        <svg style={{ width: '24px', height: '24px', marginBottom: '8px', color: 'var(--ink-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: 0 }}>Click to upload an image</p>
                      </div>
                      <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '8px', fontWeight: 500 }}>Story Content</label>
                <TiptapEditor content={body} onChange={setBody} />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{
                    background: 'var(--ink-accent)',
                    color: 'white',
                    borderRadius: '99px',
                    padding: '10px 28px',
                    fontSize: '14px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                 >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {loadingStep}
                    </>
                  ) : 'Save Changes'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  style={{
                    background: 'transparent',
                    color: 'var(--ink-muted)',
                    border: '1px solid var(--ink-border)',
                    borderRadius: '99px',
                    padding: '10px 28px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </RoleGuard>
  )
}
