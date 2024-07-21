import React, { useState, useEffect } from "react";
import { loginRoute } from "../Utils/apiroutes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/signin.css";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import image from "../assets/signinimg.png";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [errorAlert, setErrorAlert] = useState();

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      try {
        const response = await axios.post(loginRoute, {
          username,
          password,
        });

        const data = response.data;
        if (data && data.status === false) {
          setErrorAlert(data.msg);
        }
        if (data && data.status === true) {
          localStorage.setItem(
            "current-user",
            JSON.stringify(data.usernameCheck)
          );
          navigate("/");
        }
      } catch (error) {}
    }
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (username == "") {
      setErrorAlert("Enter the username");
      return false;
    } else if (password == "") {
      setErrorAlert("Enter the password");
      return false;
    } else {
      return true;
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

  return (
    <div className="outer2">
      {errorAlert && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          style={{ width: "70%", marginLeft: "15%" }}
        >
          <span className="font-medium">{errorAlert}</span>
        </Alert>
      )}
      <div className="main2">
        <div className="addlogo2">
          <img style={{height:'153px', position:'relative', right:'330px'}} src={logo} alt="" />
        </div>
        <div
          className="midcontainer2"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="firstrow2">
            <h1>Login</h1>
            <span className="toggle">
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "blue" }}>
                SignUp
              </Link>
            </span>
          </div>
          <div className="secondrow2">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  className="inputfields"
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  id="username"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="input-container">
                <input
                  className="inputfields"
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  id="password"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <button
                className="btnn"
                type="submit"
                style={{ backgroundColor: "#2D7EDD", width: "8vw", marginLeft: '30px', }}
              >
                Login
              </button>
            </form>
          </div>
          <div className="addimg2">
            <img src={image} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
