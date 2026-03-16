import {
  generateInterviewReport,
  getInterviewReportById,
  getUserInterviewReport,
} from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";
import toast from "react-hot-toast";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("UseInterview must be within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    resumeFile,
    selfDescription,
    jobDescription,
  }) => {
    setLoading(true);
    try {
      const data = await generateInterviewReport({
        resumeFile,
        selfDescription,
        jobDescription,
      });
      setReport(data.interviewReport);
      toast.success(data.message);
      return data.interviewReport;
    } catch (error) {
      toast.error("Failed to generate report");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const data = await getInterviewReportById(interviewId);
      setReport(data.interviewReport);
      toast.success(data.message);
      return data.interviewReport;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const data = await getUserInterviewReport();
      setReports(data.interviewReports);
      toast.success(data.message);
      return data.interviewReports;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};
