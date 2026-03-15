import { Route, Routes } from "react-router-dom"
import Register from "./Features/auth/pages/Register.jsx"
import Login from "./Features/auth/pages/Login.jsx"
import Protected from "./Features/auth/components/Protected.jsx";
import Home from "./Features/interview/pages/home.jsx";
import Interview from "./Features/interview/pages/Interview.jsx";
import {Toaster} from "react-hot-toast";


function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="/interview/:interviewId" element={<Protected><Interview /></Protected>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </>
  )
}

export default App
