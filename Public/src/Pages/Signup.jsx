import React, { useEffect, useState } from "react";
import { registerRoute } from "../Utils/apiroutes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/signup.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "flowbite-react";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, password, email } = values;
      try {
        const response = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        const data = response.data;
        if (data && data.status === false) {
          alert(data.msg);
        }
        if (data && data.status === true) {
          localStorage.setItem("current-user", JSON.stringify(data.newUser));
          navigate("/");
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("current-user");
    if (currentUser) {
      navigate("/");
    }
  }, []);

  const handleValidation = () => {
    const { username, email, password, confirmpassword } = values;
    if (password !== confirmpassword) {
      alert("Passoward and confirm password should be same");
      return false;
    } else if (username.length < 3) {
      alert("Username should be greater than 3 characters");
      return false;
    } else if (password.length < 7) {
      alert("Password should be equal or greater than 8 characters");
      return false;
    } else if (email == "") {
      alert("Email is required");
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <div className="main" style={{ display: "flex", flexDirection: "row" }}>
        <div className="midcontainer">
          <p>Create your account</p>
          <span className="toggle">
            Already have an account? <Link to="/signin">Login</Link>
          </span>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="inout-container">
              <input
                className="upperInp"
                type="text"
                placeholder="Username"
                name="username"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="inout-container">
              <input
                type="email"
                placeholder="Email id"
                name="email"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="inout-container">
              <input
                type="password"
                placeholder="password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="inout-container">
              <input
                type="password"
                className="lowerInp"
                placeholder="Confirm Password"
                name="confirmpassword"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <button className="btnn" type="submit">
              Create account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
