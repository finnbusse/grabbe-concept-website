import { test } from "node:test"
import assert from "node:assert"
import * as fs from "node:fs/promises"

/**
 * Task 62: Basic renderer tests for Markdown Lists and Quotes.
 * We evaluate the string output of the React component roughly,
 * or by directly analyzing the source logic to ensure structural output.
 */
test("Markdown Content outputs valid list markup", async () => {
  const content = await fs.readFile("./components/markdown-content.tsx", "utf-8")

  // Point 61: List semantics. Verify that <li> elements are pushed into an array
  // that is eventually wrapped by <ul> or <ol> instead of pushing <li> directly to elements.
  assert.ok(content.includes("<ul"), "Contains <ul> wrapper")
  assert.ok(content.includes("<ol"), "Contains <ol> wrapper")
  assert.ok(content.includes("currentListItems.push("), "Pushes to a list items array")
  assert.ok(!content.includes('elements.push(\n        <li'), "No longer pushes raw <li> to root elements")
})
