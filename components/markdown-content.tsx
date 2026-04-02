import Image from "next/image"

/**
 * Simple Markdown-like content renderer.
 * Supports: **bold**, *italic*, ## headings, [links](url), ![images](url),
 *           paragraphs, bullet lists, ordered lists, blockquotes, horizontal rules.
 */
export function MarkdownContent({ content }: { content: string }) {
  if (!content) return null

  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let currentParagraph: string[] = []
  let key = 0

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ")
      if (text.trim()) {
        elements.push(<p key={key++} className="text-muted-foreground leading-relaxed mb-4">{renderInline(text)}</p>)
      }
      currentParagraph = []
    }
  }

  function renderInline(text: string): React.ReactNode {
    // Process inline markdown: images, links, bold, italic
    const parts: React.ReactNode[] = []
    let remaining = text
    let idx = 0

    while (remaining.length > 0) {
      // Image: ![alt](url)
      // Image: ![alt](url)
      // Task 155: Replace markdown img with responsive picture/next-image or proper layout.
      const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
      if (imgMatch) {
        parts.push(
          <div key={`i${idx++}`} className="relative my-6 w-full overflow-hidden rounded-xl bg-muted" style={{ minHeight: '300px' }}>
            <Image
              src={imgMatch[2]}
              alt={imgMatch[1]}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain"
            />
          </div>
        )
        remaining = remaining.slice(imgMatch[0].length)
        continue
      }

      // Link: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith("http")
        parts.push(
          <a key={`l${idx++}`} href={linkMatch[2]} className="text-primary hover:underline font-medium"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {linkMatch[1]}
          </a>
        )
        remaining = remaining.slice(linkMatch[0].length)
        continue
      }

      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
      if (boldMatch) {
        parts.push(<strong key={`b${idx++}`} className="font-semibold text-foreground">{boldMatch[1]}</strong>)
        remaining = remaining.slice(boldMatch[0].length)
        continue
      }

      // Italic: *text*
      const italicMatch = remaining.match(/^\*([^*]+)\*/)
      if (italicMatch) {
        parts.push(<em key={`em${idx++}`}>{italicMatch[1]}</em>)
        remaining = remaining.slice(italicMatch[0].length)
        continue
      }

      // Regular character
      const nextSpecial = remaining.slice(1).search(/[\[!*]/)
      if (nextSpecial === -1) {
        parts.push(remaining)
        remaining = ""
      } else {
        parts.push(remaining.slice(0, nextSpecial + 1))
        remaining = remaining.slice(nextSpecial + 1)
      }
    }

    return parts.length === 1 ? parts[0] : parts
  }

  let inList: "ul" | "ol" | null = null
  const currentListItems: React.ReactNode[] = []

  function flushList() {
    if (inList === "ul") {
      elements.push(<ul key={key++} className="list-disc ml-6 mb-4 space-y-1">{[...currentListItems]}</ul>)
    } else if (inList === "ol") {
      elements.push(<ol key={key++} className="list-decimal ml-6 mb-4 space-y-1">{[...currentListItems]}</ol>)
    }
    inList = null
    currentListItems.length = 0
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Handle Lists
    const isUnordered = trimmed.startsWith("- ") || trimmed.startsWith("* ")
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/)

    if (isUnordered || orderedMatch) {
      flushParagraph()
      const targetListType = isUnordered ? "ul" : "ol"
      const content = isUnordered ? trimmed.slice(2) : orderedMatch![2]

      if (inList !== targetListType) {
        flushList()
        inList = targetListType
      }

      currentListItems.push(
        <li key={`li${key++}`} className="text-muted-foreground leading-relaxed">
          {renderInline(content)}
        </li>
      )
      continue
    } else {
      flushList() // if it's not a list item, flush the list
    }

    if (trimmed === "") {
      flushParagraph()
      continue
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushParagraph()
      elements.push(<h3 key={key++} className="font-display text-lg font-semibold mt-8 mb-3">{renderInline(trimmed.slice(4))}</h3>)
      continue
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph()
      elements.push(<h2 key={key++} className="font-display text-xl font-bold mt-8 mb-3">{renderInline(trimmed.slice(3))}</h2>)
      continue
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph()
      elements.push(<h1 key={key++} className="font-display text-2xl font-bold mt-8 mb-4">{renderInline(trimmed.slice(2))}</h1>)
      continue
    }

    // Blockquotes
    if (trimmed.startsWith("> ")) {
      flushParagraph()
      elements.push(
        <blockquote key={key++} className="border-l-4 border-primary pl-4 my-4 text-muted-foreground italic">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      )
      continue
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***") {
      flushParagraph()
      elements.push(<hr key={key++} className="my-6 border-border" />)
      continue
    }

    currentParagraph.push(trimmed)
  }

  flushParagraph()
  flushList()

  return <div>{elements}</div>
}
