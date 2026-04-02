import { NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { Pencil, Sun, Moon, Star, Heart } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const AVAILABLE_ICONS = [
  { name: 'sun', component: Sun },
  { name: 'moon', component: Moon },
  { name: 'star', component: Star },
  { name: 'heart', component: Heart },
]

export function CardBlockView(props: any) {
  const [isEditing, setIsEditing] = useState(false)

  const { title, description, icon } = props.node.attrs

  const updateAttr = (key: string, value: string) => {
    props.updateAttributes({ [key]: value })
  }

  const ActiveIcon = AVAILABLE_ICONS.find(i => i.name === icon)?.component || Sun

  return (
    <NodeViewWrapper className="card-block-wrapper my-4 relative group">
      <div
        className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden transition-all hover:border-primary/50"
      >
        {/* Editor controls, visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 bg-background/80 p-1 rounded-md backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(!isEditing)} title="Karte bearbeiten">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary relative group/icon">
            <ActiveIcon className="h-6 w-6" />
            {isEditing && (
               <Popover>
               <PopoverTrigger asChild>
                 <Button variant="secondary" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-20">
                   <Pencil className="h-3 w-3" />
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-fit p-2 flex gap-2">
                 {AVAILABLE_ICONS.map((i) => (
                   <Button key={i.name} variant={i.name === icon ? "default" : "outline"} size="icon" onClick={() => updateAttr('icon', i.name)}>
                     <i.component className="h-4 w-4" />
                   </Button>
                 ))}
               </PopoverContent>
             </Popover>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                   className="text-lg font-bold bg-transparent border-b border-border focus:border-primary outline-none"
                   value={title}
                   onChange={(e) => updateAttr('title', e.target.value)}
                   placeholder="Karten-Titel..."
                />
                <textarea
                   className="text-muted-foreground bg-transparent border-b border-border focus:border-primary outline-none resize-none overflow-hidden min-h-[60px]"
                   value={description}
                   onChange={(e) => updateAttr('description', e.target.value)}
                   placeholder="Beschreibungstext..."
                />
                <Button size="sm" className="w-fit mt-2" onClick={() => setIsEditing(false)}>Fertig</Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-1">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
