"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash"
})

export async function saveResume(content) {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) throw new Error("User not found!");

    try {
        const resume = await db.resume.upsert({
            where: {
                userId: user.id,
            },
            update: {
                content,
            },
            create: {
                userId: user.id,
                content
            }
        })
        revalidatePath("/resume");
        return resume;
    } catch (error) {
        console.error("Error saving resume", error.message);
        throw new Error("Failed to save resume");
    }
}

export async function getSavedResume() {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorised");

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        }
    })

    if (!user) throw new Error("Failed to fetch user: ",userId);

    try {
        const resumes = await db.resume.findUnique({
            where: {
                userId: user.id,
            }
        })

        return resumes;
    } catch (error) {
        console.error("Error getting resume", error.message);
        throw new Error("Failed to get resume details");
    }
}

export async function improveWithAi({ current, type }) {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorised");

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        }
    })

    if (!user) throw new Error("Failed to get user.");

    const prompt = `
        As an expert resume writer, improve the following ${type} description for a ${user.industry} professional. 
        Make it more impactful, quantifiable, and aligned with industry standards.

        Current content:
        "${current}"

        Requirements:
        1. Use strong action verbs
        2. Include measurable metrics and results where possible
        3. Highlight relevant technical skills
        4. Keep it concise but detailed
        5. Focus on achievements over responsibilities
        6. Use industry-specific keywords
        7. Do NOT use Markdown formatting (no asterisks, bold, italics, bullet points, or special symbols)

        Return only a single clean paragraph in plain text.
    `
    
    try {
        const res = await model.generateContent(prompt);
        const response = res.response;

        const textResponse = response.text().trim();

        return textResponse;
    } catch (error) {
        console.error("Failed in ai api call", error.message);
        throw new error(`Cannot generate ${type} with AI.`)
    }
}