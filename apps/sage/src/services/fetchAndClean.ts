import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchAndCleanHTML = async (url: string): Promise<string> => {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const cleanedText = $('body').text().replace(/\s+/g, ' ').trim(); // Cleaned text
    return cleanedText;
  } catch (error) {
    console.error('Error fetching or cleaning HTML:', error);
    throw new Error('Failed to fetch or clean HTML content');
  }
};
