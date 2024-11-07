"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

// Define form schema
const scanWebsiteSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

type ScanWebsiteInputs = z.infer<typeof scanWebsiteSchema>;

export default function ScanWebsitePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [spellingErrors, setSpellingErrors] =  useState<any[]>([]);
  const [grammaticalErrors, setGrammaticalErrors] =  useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanWebsiteInputs>({
    resolver: zodResolver(scanWebsiteSchema),
  });

  const onSubmit: SubmitHandler<ScanWebsiteInputs> = async (data) => {
    try {
      setIsScanning(true);

      // First add the website
      const addResponse = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.url }),
      });

      const addResult = await addResponse.json();

      if (!addResponse.ok) {
        throw new Error(addResult.error || 'Failed to add website');
      }

      // Then scan it
      const scanResponse = await fetch(`/api/websites/${addResult.data.id}/scan`, {
        method: 'POST',
      });

      const scanResult = await scanResponse.json();

      if (!scanResponse.ok) {
        throw new Error(scanResult.error || 'Failed to scan website');
      }

      setScanResult(scanResult.data);
          // Separate errors based on type
          const spelling = scanResult.data.errors.filter((error: any) => error.type === 'spelling');
          const grammar = scanResult.data.errors.filter((error: any) => error.type === 'grammar');
    
          setSpellingErrors(spelling);
          setGrammaticalErrors(grammar);
      console.log(scanResult.data)
      toast.success('Website scanned successfully!');
    } catch (error) {
      console.error('Error scanning website:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to scan website');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Scan Website</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://example.com"
              {...register('url')}
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Scan Website"}
          </Button>
        </form>
      </Card>

      {scanResult && (
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Scan Results</h2>
          <div className="space-y-4">            
            <div>
              <h3 className="font-medium mb-2">Spelling Mistakes Found:</h3>
              <div className="space-y-2">
              {spellingErrors.length === 0 ?
                <div className='p-3 bg-red-50 rounded-md h-10'>Wohoo! Spellings on your page seems correct! </div>
                :spellingErrors?.map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-md">
                  <p className="text-red-600 font-medium">  <span>Error:</span>{error.word}</p>
                   <p className="text-green-600 font-medium"> <span>Suggestion: </span>{error.suggestion}</p>
                    <p className="text-xs text-gray-500">Where: {error.context}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Grammatical Mistakes Found:</h3>
              <div className="space-y-2">
                {grammaticalErrors.length === 0 ?
                <div>Wohoo! Grammer on your page seems correct! </div>
                : grammaticalErrors?.map((error, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-md">
                    <p className="text-yellow-600 font-medium">{error.word}</p>
                    <p className="text-sm text-gray-600">Suggestion: {error.suggestion}</p>
                    <p className="text-xs text-gray-500">Context: {error.context}</p>
                    <p className="text-xs text-gray-500">Explaination: {error.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}