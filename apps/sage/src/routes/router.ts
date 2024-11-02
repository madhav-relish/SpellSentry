import { Router, Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { analyzeTextWithHuggingFace } from '../services/huggingFaceService';
import { fetchAndCleanHTML } from '../services/fetchAndClean';
import { analyzeSpellingAndGrammar } from '../services/analyzeText';
import { analyzeTone } from "../services/analyzeTone"
import { scanWebsite } from '../services/scan-website';
import { scanRequestSchema } from '../schema';

const router = Router();

//@ts-ignore
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const parseResult = scanRequestSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: parseResult.error.message 
      });
    }

    const { url } = parseResult.data;
    const results = await scanWebsite(url);
    
    return res.json({ 
      success: true, 
      data: results 
    });
  } catch (error) {
    console.error('Error scanning website:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to scan website' 
    });
  }
});

router.post('/analyze', async (req: Request, res: Response) => {
  const { url } = req.body;
  console.log('url:', url);

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const pageText = $('body').text().replace(/\s+/g, ' ').trim();
    console.log('pageText: ', pageText);

    const analysis = await analyzeTextWithHuggingFace(pageText);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to analyze the page' });
  }
});

router.post('/fetch-and-clean', async (req: Request, res: Response): Promise<any> => {
  const { url } = req.body;

  console.log('Incoming request body:', req.body);

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const cleanedText = await fetchAndCleanHTML(url);
    res.json({ success: true, cleanedText });
  } catch (error) {
    console.error('Error fetching and cleaning HTML:', error);
    res.status(500).json({ success: false, message: 'Failed to clean the HTML' });
  }
});

router.post('/analyze-tone', async (req: Request, res: Response): Promise<any> => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const toneAnalysis = await analyzeTone(text);
    
    // Determine the highest tone
    const highestTone = toneAnalysis[0].reduce((prev: any, current: any) => {
      return (prev.score > current.score) ? prev : current;
    });

    res.json({ 
      success: true, 
      toneAnalysis, 
      highestTone: highestTone.label 
    });
  } catch (error) {
    console.error('Error analyzing tone:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze tone' });
  }
});

router.post('/analyze-spelling-grammar', async (req: Request, res: Response): Promise<any> => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  console.log("Input text for spelling and grammar analysis:", text); // Debug log

  try {
    const analysis = await analyzeSpellingAndGrammar(text);
    res.json({ success: true, analysis });
  } catch (error: unknown) {
    console.error("Error analyzing spelling and grammar:", error);
    res.status(500).json({ 
      success: false, 
      message: (error as Error).message || 'Internal server error' 
    });
  }
});


export default router;
