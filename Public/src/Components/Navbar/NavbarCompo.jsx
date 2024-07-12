import React from "react";
import { Link } from "react-router-dom";
import "./navbarCss.css";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { RiNetflixFill } from "react-icons/ri";
import image from "./backphoto.jpg";
import { useNavigate } from "react-router-dom";
function NavbarCompo() {
  const navigate = useNavigate();

  const currentUserString = localStorage.getItem("current-user");
  const currentUser = JSON.parse(currentUserString);

  const handleSignOut = () => {
    console.log("SignPut clicked");
    localStorage.removeItem("current-user");
    navigate("/signin");
  };
  return (
    <>
      <Navbar
        fluid
        rounded
        className="navbar border-none"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mainnavcompo">
          <div className="lfcmp">
            <Link className="brand" to="/">
              <RiNetflixFill style={{ fontSize: "50px",color:"white" }} />
            </Link>
          </div>
          <div className="search">
            <input className="searchbar" type="search" placeholder="search" />
          </div>
          <div className="rtcmp flex md:order-2">
            {currentUser ? (
              <div className="exist">
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <Avatar
                      className="profilePic"
                      alt="User settings"
                      img={currentUser.profilePicture}
                      rounded
                    />
                  }
                >
                  <Dropdown.Header style={{cursor:"pointer"}} onClick={() => {navigate("/profile")}}>
                    <span className="block text-sm">
                      {currentUser.username}
                    </span>
                    <span className="block truncate text-sm font-medium">
                      {currentUser.email}
                    </span>
                  </Dropdown.Header>
                  <Dropdown.Item>
                    <Link to="/">Home</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/saved">Saved</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/settings">Setting</Link>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignOut}>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
              </div>
            ) : (
              <div className="notexist">
                <Link className="notexistLink" to="/signup" active>
                  SignUp
                </Link>
                <Link className="notexistLink" to="/signin">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </Navbar>
    </>
  );
}

export default NavbarCompo;
