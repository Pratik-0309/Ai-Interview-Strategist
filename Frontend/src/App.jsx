import { Route, Routes } from "react-router-dom"
import Register from "./Features/auth/pages/Register.jsx"
import Login from "./Features/auth/pages/Login.jsx"
import Protected from "./Features/auth/components/Protected.jsx";
import {Toaster} from "react-hot-toast";


function App() {

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/" element={<Protected><h1>Home Page</h1></Protected>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </>
  )
}

export default App
