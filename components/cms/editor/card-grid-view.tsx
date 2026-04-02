import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { useState } from 'react'
import { Pencil, Sun, Moon, Star, Heart, Plus, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const AVAILABLE_ICONS = [
  { name: 'sun', component: Sun },
  { name: 'moon', component: Moon },
  { name: 'star', component: Star },
  { name: 'heart', component: Heart },
]

export function CardGridView(props: any) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const cards = props.node.attrs.cards || []

  const updateCard = (index: number, key: string, value: string) => {
    const newCards = [...cards]
    newCards[index] = { ...newCards[index], [key]: value }
    props.updateAttributes({ cards: newCards })
  }

  const addCard = () => {
    props.updateAttributes({
      cards: [...cards, { title: "Neue Karte", description: "Beschreibung...", icon: "sun" }]
    })
  }

  const removeCard = (index: number) => {
    const newCards = [...cards]
    newCards.splice(index, 1)
    props.updateAttributes({ cards: newCards })
  }

  return (
    <NodeViewWrapper className="card-grid-wrapper my-8 relative group bg-muted/20 p-4 rounded-2xl border border-dashed border-border">
      <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="secondary" className="shadow-sm border" onClick={addCard}>
          <Plus className="h-4 w-4 mr-1" /> Karte hinzufügen
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">Keine Karten. Klicken Sie auf + um eine hinzuzufügen.</div>
      ) : (
        <div className={`grid gap-4 ${cards.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {cards.map((card: any, i: number) => {
            const ActiveIcon = AVAILABLE_ICONS.find(ico => ico.name === card.icon)?.component || Sun
            const isEditing = editingIndex === i

            return (
              <div
                key={i}
                className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden transition-all hover:border-primary/50"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 bg-background/80 p-1 rounded-md backdrop-blur-sm">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingIndex(isEditing ? null : i)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeCard(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-4 h-full">
                  <div className="rounded-full bg-primary/10 p-3 text-primary w-fit relative group/icon">
                    <ActiveIcon className="h-6 w-6" />
                    {isEditing && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="secondary" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-20">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit p-2 flex gap-2">
                          {AVAILABLE_ICONS.map((ico) => (
                            <Button key={ico.name} variant={ico.name === card.icon ? "default" : "outline"} size="icon" onClick={() => updateCard(i, 'icon', ico.name)}>
                              <ico.component className="h-4 w-4" />
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {isEditing ? (
                      <div className="flex flex-col gap-2 flex-1">
                        <input
                          className="text-lg font-bold bg-transparent border-b border-border focus:border-primary outline-none"
                          value={card.title}
                          onChange={(e) => updateCard(i, 'title', e.target.value)}
                          placeholder="Titel..."
                        />
                        <textarea
                          className="text-sm text-muted-foreground bg-transparent border-b border-border focus:border-primary outline-none resize-none overflow-hidden flex-1 min-h-[80px]"
                          value={card.description}
                          onChange={(e) => updateCard(i, 'description', e.target.value)}
                          placeholder="Beschreibung..."
                        />
                        <Button size="sm" className="w-fit mt-2" onClick={() => setEditingIndex(null)}>Fertig</Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </NodeViewWrapper>
  )
}
