import { db } from "../prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" },
  async ({step}) => {
    const industries = await step.run("Fetch Industries", async () => {
      return await db.industryInsights.findMany({
        select: {
          industry: true,
        }
      })
    })

    for (const {industry} of industries){
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
        - Include at least 5 keyOutlook.
        - Growth rate must be a realistic percentage.
        `;
      
      const res = await step.ai.wrap("Gemini api", async (p) => {
        return await model.generateContent(prompt);
      }, prompt);

      console.log("===== RAW RES =====");
      console.log(JSON.stringify(res, null, 2));

      const textResponse = res?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const cleanedText = textResponse.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsights.update({
          where: {
            industry: industry
          },
          data: {
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7*24*60*60*1000),
          }
        });
      });
    }
  }
)