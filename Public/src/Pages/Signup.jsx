import React, { useEffect, useState } from "react";
import { registerRoute } from "../Utils/apiroutes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/signup.css";
import image from "../assets/signupimg.png";
import logo from "../assets/logo.png";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [errorAlert, setErrorAlert] = useState();

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
          setErrorAlert(data.msg);
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

  useEffect(() => {
    if (errorAlert !== "") {
      const timer = setTimeout(() => {
        setErrorAlert("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [errorAlert]);

  const handleValidation = () => {
    const { username, email, password, confirmpassword } = values;
    if (username.length < 3) {
      setErrorAlert("Username should be greater than 3 characters");
      return false;
    } else if (email == "") {
      setErrorAlert("Email is required");
      return false;
    } else if (password.length < 7) {
      setErrorAlert("Password should be equal or greater than 8 characters");
      return false;
    } else if (password !== confirmpassword) {
      setErrorAlert("Passoward and confirm password should be same");
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="outer">
      {errorAlert && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          style={{ width: "70%", marginLeft: "15%" }}
        >
          <span className="font-medium">{errorAlert}</span>
        </Alert>
      )}
      <div className="main">
        <div className="addlogo">
          <img style={{height:'153px', position:'relative', right:'330px'}} src={logo} alt="" />
        </div>
        <div
          className="midcontainer"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="firstrow">
            <h1>Create new Account</h1>
            <span className="toggle">
              Have an account?{" "}
              <Link to="/signin" style={{ color: "blue" }}>
                Login
              </Link>
            </span>
          </div>
          <div className="secondrow">
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

              <button
                className="btnn"
                type="submit"
                style={{ backgroundColor: "#2D7EDD", width: "10vw" }}
              >
                Create account
              </button>
            </form>
          </div>
          <div className="addimg">
            <img src={image} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;