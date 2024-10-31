import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY as string;
console.log("HUGGING_FACE_API_KEY: ", HUGGING_FACE_API_KEY);

const MAX_TOKENS = 512; // Maximum tokens for the model

// Function to truncate text to a max token limit
const truncateText = (text: string): string => {
  const words = text.split(" ");
  return words.slice(0, MAX_TOKENS).join(" ");
};

// Function to analyze text with Hugging Face using the GPT-2 model
export const analyzeTextWithHuggingFace = async (text: string): Promise<string> => {
  try {

    const truncatedText = truncateText(text);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      { inputs: truncatedText },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error in Hugging Face API:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
    throw new Error("Failed to analyze text with Hugging Face");
  }
};
