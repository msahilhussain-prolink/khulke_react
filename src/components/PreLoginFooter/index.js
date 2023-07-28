import React from "react";
import { Link } from "react-router-dom";
import { allWords } from "../../App";
import community from "../../assets/icons/cummunity.svg";
import disclaimers from "../../assets/icons/disclaimers.svg";
import faq from "../../assets/icons/faq.svg";
import privacy from "../../assets/icons/privacy.svg";
import support from "../../assets/icons/support.svg";
import terms from "../../assets/icons/terms.svg";
import "./style.css";

const PreLoginFooter = () => {
  const footerLink = [
    {
      title: allWords.th.opt1,
      link: "/faq",
      icon: faq,
    },

    {
      title: allWords.th.opt2,
      link: "/community-guidelines",
      icon: community,
    },

    {
      title: allWords.th.opt3,
      link: "/support",
      icon: support,
    },

    {
      title: allWords.th.opt4,
      link: "/privacy-policy",
      icon: privacy,
    },

    {
      title: allWords.th.opt5,
      link: "/disclaimers",
      icon: disclaimers,
    },

    {
      title: allWords.th.opt6,
      link: "/terms-conditions",
      icon: terms,
    },

    {
      title: allWords.th.opt7,
      link: "/take-down-policy",
      icon: community,
    },
  ];

  return (
    <div className="prefooterSection">
      <div className="prefooterContainer">
        {footerLink.map((item, index) => {
          return (
            <>
              <div className="footerIcon">
                <Link
                  className="footerLink"
                  to={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={item.icon} alt="#" /> &nbsp;
                  <h5>{item.title}</h5>
                </Link>
              </div>{" "}
              &emsp;
            </>
          );
        })}
      </div>
    </div>
  );
};

export default PreLoginFooter;
