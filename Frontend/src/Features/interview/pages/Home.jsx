import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hook/useInterview.js";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const { loading, generateReport, reports, getReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const resumeFile = resumeInputRef.current?.files[0];

      if (!jobDescription) {
        return toast.error("Job description is required");
      }

      if (!resumeFile && !selfDescription) {
        return toast.error("Please provide a resume or a self-description");
      }

      const data = await generateReport({
        resumeFile,
        selfDescription,
        jobDescription,
      });

      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading && !reports.length) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      <div className="interview-card">
        <div className="interview-card__body">
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
              className="panel__textarea"
              placeholder={`Paste the full job description here...`}
              maxLength={5000}
            />
            <div className="char-counter">{jobDescription.length} / 5000 chars</div>
          </div>

          <div className="panel-divider" />

          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2>Your Profile</h2>
            </div>

            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>
              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </span>
                <p className="dropzone__title">
                  {fileName ? `Selected: ${fileName}` : "Click to upload or drag & drop"}
                </p>
                <p className="dropzone__subtitle">PDF (Max 5MB)</p>
                <input
                  hidden
                  ref={resumeInputRef}
                  type="file"
                  id="resume"
                  accept=".pdf"
                  onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                />
              </label>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => setSelfDescription(e.target.value)}
                value={selfDescription}
                id="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience..."
              />
            </div>

            <div className="info-box">
              <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required.</p>
            </div>
          </div>
        </div>

        <div className="interview-card__footer">
          <span className="footer-info">AI-Powered Strategy Generation &bull; Approx 30s</span>
          <button 
            onClick={handleGenerateReport} 
            className="generate-btn" 
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate My Interview Strategy"}
          </button>
        </div>
      </div>

      {reports && reports.length > 0 && (
        <section className="history-section">
          <h2 className="history-title">Your Recent Interview Strategies</h2>
          <div className="history-grid">
            {reports.map((report) => (
              <Link 
                to={`/interview/${report._id}`} 
                key={report._id} 
                className="history-card"
              >
                <div className="history-card__header">
                  <h3>{report.title || "Untitled Strategy"}</h3>
                  <span className={`match-badge match-badge--${report.matchScore >= 80 ? 'high' : 'mid'}`}>
                    {report.matchScore}% Match
                  </span>
                </div>
                <p className="history-card__date">
                  {new Date(report.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <div className="history-card__footer">
                   <span>View Plan &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;