"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { use } from "react";
import { success } from "zod";
import { generateAiInsights } from "./dashboard";

export const updateUser = async (data) => {
    const { userId } = await auth();
    
    if (!userId) throw new Error("Unauthorised!");

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        }
    });

    if (!user) throw new Error("User not found!");
    
    try {
        const res = await db.$transaction(async (tx) => {
            // find if industry exists or not
            // We will use the transaction feature for this. This will enable that, all the above 3
            // process will complete. If any of the 3api calls fail, then the transaction will fail
            // giving us the error.
            
            let industryInsight = await tx.industryInsights.findUnique({
                where: {
                    industry: data.industry
                }
            })
            
            // if does not exists, then create it with default values - afterwards will be dynamic
            if (!industryInsight) {
                const insights = await generateAiInsights(data.industry);
                
                industryInsight = await tx.industryInsights.create({
                    data: {
                        industry: data.industry,
                        ...insights,
                        nextUpdate: new Date(Date.now() + 7*24*60*60*1000),
                    }
                });
            }

            // update the user
            const updatedUser = await tx.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    industry: data.industry,
                    bio: data.bio,
                    experience: data.experience,
                    skills: data.skills
                }
            })

            return { updatedUser, industryInsight }
        }, { timeout: 20000 })
        
        return {success: true, ...res};
    } catch (error) {
        console.error("Failed to update user and industry: ", error.message);
        throw new Error("Failed to update profile: "+error.message);
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();

    if(!userId) throw new Error("Unauthrized");

    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        },
    });

    if (!user) throw new Error("User not found!");

    try {
        const user = await db.user.findUnique({
            where: {
                clerkId: userId,
            },
            select: {
                industry: true,
            }
        })

        return {
            isOnboarded: !!user?.industry,
        };
    } catch (error) {
        console.error("Error checking onboarding status: ", error.message);
        throw new Error("Failed to check onboarding status!");
    }
}