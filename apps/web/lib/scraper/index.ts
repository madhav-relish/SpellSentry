import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Using JINA AI, to convert the page to markdown which is more readable and is without html
    const response = await fetch("https://r.jina.ai/"+url);
    const htmlMarkdown = await response.text();
    console.log("Markdown::",htmlMarkdown)

    return htmlMarkdown;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website');
  }
} 