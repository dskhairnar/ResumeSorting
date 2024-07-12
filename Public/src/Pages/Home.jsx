import React, { useState } from "react";
import axios from "axios";
import { imageUploadRoute } from "../Utils/apiroutes";
import "../Css/Home.css";
import { getResumeRoute } from "../Utils/apiroutes";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import image from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();
  const [totalQueryWordCount, setTotalQueryWordCount] = useState(0);

  const [response, setResponse] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [skillsQuery, setSkillsQuery] = useState("");

  const handleImageUpload = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const files = event.target.elements.resumes.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("resumes", files[i]);
    }

    try {
      const response = await axios.post(imageUploadRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setResponse(response.data);
      setTimeout(() => {
        setResponse(null);
      }, 2000);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChange2 = (event) => {
    setSkillsQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const searchWords = searchQuery.trim().split(/\s+/);
      const searchWordCount = searchWords.length;

      const skillsWords = skillsQuery.trim().split(/\s+/);
      const skillsWordCount = skillsWords.length;

      const totalQueryWordCount = searchWordCount + skillsWordCount;
      setTotalQueryWordCount(totalQueryWordCount);

      const response = await axios.post(getResumeRoute, {
        searchQuery,
        skillsQuery,
      });
      const data = response.data;
      console.log(data);
      const totalResumeCount = data.totalResumesCount;
      const matchedResumesCount = data.matchedResumesCount;

      const parsedSorted = JSON.stringify(data);
      localStorage.setItem("SortedArray", parsedSorted);

      // Navigate to Sort page with totalQueryWordCount in location state
      navigate("/sort", { state: { totalQueryWordCount } });
    } catch (error) {
      console.error("Error searching resumes:", error);
    }
  };

  const handleSortClick = () => {
    navigate("/sort", {
      state: { totalQueryWordCount, totalResumeCount, matchedResumesCount },
    });
  };
  const handleFilterClick = () => {
    navigate("/filter");
  };
  const handleRankingClick = () => {
    navigate("/ranking");
  };

  return (
    <>
      {response && (
        <div className="alert alert-success" role="alert">
          Resumes uploaded successfully!
        </div>
      )}
      <h1 style={{ fontSize: "70px", margin: "30px 0px 0px 640px" }}>
        SkillSync
      </h1>

      <h1 style={{ fontSize: "30px", marginLeft: "590px" }}>
        Analyze Resumes flawlessly
      </h1>
      <div className="topcont" style={{ display: "flex" }}>
        <div className="logo" style={{ width: "500px" }}>
          <img
            style={{ height: "200px", position: "relative", bottom: "150px" }}
            src={image}
            alt="logo"
          />
        </div>
        <form onSubmit={handleImageUpload}>
          <input
            type="file"
            name="resumes"
            accept=".pdf"
            multiple
            style={{ marginTop: "100px", border: "1px solid black" }}
          />
          <button
            style={{ marginLeft: "250px" }}
            className="Uploadbtn"
            type="submit"
          >
            Upload
          </button>
        </form>
      </div>
      <h1
        style={{
          fontSize: "22px",
          position: "relative",
          bottom: "180px",
          left: "650px",
        }}
      >
        Upload Resume Files Here
      </h1>
      <hr />
      <div className="lowercont">
        <h1
          style={{
            fontSize: "25px",
            marginLeft: "650px",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          Set Up Job Descriptions
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Enter Job Description"
            className="queryinp"
          />
          <input
            type="text"
            value={skillsQuery}
            onChange={handleChange2}
            placeholder="Enter Key Skills "
            className="queryinp"
          />
          <button
            style={{ marginLeft: "750px" }}
            className="analyzebtn"
            type="submit"
          >
            Analyze
          </button>
        </form>
      </div>
      {/* <Card resume={response.data} /> */}
    </>
  );
}

export default Home;
