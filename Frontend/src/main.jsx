import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Features/auth/auth.context.jsx";
import { InterviewProvider } from "./Features/interview/interview.context.jsx";
import App from "./App.jsx";
import "./style.scss";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </AuthProvider>
  </BrowserRouter>,
);
