"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scanWebsiteSchema, type ScanWebsiteInput, type ScanResult } from "@/lib/schema";
import { toastError, toastSuccess } from "@/components/ui/toast";
import axios from "axios";

export const WebsiteScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanWebsiteInput>({
    resolver: zodResolver(scanWebsiteSchema),
  });

  const onSubmit = useCallback(async (data: ScanWebsiteInput) => {
    setIsScanning(true);
    try {
        console.log(data)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scan`, data);
      setResults(response.data.data);
      toastSuccess({
        description: "Website scanned successfully!",
      });
    } catch (error) {
      toastError({
        title: "Error scanning website",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsScanning(false);
    }
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Website Grammar Scanner</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Scan Website</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter website URL"
              {...register("url")}
            />
            <Button type="submit" disabled={isScanning}>
              {isScanning ? "Scanning..." : "Scan Website"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spelling Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                {results.spelling.map((error, i) => (
                  <li key={i}>
                    <span className="text-red-500">{error.incorrect}</span> →{" "}
                    <span className="text-green-500">{error.correction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grammar Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                {results.grammar.map((error, i) => (
                  <li key={i}>
                    <span className="text-red-500">{error.incorrect}</span> →{" "}
                    <span className="text-green-500">{error.correction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebsiteScanner;