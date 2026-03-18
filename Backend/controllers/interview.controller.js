import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import path from "path";

import generateInterviewReport from "../services/ai.service.js";
import { generateResumePdf } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

const generateInterviewReportController = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    let resumeContent = "";

    if (resumeFile) {
      // Read pdf file & return binary data(buffer)
      const fileBuffer = fs.readFileSync(resumeFile.path);

      // pdfjsLib.getDocument() loads the PDF
      // new Uint8Array(fileBuffer) converts the buffer to the correct format
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(fileBuffer),
      }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); // .getPage() loads one page at time
        const textContent = await page.getTextContent(); // .getTextContent() extract text from page

        const pageText = textContent.items.map((item) => item.str).join(" ");
        resumeContent += pageText + "\n";
      }

      const filePath = path.join(process.cwd(), resumeFile.path);
      await fs.promises.unlink(filePath);
    }

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
      title: interviewReportByAi.title,
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

const getInterviewReportById = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getUserInterviewReport = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(403).json({
        message: "User is not logged in",
        success: false,
      });
    }

    const interviewReports = await interviewReportModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .select(
        "-resume -jobDescription -selfDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v",
      );

    return res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const generateResumePdfController = async(req,res) => {
  try {
    const {interviewReportId} = req.params;
    const interviewReport = await interviewReportModel.findOne({_id: interviewReportId });

    if(!interviewReport){
      return res.status(404).json({
        message: "Interview not found",
        success: false
      })
    }

    const {resume, jobDescription, selfDescription} = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription});

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    })
  }
}

export {
  generateInterviewReportController,
  getInterviewReportById,
  getUserInterviewReport,
  generateResumePdfController
};
