'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ToneAnalysis {
  toneAnalysis: { label: string; score: number }[];
  highestTone: string;
}

function TextAnalysisApp() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [cleanedText, setCleanedText] = useState(null);
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis | null>(null);

  const handleAnalyze = async () => {
    try {
      const response = await axios.post('http://localhost:9001/api/analyze', { url });
      setAnalyzeResult(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  };

  const handleFetchAndClean = async () => {
    try {
      const response = await axios.post('http://localhost:9001/api/fetch-and-clean', { url });
      setCleanedText(response.data.cleanedText);
    } catch (error) {
      console.error('Error fetching and cleaning HTML:', error);
    }
  };

  const handleAnalyzeTone = async () => {
    try {
      const response = await axios.post('http://localhost:9001/api/analyze-tone', { text });
      setToneAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing tone:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold text-center">Text Analysis Tool</h1>

      <Card>
        <CardHeader>
          <CardTitle>Analyze URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="text" 
            placeholder="Enter URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
          />
          <Button className="w-full" onClick={handleAnalyze}>
            Analyze Text with Hugging Face
          </Button>
          <Button className="w-full" onClick={handleFetchAndClean}>
            Fetch and Clean HTML
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Tone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="text" 
            placeholder="Enter text for tone analysis" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
          />
          <Button className="w-full" onClick={handleAnalyzeTone}>
            Analyze Tone
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-6">
        {analyzeResult && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-600 p-4 rounded whitespace-pre-wrap break-words overflow-x-auto">{JSON.stringify(analyzeResult, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {cleanedText && (
          <Card>
            <CardHeader>
              <CardTitle>Cleaned HTML Text</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-600 p-4 rounded whitespace-pre-wrap break-words overflow-x-auto">{cleanedText}</pre>
            </CardContent>
          </Card>
        )}

        {toneAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>Tone Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Highest Tone: {toneAnalysis.highestTone}</p>
              <pre className="text-sm bg-gray-600 p-4 rounded whitespace-pre-wrap break-words overflow-x-auto">{JSON.stringify(toneAnalysis.toneAnalysis, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TextAnalysisApp;
