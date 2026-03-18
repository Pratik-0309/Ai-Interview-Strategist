import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv, { config } from "dotenv"
import puppeteer from "puppeteer";
import z from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview", 
});


const extractJson = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found in response");
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Extraction Failed. Raw text:", text);
    throw new Error("Failed to parse AI response as JSON.");
  }
};

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
      
      2. "technicalQuestions":(7 Objects) An array of objects. Each object MUST contain:
         - "question": A specific technical question tailored to the candidate's MERN stack experience and the job role.
         - "intention": An explanation of why an interviewer would ask this (e.g., "To evaluate understanding of JWT middleware").
         - "answer": A comprehensive guide on how the candidate should answer, including key concepts (e.g., "Mention bcrypt for hashing and salt rounds").

      3. "behavioralQuestions": (7 Objects) An array of objects. Each object MUST contain:
         - "question": A soft-skills or situational question.
         - "intention": The personality trait being assessed (e.g., "To evaluate conflict resolution in a team").
         - "answer": A suggested response structure using the STAR method (Situation, Task, Action, Result).

      4. "skillGaps": An array of objects identifying what the candidate is missing:
         - "skill": The name of the missing or weak skill (e.g., "Docker" or "System Design").
         - "severity": Must be exactly one of: "low", "medium", or "high", based on its importance in the job description.

      5. "preparationPlan": A 7-day step-by-step roadmap array:
         - "day": The day number (1, 2, 3, 4, 5, 6, 7).
         - "focus": The main topic for that day (e.g., "Advanced Database Queries").
         - "tasks": An array of specific strings describing tasks to complete (e.g., "Practice aggregation pipelines in MongoDB").

      6. "title": The job role for which the interview preparation report is generated (e.g., "MERN Stack Developer", "AI/ML Engineer").
      - It should be a string type

      ### CRITICAL INSTRUCTION:
      Return ONLY valid JSON. Do not include any text before or after the JSON. Do not use markdown code blocks like \`\`\`json.
    `;

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    return extractJson(response.response.text());

  } catch (error) {
    console.error("Error generating interview report:", error);
    throw error;
  }
};


const getGeminiSchema = (zodObj) => {
    const jsonSchema = zodToJsonSchema(zodObj);
    delete jsonSchema.$schema;
    return jsonSchema;
};

export const generatePdfFromHtml = async (htmlContent) => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        // Set content and wait for it to render
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        
        const pdfBuffer = await page.pdf({ 
            format: "A4",
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Puppeteer Error:", error);
        throw error;
    }
};

export const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
    try {
        const resumePdfSchema = {
            type: "object",
            properties: {
                html: {
                    type: "string",
                    description: "A complete, valid HTML5 document string including <head>, <style>, and <body> tags."
                }
            },
            required: ["html"]
        };

        const prompt = `Generate a clean, professional, ATS-friendly resume in HTML format using the following inputs:

          Resume: ${resume}
          Self Description: ${selfDescription}
          Job Description: ${jobDescription}

          ---

          ### OUTPUT FORMAT (STRICT):

          Return ONLY a valid JSON object:
          {
            "html": "<!DOCTYPE html> ...complete resume HTML..."
          }

          - Do NOT include any explanation or extra text
          - Ensure JSON is valid and properly escaped

          ---

          ### STRICT DATA RULES (VERY IMPORTANT):

          - Use ONLY the data provided in "Resume"
          - DO NOT generate or assume any missing personal details (name, email, phone, links)
          - DO NOT create fake or random data
          - If any field is missing, skip it
          - Do NOT modify existing data

          ---

          ### RESUME REQUIREMENTS:

          - ATS-friendly, single-column layout
          - No tables, images, icons, or complex design
          - Use only basic HTML tags:
            <div>, <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <hr>
          - Use <hr> to separate sections
          - Section titles must be in ALL CAPS
          - Keep layout clean and readable (Puppeteer-friendly)

          ---

          ### STRUCTURE (STRICT ORDER):

          1. Full Name (from Resume only)
          2. Contact Line: Location | Phone | Email | LinkedIn | GitHub
          3. PROFESSIONAL SUMMARY
            - Use Self Description
            - Tailor slightly based on Job Description
          4. TECHNICAL SKILLS (grouped categories)
          5. WORK EXPERIENCE (latest first)
            - Role, Company, Duration
            - Bullet points with action verbs
          6. PROJECTS
            - Name, description, tech stack
          7. EDUCATION
          8. CERTIFICATIONS / ACHIEVEMENTS (if available)

          ---

          ### CONTENT GUIDELINES:

          - Use strong action verbs (Developed, Analyzed, Optimized)
          - Include measurable impact ONLY if present in Resume
          - Align skills and summary with Job Description
          - Keep concise, professional, and relevant
          - Avoid repetition and filler words

          ---

          Generate the final response now.
          `;

        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema 
            }
        });

        const result = response.response.text(); 
        const jsonContent = JSON.parse(result);

        if (!jsonContent || !jsonContent.html || jsonContent.html.length < 100) {
            throw new Error("AI failed to generate a complete HTML content.");
        }

        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
        
        return pdfBuffer;
        
    } catch (error) {
        console.error("AI Resume Generation Error:", error);
        throw error;
    }
};


export default generateInterviewReport;