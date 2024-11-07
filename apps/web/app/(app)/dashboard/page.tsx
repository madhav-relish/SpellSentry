"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ToneAnalysis {
  toneAnalysis: { label: string; score: number }[];
  highestTone: string;
}

function TextAnalysisApp() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [cleanedText, setCleanedText] = useState(null);
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis | null>(null);

  const handleAnalyze = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyze`,
        { url }
      );
      setAnalyzeResult(response.data.analysis);
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
  };

  const handleFetchAndClean = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch-and-clean`,
        { url }
      );
      setCleanedText(response.data.cleanedText);
    } catch (error) {
      console.error("Error fetching and cleaning HTML:", error);
    }
  };

  const handleAnalyzeTone = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyze-tone`,
        { text }
      );
      setToneAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing tone:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold text-center">Available Services</h1>
      <Card>
        <CardHeader>
          <CardTitle>Grammer and Spell Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
         <Link href={'/scan-website'} className="button "><Button>Get started Now</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default TextAnalysisApp;
