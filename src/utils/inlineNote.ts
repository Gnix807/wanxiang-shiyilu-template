// A sidenote lives inside a paragraph. Nested <p> elements would make the
// browser close that paragraph early and move the note outside its popover.
export function inlineNoteHtml(html = ''): string {
  return html.trim()
    .replace(/<\/p>\s*(?=<p\b)/gi, '<br /><br />')
    .replace(/<\/?p\b[^>]*>/gi, '');
}
