import httpStatus from 'http-status';
import AppError from "../errors/AppError";

export const extractJsonForFetch = (message: any) => {
  try {
    // First, try to extract JSON from a code block
    const content = message?.content || "";

    const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      const jsonText = jsonBlockMatch[1].trim();
      return JSON.parse(jsonText);
    }

    // If no code block, check if the content itself is JSON
    if (content.trim().startsWith("[") || content.trim().startsWith("{")) {
      return JSON.parse(content);
    }

    // As a last resort, try to extract any JSON-like substring from the content
    const jsonFallbackMatch = content.match(/({[\s\S]*})|(\[[\s\S]*\])/);
    if (jsonFallbackMatch) {
      return JSON.parse(jsonFallbackMatch[1] || jsonFallbackMatch[2]);
    }

    // If all parsing attempts fail, return an empty array or handle as needed
    return [];
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to parse AI response",
    );
  }
};