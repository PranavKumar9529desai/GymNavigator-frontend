import { z } from "zod";

/**
 * Extract JSON from a string that might contain markdown or explanatory text
 */
export function extractJsonFromString(text: string): unknown | null {
  try {
    // Try to parse the string directly first
    try {
      return JSON.parse(text);
    } catch (_e) {
      // Not a direct JSON string, try to extract JSON
    }

    // Look for JSON object pattern
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Look for JSON patterns in code blocks (common in AI responses)
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return JSON.parse(codeBlockMatch[1]);
    }

    // If we can't find a JSON object, return null
    return null;
  } catch (error) {
    console.error("Failed to extract JSON from string:", error);
    return null;
  }
}

/**
 * Validate AI response against schema and extract structured data
 */
export function validateResponseWithSchema<T>(
  response: string,
  schema: z.ZodType<T>
): { valid: boolean; data?: T; errors?: z.ZodError } {
  try {
    // Extract JSON from response
    const extractedData = extractJsonFromString(response);

    if (!extractedData) {
      return {
        valid: false,
        errors: new z.ZodError([
          {
            code: "custom",
            message: "No JSON data found in response",
            path: [],
          },
        ]),
      };
    }

    // Validate against schema
    const result = schema.safeParse(extractedData);

    if (result.success) {
      return {
        valid: true,
        data: result.data,
      };
    }

    return {
      valid: false,
      errors: result.error,
    };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      valid: false,
      errors:
        error instanceof z.ZodError
          ? error
          : new z.ZodError([
              {
                code: "custom",
                // @ts-ignore
                message: error.message || "Unknown error during validation",
                path: [],
              },
            ]),
    };
  }
}
