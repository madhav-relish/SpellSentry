import { Router, Request, Response } from "express";
import axios from "axios";
import * as cheerio from 'cheerio';
import { analyzeTextWithHuggingFace } from "../services/huggingFaceService";

const router = Router();

router.post("/analyze", async (req: Request, res: Response) => {
  const { url } = req.body;
  console.log("url:", url);

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const pageText = $("body").text().replace(/\s+/g, " ").trim();
    console.log("pageText: ", pageText);


    const analysis = await analyzeTextWithHuggingFace(pageText);

    res.json({ success: true, analysis });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to analyze the page" });
  }
});
export default router;
