import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

export const analyzeText = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-?", // todo: add a free version
        prompt: `Analyze the following text for spelling, grammar, and tone: "${text}"`,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error in OpenAI API:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
    throw new Error("Failed to analyze text");
  }
};
