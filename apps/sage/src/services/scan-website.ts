import { GoogleGenerativeAI } from "@google/generative-ai";
import playwright from "playwright";
import { chromium } from "playwright";
import { scanWebsiteSchema } from "../schema";

 interface ScanResult {
    spelling: Array<{
      incorrect: string;
      correction: string;
    }>;
    grammar: Array<{
      incorrect: string;
      correction: string;
    }>;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const ANALYSIS_PROMPT = `
  You are a professional proofreader. Analyze the following text for spelling and grammatical errors.
  Focus on:
  1. Spelling mistakes
  2. Grammar issues including punctuation, subject-verb agreement, and tense consistency
  
  Return ONLY a JSON object with this structure:
  {
    "spelling": [
      {
        "incorrect": "actual misspelled word from the text",
        "correction": "correct spelling"
      }
    ],
    "grammar": [
      {
        "incorrect": "actual grammatical error from the text",
        "correction": "corrected grammar"
      }
    ]
  }
  
  If no errors are found, return empty arrays. DO NOT include example errors.
  Text to analyze:
  
  `;
  
  const cleanText = (text: string): string => {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters except basic punctuation
      .trim();
  };
  
  export const scanWebsite = async (url: string): Promise<ScanResult> => {
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
      });
      
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
      const page = await context.newPage();
      
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { 
        timeout: 30000,
        waitUntil: 'networkidle' 
      });
  
      console.log('Extracting text content...');
      const textContent = await page.evaluate(() => {
        // Target elements that are likely to contain main content
        const mainContent = document.querySelector('main, article, #content, .content');
        const elements = (mainContent || document).querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        
        return Array.from(elements)
          .map(el => el.textContent?.trim())
          .filter(text => {
            if (!text) return false;
            // Filter out very short texts and common UI elements
            if (text.length < 5) return false;
            if (text.includes('cookie') || text.includes('accept')) return false;
            return true;
          })
          .join('. ');
      });
  
      await browser.close();
      browser = undefined;
  
      const cleanedText = cleanText(textContent);
      console.log('Cleaned text sample:', cleanedText.slice(0, 200) + '...');
  
      console.log('Analyzing text with Gemini...');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(ANALYSIS_PROMPT + cleanedText);
      const response = await result.response;
      const analysis = response.text();
  
      console.log('Raw Gemini response:', analysis);
  
      // Try to extract JSON from the response
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON in Gemini response");
      }
  
      const parsedResult = JSON.parse(jsonMatch[0]) as ScanResult;
  
      // Validate the structure
      if (!Array.isArray(parsedResult.spelling) || !Array.isArray(parsedResult.grammar)) {
        throw new Error("Invalid response structure from Gemini");
      }
  
      // Validate that we're not getting example data
      if (parsedResult.spelling.some(s => s.incorrect.includes('example'))) {
        return {
          spelling: [],
          grammar: []
        };
      }
  
      return parsedResult;
  
    } catch (error) {
      console.error("Error scanning website:", error);
      if (error instanceof SyntaxError) {
        console.error("Invalid JSON response from Gemini");
      }
      throw new Error(error instanceof Error ? error.message : "Failed to scan website");
    } finally {
      if (browser) {
        await browser.close().catch(console.error);
      }
    }
  };