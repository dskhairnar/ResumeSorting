import React, { useEffect } from "react";
import NavbarCompo from "../Components/Navbar/NavbarCompo";
import FirstCompo from "./Home/FirstCompo";
import Dashboard from "./Home/Dashboard";
import Contact from "./Home/Contact";
import Services from "./Home/Services";
import "../Css/Home.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const currentUser = localStorage.getItem("current-user");

  useEffect(() => {
    if (!currentUser) navigate("/signin");
  }, []);
  
  return (
    <>
      <NavbarCompo />
      <div className="scrollable">
        <section id="home" className="section">
          <FirstCompo />
        </section>
        <section id="services" className="section">
          <Services />
        </section>
        <section id="dashboard" className="section">
          <Dashboard />
        </section>
        <section id="contact" className="section">
          <Contact />
        </section>
      </div>
    </>
  );
}

export default HomePage;
