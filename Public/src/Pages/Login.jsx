import React, { useState, useEffect } from "react";
import { loginRoute } from "../Utils/apiroutes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import OAuth from "../Components/OAuth";
// import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "flowbite-react";
import '../Css/signin.css'

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
    let timerId;
    if (errorAlert) {
      timerId = setTimeout(() => {
        setErrorAlert("");
      }, 3000);
    }
    return () => clearTimeout(timerId);
  }, [errorAlert]);

  return (
    <>
      {errorAlert && (
        <div
          className="alert-container alert container alert-danger alert-dismissible fade show"
          role="alert"
        >
          {errorAlert}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="main2">
        <div className="rtcontainter2">
          <h1 className="title2">Login</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input
                className="inputfields"
                type="text"
                placeholder="Enter Username"
                name="username"
                id="username"
                onChange={(e) => handleChange(e)}
              />
              {/* <FontAwesomeIcon icon={faUser} className="usericon2 input-icon" /> */}
            </div>
            <div>
              <input
                className="inputfields"
                type="password"
                placeholder="Enter password"
                name="password"
                id="password"
                onChange={(e) => handleChange(e)}
              />
              {/* <FontAwesomeIcon icon={faLock} className="lockicon2 input-icon" /> */}
            </div>
            <button
              className="btnn2"
              type="submit"
            >
              Login
            </button>
            {/* <p className="or2">or</p>
            <OAuth /> */}
            <span className="toggle2">
              Don't have an account? <Link to="/signup">SignUp</Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
