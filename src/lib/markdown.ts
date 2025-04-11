/**
 * Render markdown content to HTML
 * 
 * Note: This is a simple implementation. For a more robust solution,
 * consider using libraries like 'marked' with 'dompurify' for sanitization.
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  
  // This is a simple implementation that just handles basic formatting
  // Replace newlines with <br> tags
  let html = content.replace(/\n/g, '<br>');
  
  // Handle basic markdown syntax (this is very simplified)
  // Bold: **text** or __text__
  html = html.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
  
  // Italic: *text* or _text_
  html = html.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
  
  // Headers: # Header 1, ## Header 2, etc.
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  return html;
}

/**
 * Convert markdown to plain text (for excerpts, etc.)
 */
export function markdownToPlainText(content: string, maxLength?: number): string {
  if (!content) return '';
  
  // Remove markdown formatting
  let plainText = content
    .replace(/#+\s+/g, '')  // Remove headers
    .replace(/\*\*/g, '')   // Remove bold
    .replace(/\*/g, '')     // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
    .trim();
  
  if (maxLength && plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength) + '...';
  }
  
  return plainText;
}
