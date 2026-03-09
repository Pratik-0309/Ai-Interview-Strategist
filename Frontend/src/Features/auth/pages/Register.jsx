import React, { useState } from "react";
import {useNavigate, Link} from "react-router";
import { useAuth } from "../hooks/useAuth.js";

const Register = () => {

  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth();
  const [userName , setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleRegister({userName, email, password});
    navigate("/");
    setUserName("");
    setEmail("");
    setPassword("");

  };

  if (loading) {
    return (
      <main>
        <h1>Loading ....</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => {setUserName(e.target.value)}}
              value={userName}
              type="text"
              id="username"
              name="username"
              placeholder="Enter username "
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {setEmail(e.target.value)}}
              value={email}
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email Address"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {setPassword(e.target.value)}}
              value={password}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Register</button>
        </form>
        <p>Already have an Account? <Link to={"/login"}>Login</Link></p>
      </div>
    </main>
  );
};

export default Register;
