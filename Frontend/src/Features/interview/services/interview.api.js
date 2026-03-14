import axiosInstance from "../../auth/utils/axiosInstance.js";


const generateInterviewReport = async({ resumeFile, selfDescription, jobDescription }) => {
    try {
        const formData = new FormData();
        formData.append("selfDescription", selfDescription);
        formData.append("jobDescription", jobDescription);
        formData.append("resume", resumeFile);

        const response = await axiosInstance.post("/api/interview", formData);

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getInterviewReportById = async(interviewId) => {
    try {
        const response = await axiosInstance.get(`/api/interview/report/${interviewId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getUserInterviewReport = async() => {
    try {
        const response = await axiosInstance.get("/api/interview");
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {generateInterviewReport, getInterviewReportById, getUserInterviewReport};