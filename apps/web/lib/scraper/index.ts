function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove navigation sections
    .replace(/Navigation Menu[\s\S]*?(?=\n\n)/g, '')
    // Remove header sections
    .replace(/Header[\s\S]*?(?=\n\n)/g, '')
    // Remove footer sections
    .replace(/Footer[\s\S]*?(?=\n\n)/g, '')
    // Remove links but keep the link text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove image references but keep the alt text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove URLs but keep the surrounding text
    .replace(/https?:\/\/[^\s]+/g, '')
    // Remove navigation breadcrumbs
    .replace(/Breadcrumbs[\s\S]*?(?=\n\n)/g, '')
    // Remove file metadata
    .replace(/File metadata[\s\S]*?(?=\n\n)/g, '')
    // Remove multiple newlines and spaces


    // Trim leading and trailing whitespace
    .trim();
}

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Using JINA AI to convert the page to markdown
    const response = await fetch("https://r.jina.ai/" + url);
    const markdown = await response.text();
    
    // Clean the markdown to get only relevant content
    const cleanedContent = cleanMarkdown(markdown);
    console.log(cleanedContent); // Log the cleaned markdown for debugging
    return cleanedContent;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website');
  }
} 