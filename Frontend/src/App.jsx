import { Route, Routes } from "react-router-dom"
import Register from "./Features/auth/pages/Register.jsx"
import Login from "./Features/auth/pages/Login.jsx"

function App() {

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </>
  )
}

export default App
