import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY as string;

export const analyzeSpellingAndGrammar = async (text: string): Promise<any> => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/grammarly/coedit-large',
      { inputs: `Fix grammatical errors in this sentence: ${text}` },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; 
  } catch (error: unknown) {
    console.error(error);
    throw new Error("Failed to analyze text for spelling and grammar");
  }
};
