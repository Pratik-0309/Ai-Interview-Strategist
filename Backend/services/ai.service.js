import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview", 
});


const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
  try {

    const prompt = `
      Analyze the following candidate data against the job description to generate a highly structured interview preparation report.
      
      ### INPUT DATA
      RESUME:
      ${resume}

      SELF-DESCRIPTION:
      ${selfDescription}

      JOB DESCRIPTION:
      ${jobDescription}

      ### OUTPUT FORMAT REQUIREMENTS
      You must return a JSON object that strictly follows this detailed structure:

      1. "matchScore": A number (0-100) representing how well the candidate's skills align with the job requirements.
      
      2. "technicalQuestions": An array of objects. Each object MUST contain:
         - "question": A specific technical question tailored to the candidate's MERN stack experience and the job role.
         - "intention": An explanation of why an interviewer would ask this (e.g., "To evaluate understanding of JWT middleware").
         - "answer": A comprehensive guide on how the candidate should answer, including key concepts (e.g., "Mention bcrypt for hashing and salt rounds").

      3. "behavioralQuestions": An array of objects. Each object MUST contain:
         - "question": A soft-skills or situational question.
         - "intention": The personality trait being assessed (e.g., "To evaluate conflict resolution in a team").
         - "answer": A suggested response structure using the STAR method (Situation, Task, Action, Result).

      4. "skillGaps": An array of objects identifying what the candidate is missing:
         - "skill": The name of the missing or weak skill (e.g., "Docker" or "System Design").
         - "severity": Must be exactly one of: "low", "medium", or "high", based on its importance in the job description.

      5. "preparationPlan": A 5-day step-by-step roadmap array:
         - "day": The day number (1, 2, 3, 4, 5).
         - "focus": The main topic for that day (e.g., "Advanced Database Queries").
         - "tasks": An array of specific strings describing tasks to complete (e.g., "Practice aggregation pipelines in MongoDB").

      ### CRITICAL INSTRUCTION:
      Return ONLY valid JSON. Do not include any text before or after the JSON. Do not use markdown code blocks like \`\`\`json.
    `;

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = response.response.text();
    return JSON.parse(result);

  } catch (error) {
    console.error("Error generating interview report:", error);
    throw error;
  }
};

export default generateInterviewReport;