import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import path from "path";

import generateInterviewReport from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

const generateInterviewReportController = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Read pdf file & return binary data(buffer)
    const fileBuffer = fs.readFileSync(resumeFile.path);

    // pdfjsLib.getDocument() loads the PDF
    // new Uint8Array(fileBuffer) converts the buffer to the correct format
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(fileBuffer),
    }).promise;

    
    let resumeContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);  // .getPage() loads one page at time
      const textContent = await page.getTextContent(); // .getTextContent() extract text from page

      const pageText = textContent.items.map(item => item.str).join(" ");
      resumeContent += pageText + "\n";
    }

    const filePath = path.join(process.cwd(), resumeFile.path);
    await fs.promises.unlink(filePath);

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: userId,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      matchScore: interviewReportByAi.matchScore,
      technicalQuestions: interviewReportByAi.technicalQuestions,
      behavioralQuestions: interviewReportByAi.behavioralQuestions,
      skillGaps: interviewReportByAi.skillGaps,
      preparationPlan: interviewReportByAi.preparationPlan,
    });

    res.status(201).json({
      message: "Interview Report Generated Successfully",
      success: true,
      interviewReport,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to generate interview report.",
      success: false,
    });
  }
};

export { generateInterviewReportController };