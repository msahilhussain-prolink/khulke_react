import React, {useEffect} from "react";
import { allWords } from "../../App";
import {useNavigate} from "react-router-dom";

export default function Tabs({ activeTab, setActiveTab, setAnonymous }) {
    const navigate = useNavigate();
  return (
    <>
      <div className="tabDiv">
        <div
          onClick={() => {
            if (!localStorage.current_user && localStorage.anonymous_user)
              return setAnonymous(true);
            setActiveTab("timeline");
            localStorage.setItem("activeTab", "timeline");
          }}
          className={`${activeTab === "timeline" ? "active" : ""} buttonForTab`}
        >
          {allWords.th.timeline}
        </div>
        <div
          onClick={() => {
            setActiveTab("khabrikekhabre");
            localStorage.setItem("activeTab", "khabrikekhabre");
            navigate("/k3");
          }}
          className={`${activeTab === "khabrikekhabre" ? "active" : ""} buttonForTab`}
        >
            {allWords.th.k3}
        </div>
        <div
          onClick={() => {
            setActiveTab("BKK");
            localStorage.setItem("activeTab", "BKK");
            navigate("/bol-khulke");
          }}
          className={`${activeTab === "BKK" ? "active" : ""} buttonForTab`}
        >
             {allWords.th.bkk}
        </div>
        <div
          onClick={() => {
            setActiveTab("news");
            localStorage.setItem("activeTab", "news");
          }}
          className={`${activeTab === "news" ? "active" : ""} buttonForTab`}
        >
          {allWords.th.news}
        </div>
        
      </div>
    </>
  );
}
