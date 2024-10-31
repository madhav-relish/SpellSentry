import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY as string;

export const analyzeTone = async (text: string): Promise<any> => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return tone analysis
  } catch (error) {
    console.error("Error in Hugging Face API:", error);
    throw new Error("Failed to analyze tone");
  }
};
