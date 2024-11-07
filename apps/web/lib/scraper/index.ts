
function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove navigation sections
    .replace(/Navigation Menu[\s\S]*?(?=\n\n)/g, '')
    // Remove header sections
    .replace(/Header[\s\S]*?(?=\n\n)/g, '')
    // Remove footer sections
    .replace(/Footer[\s\S]*?(?=\n\n)/g, '')
    // Remove links and their text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove image references
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    // Remove navigation breadcrumbs
    .replace(/Breadcrumbs[\s\S]*?(?=\n\n)/g, '')
    // Remove file metadata
    .replace(/File metadata[\s\S]*?(?=\n\n)/g, '')
    // Remove multiple newlines and spaces
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    // Remove any remaining special characters
    .replace(/[^\w\s.,!?;:'"()-]/g, ' ')
    .trim();
}

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Using JINA AI to convert the page to markdown
    const response = await fetch("https://r.jina.ai/" + url);
    const markdown = await response.text();
    
    // Clean the markdown to get only relevant content
    const cleanedContent = cleanMarkdown(markdown);

    return cleanedContent;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website');
  }
} 