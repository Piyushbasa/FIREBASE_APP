
'use server';
/**
 * @fileOverview An AI agent that generates quiz questions about farming.
 *
 * - getQuizQuestion - A function that generates a quiz question on a given topic.
 * - QuizQuestionInput - The input type for the getQuizQuestion function.
 * - QuizQuestionOutput - The return type for the getQuizQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuizQuestionInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz question (e.g., "Soil Health", "Pest Control").'),
  language: z.string().optional().default('English').describe('The language for the quiz question and explanation.'),
});
export type QuizQuestionInput = z.infer<typeof QuizQuestionInputSchema>;

const QuizQuestionOutputSchema = z.object({
    question: z.string().describe('The multiple-choice question.'),
    options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options array.'),
    explanation: z.string().describe('A brief explanation of why the answer is correct.'),
});
export type QuizQuestionOutput = z.infer<typeof QuizQuestionOutputSchema>;


export async function getQuizQuestion(input: QuizQuestionInput): Promise<QuizQuestionOutput> {
    return quizFlow(input);
}


const prompt = ai.definePrompt({
    name: 'quizQuestionPrompt',
    input: { schema: QuizQuestionInputSchema },
    output: { schema: QuizQuestionOutputSchema },
    prompt: `You are an Agricultural Sciences professor creating a quiz for Indian farmers.
Generate a single, clear, multiple-choice question about the following topic: {{{topic}}}.

The question should be relevant to Indian farming practices. Provide four distinct options, one of which is clearly correct.
Also, provide a brief, easy-to-understand explanation for the correct answer.

Your entire response MUST be in the user's preferred language: {{{language}}}.
The final output must be a valid JSON object matching the requested schema.
`,
});

const quizFlow = ai.defineFlow(
  {
    name: 'quizFlow',
    inputSchema: QuizQuestionInputSchema,
    outputSchema: QuizQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
