import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allWords } from "../../../App";

import BackIcon from "../../../assets/icons/back.svg";
import ActionButtonComponent from "../ActionButtonComponent";
import "./style.css";
import Dialog from "../../LeftSideBar/Dialog";

export default function TitleComponent() {
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);

  const [back, setBack] = useState(false);
  const navigate = useNavigate();

  const backClick = () => {
    if (!localStorage?.current_user && localStorage?.anonymous_user)
      return navigate("/roundtable/all");
    else {
      if (!window.location.pathname.includes("success")) setBack(true);
      else navigate("/roundtable/all");
    }
  };
  return (
    <>
      <div className="row mx-0">
        <div className="col-12 col-sm-6 col-md-5 col-xl-7 p-0">
          <div
            className="d-flex mb-3"
            style={{ alignItems: "center", width: "fit-content" }}
          >
            <div className="row mx-0 create-rt-head-div">
              <img
                className=" p-1 back-img-create"
                onClick={backClick}
                src={BackIcon}
                alt="back"
              />
              <h1 className="m-0 p-0 create-rt-heading">
                {!urlRtId
                  ? allWords.createRT.create_your_rt
                  : allWords.misc.update_your_rt}
              </h1>
            </div>
          </div>
        </div>

        {urlRtId && (
          <div className="col-12 col-sm-6 col-md-7 col-xl-5 mb-4 mb-sm-0">
            <ActionButtonComponent type="update" />
          </div>
        )}
      </div>

      <Dialog
        title={allWords.misc.review.discard.dtitle}
        open={back}
        setOpen={setBack}
        onCloseBtnClick={() => {
          setBack(false);
        }}
      >
        <div className="text-center container-fluid">
          <h6>
            <strong>{allWords.misc.review.discard.text}</strong>
            <div className="d-flex justify-content-between py-5">
              <button
                className="title-cancel-btn"
                onClick={() => {
                  setBack(false);
                  return navigate("/roundtable/all");
                }}
              >
                {allWords.misc.review.discard.y.split(",")[0]}
                <span className="i_sure">
                  , {allWords.misc.review.discard.y.split(",")[1]}
                </span>
              </button>
              <button
                className="no-keep-it-btn"
                onClick={() => {
                  setBack(false);
                }}
              >
                {allWords.misc.review.discard.n.split(",")[0]}
                <span className="i_sure">
                  , {allWords.misc.review.discard.n.split(",")[1]}
                </span>
              </button>
            </div>
          </h6>
        </div>
      </Dialog>
    </>
  );
}
