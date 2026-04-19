"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export const generateAiInsights = async(industry) => {
    const prompt = `Analyze the current (2026) state of the ${industry} industry.

        Provide realistic market-based estimates.

        Return ONLY valid JSON in the exact structure below.
        Do NOT include explanations, markdown, notes, or code blocks.

        {
        "salaryRange": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
        ],
        "growthRate": number,
        "demandLevel": "HIGH" | "MEDIUM" | "LOW",
        "topSkills": ["skill1", "skill2"],
        "marketCond": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
        "keyOutlook": ["trend1", "trend2"],
        "recommendedSkills": ["skill1", "skill2"]
        }

        IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
        Growth rate should be a percentage.

        Requirements:
        - Include at least 5 salary roles.
        - Include at least 5 topSkills.
        - Include at least 5 keyTrends.
        - Growth rate must be a realistic percentage.
        `;
    
    const res = await model.generateContent(prompt);
    const response = res.response;

    const textResponse = response.text();

    const cleanedText = textResponse.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
}

export async function getIndustryInsights() {

    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorised");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        },
        include: {
            industryInsight: true,
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.industryInsight) {
        const insights = await generateAiInsights(user.industry);

        const industryInsight = await db.industryInsights.create({
            data: {
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7*24*60*60*1000),
            }
        });

        return industryInsight;
    }

    return user.industryInsight;
}