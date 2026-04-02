import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CardGridView } from './card-grid-view'

export const CardGridNode = Node.create({
  name: 'cardGrid',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      cards: {
        default: [
          { title: "Neue Karte 1", description: "Beschreibung...", icon: "sun" },
          { title: "Neue Karte 2", description: "Beschreibung...", icon: "star" }
        ],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="card-grid"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'card-grid' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardGridView)
  },
})
