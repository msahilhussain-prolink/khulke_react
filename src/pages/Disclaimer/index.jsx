import React from "react";
import { globalImages } from "../../assets/imagesPath/images";
// import KhulKeLogo from "../../assets/icons/KhulKe_logo.svg";
import "./disclaimer.css";
import { allWords } from "../../App";
const Disclaimer = () => {
  return (
    <div className="disclaimertText">
      <div className="disclaimer_logo_container">
        <img src={globalImages.logo} alt="no-logo" />
      </div>
      <h1>{allWords.misc.pages.distitle}</h1>
      <p>{allWords.misc.pages.disclaimer}</p>
    </div>
  );
};

export default Disclaimer;
