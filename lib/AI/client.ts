'use server';

import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse, Message } from 'ai';

// Initialize AI providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate content with Gemini model
 */
export async function generateWithGemini(prompt: string, options?: {
  temperature?: number;
  maxOutputTokens?: number;
  stream?: boolean;
}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: options?.temperature || 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: options?.maxOutputTokens || 4096,
      },
    });

    // Handle streaming if requested
    if (options?.stream) {
      const result = await model.generateContentStream({ text: prompt });
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        }
      });
      return new StreamingTextResponse(stream);
    }

    // Regular non-streaming response
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content with Gemini');
  }
}

/**
 * Generate content with OpenAI
 */
export async function generateWithOpenAI(messages: Message[], options?: {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  model?: string;
}) {
  try {
    if (options?.stream) {
      const response = await openai.chat.completions.create({
        model: options?.model || 'gpt-3.5-turbo',
        messages: messages as any[],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2048,
        stream: true,
      });

      return new StreamingTextResponse(response.toReadableStream());
    }
    
    const response = await openai.chat.completions.create({
      model: options?.model || 'gpt-3.5-turbo',
      messages: messages as any[],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2048,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content with OpenAI');
  }
}

/**
 * Generate structured content with retry logic
 */
export async function generateStructuredContent<T>(
  prompt: string, 
  validateFn: (data: any) => { valid: boolean; data?: T; errors?: any },
  options?: {
    provider?: 'gemini' | 'openai';
    maxAttempts?: number;
    temperature?: number;
  }
) {
  const provider = options?.provider || 'gemini';
  const maxAttempts = options?.maxAttempts || 3;
  let attempts = 0;
  let lastResponse = '';
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      // Generate response based on provider
      const response = provider === 'gemini'
        ? await generateWithGemini(prompt, { temperature: options?.temperature })
        : await generateWithOpenAI([{ role: 'user', content: prompt }], { temperature: options?.temperature });
      
      lastResponse = response as string;
      
      // Validate response
      const validation = validateFn(lastResponse);
      
      if (validation.valid && validation.data) {
        return {
          success: true,
          data: validation.data,
          attempts,
        };
      }
      
      // If invalid, refine the prompt with error feedback
      prompt = `
I tried to generate a structured response but received these errors:
${JSON.stringify(validation.errors || 'Invalid format')}

Please fix these issues and provide a response that strictly follows the specified format.

Original prompt:
${prompt}
`;
      
    } catch (error) {
      console.error(`Error on attempt ${attempts}:`, error);
    }
  }
  
  // If all attempts failed
  throw new Error(`Failed to generate valid structured content after ${maxAttempts} attempts. Last response: ${lastResponse}`);
}

/**
 * Generate with feedback for iterative improvement
 */
export async function regenerateWithFeedback<T>(
  originalPrompt: string,
  originalResponse: any,
  feedback: string,
  validateFn: (data: any) => { valid: boolean; data?: T; errors?: any },
  options?: {
    provider?: 'gemini' | 'openai';
    temperature?: number;
  }
) {
  const provider = options?.provider || 'gemini';
  
  const feedbackPrompt = `
I previously generated this response:
${JSON.stringify(originalResponse, null, 2)}

Based on this feedback:
"${feedback}"

I need to create an improved version that addresses this feedback while maintaining the same structure.
Please provide a complete response that incorporates the feedback.

Original request:
${originalPrompt}
`;

  try {
    // Generate improved response with feedback
    const response = provider === 'gemini'
      ? await generateWithGemini(feedbackPrompt, { temperature: options?.temperature || 0.5 })
      : await generateWithOpenAI([{ role: 'user', content: feedbackPrompt }], { temperature: options?.temperature || 0.5 });
    
    // Validate response
    const validation = validateFn(response);
    
    if (validation.valid && validation.data) {
      return {
        success: true,
        data: validation.data,
      };
    }
    
    throw new Error('Generated response did not pass validation');
  } catch (error) {
    console.error('Error regenerating with feedback:', error);
    throw new Error('Failed to regenerate content based on feedback');
  }
}
