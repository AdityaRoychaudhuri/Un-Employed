"use server"
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cache } from 'react';

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export async function generateQuiz() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorised');
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        }
    })

    if (!user) {
        throw new Error("User not found.")
    }

    try {
        const prompt = `Generate 10 technical interview questions for a ${
        user.industry
        } professional${
        user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
        
        Each question should be multiple choice with 4 options.
        
        Return the response in this JSON format only, no additional text:
        {
        "questions": [
            {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "string",
            "explanation": "string"
            }
        ]
        }`;

        const res = await model.generateContent(prompt);
        const response = res.response;

        const textResponse = response.text();
        const cleanedText = textResponse.replace(/```(?:json)?\n?/g, "").trim();

        const quiz = JSON.parse(cleanedText);

        return quiz.questions;
    } catch (error) {
        console.error("Failed to generate industry!", error.message);
        throw new Error(error.message);
    }
}

export async function savedQuizResults(questions, answers, score) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorised');
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        }
    })

    if (!user) {
        throw new Error("User not found.")
    }

    const quesResult = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation
    }));


    const wrongAns = quesResult.filter((q) => !q.isCorrect)

    let improvementTip = null;
    if (wrongAns.length > 0) {
        const wrongAnsText = wrongAns.map((q) => 
            `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        ).join("\n\n")

        const improvementPrompt = `
            The user got the following ${user.industry} technical interview questions wrong:

            ${wrongAnsText}

            Based on these mistakes, provide a concise, specific improvement tip.
            Focus on the knowledge gaps revealed by these wrong answers.
            Keep the response under 3 sentences and make it encouraging.
            Don't explicitly mention the mistakes, instead focus on what to learn/practice.
            `
        
        try {
            const res = await model.generateContent(improvementPrompt);
            const response = res.response;

            improvementTip = response.text().trim();
            
        } catch (error) {
            console.error("Error generating improvement tip!", error.message);
            throw new Error("Failed to generate improvement tip"+error.message);
        }
    }

    try {
        const assessment = db.assesment.create({
            data: {
                userId: user.id,
                quizScore: score,
                questions: quesResult,
                category: "Technical",
                improvementTip: improvementTip,
            },
        });

        return assessment;
    } catch (error) {
        console.error("Error saving assessments/quiz result!", error.message);
        throw new Error("DB error: "+error.message);
    }
}

export const getAssessmentData = cache(async() => {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorise");


    try {
        const assesments = await db.assesment.findMany({
            where: {
                user: {
                    clerkId: userId
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10
        })

        return assesments;
    } catch (error) {
        console.error("Cannot fetch assessments.")
        throw new Error(error.message);
    }
})