'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code
} from 'lucide-react'

export default function TiptapEditor({ 
  content, 
  onChange 
}: { 
  content: string, 
  onChange: (html: string) => void 
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] p-5 max-w-none prose-p:my-1 prose-headings:my-2 prose-ol:my-1 prose-ul:my-1',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-[var(--ink-border)] rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--ink-accent)] transition-shadow">
      {/* Toolbar */}
      <div className="bg-[var(--ink-surface)] border-b border-[var(--ink-border)] p-2 flex flex-wrap gap-1 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${editor.isActive('paragraph') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
        >
          Paragraph
        </button>
        <div className="w-px h-5 bg-[var(--ink-border)] mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[var(--ink-border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[var(--ink-border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[var(--ink-border)] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('codeBlock') ? 'bg-white shadow-sm text-black' : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-black'}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
