"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash"
})

export const getCoverLetters = async() => {
    const { userId } = await auth();

    if (!userId){
        console.log("User is not registered.");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    const coverLetters = await db.coverLetter.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return coverLetters;
}

export const generateCoverLetter = async (data) => {
    const { userId } = await auth();

    if (!userId){
        console.log("User is not registered.");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    const prompt = `
        Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
        
        About the candidate:
        - Industry: ${user.industry}
        - Years of Experience: ${user.experience}
        - Skills: ${user.skills?.join(", ")}
        - Professional Background: ${user.bio}
        
        Job Description:
        ${data.jobDescription}
        
        Requirements:
        1. Use a professional, enthusiastic tone
        2. Highlight relevant skills and experience
        3. Show understanding of the company's needs
        4. Keep it concise (max 400 words)
        5. Use proper business letter formatting in markdown
        6. Include specific examples of achievements
        7. Relate candidate's background to job requirements
        
        Format the letter in markdown.
    `

    try {
        const res = await model.generateContent(prompt);
        const response = res.response.text().trim();

        const coverLetter = await db.coverLetter.create({
            data: {
                content: response,
                jobDesc: data.jobDescription,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                userId: user.id,
            }
        })

        return coverLetter;
    } catch (error) {
        console.error("Failed in an api call", error.message);
        throw new error(`Cannot generate cover letter with AI.`)
    }
}

export const getCoverLetter = async (id) => {
    const { userId } = await auth();

    if (!userId) {
        console.error("User not registered");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const coverLetter = await db.coverLetter.findUnique({
            where: {
                id: id,
                userId: user.id,
            }
        })

        return coverLetter;
    } catch (error) {
        console.error("Cannot retrieve the cover letter", error.message);
        throw new error(`Cannot retrieve cover letter from DB.`);
    }
}

export const updateCoverLetter = async (content, id) => {
    const { userId } = await auth();

    if (!userId) {
        console.error("User not registered");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const coverLetter = await db.coverLetter.update({
            where: {
                id
            },
            data: {
                content
            }
        })
    } catch (error) {
        
    }
}

export const deleteCoverLetter = async (id) => {
    const { userId } = await auth();

    if (!userId) {
        console.error("User not registered");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const del = await db.coverLetter.delete({
            where: {
                userId: user.id,
                id: id
            }
        })

        return del;
    } catch (error) {
        console.error(`Cannot delete cover letter of id: ${id}`, error.message);
        throw new error("Failed to delete cover letter");
    }
}