import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CardBlockView } from './card-block-view'

// Tiptap Extension for an interactive Card block
export const CardBlockNode = Node.create({
  name: 'cardBlock',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: {
        default: 'Neue Karte',
      },
      description: {
        default: 'Beschreibungstext hier eingeben...',
      },
      icon: {
        default: 'sun', // default icon name
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'card-block' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardBlockView)
  },
})
