import { Router, Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { analyzeText } from "../services/openaiService";

const router = Router();

router.post("/analyze", async (req: Request, res: Response) => {
  const { url } = req.body;

  try {
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html);

    const pageText = $("body").text().replace(/\s+/g, " ").trim();

    // send to ai
    const analysis = await analyzeText(pageText);

    res.json({ success: true, analysis });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to analyze the page" });
  }
});

export default router;
