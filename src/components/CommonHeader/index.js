import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import back_button from "../../assets/icons/back.svg";
import Dialog from "../LeftSideBar/Dialog";
import { CancelBtn } from "../RoundTableActions/style";
import { allWords } from "../../App";
const CommonHeader = ({
  origin,
  title,
  progressH,
  progress_name,
  progress_one,
  progress_two,
  progress_three,
  progress_four,
}) => {
  const navigate = useNavigate();
  const [discard, setDiscard] = useState(false);
  return (
    <>
      <div className=" d-flex justify-content-start">
        <img
          style={{ cursor: "pointer", width: "25px" }}
          onClick={() => {
            if (!localStorage?.current_user && localStorage?.anonymous_user)
              return navigate("/roundtable/all");
            else {
              if (!window.location.pathname.includes("success")) {
                if (
                  progress_one === 1 ||
                  progress_two === 2 ||
                  progress_three === 3 ||
                  progress_four === 4 ||
                  progress_name === "confirm"
                ) {
                  setDiscard(true);
                } else if (progress_name === "")
                  return navigate("/roundtable/all");
                else {
                  navigate("/roundtable/all");
                }
              } else return navigate("/roundtable/all");
            }
          }}
          src={back_button}
          alt="Go back"
        />
        {/* &nbsp; */}
        {progressH !== "step6" && <p className="title">{title}</p>}
        {progressH === "step6" && (
          <p className="title">{allWords.misc.backlisting}</p>
        )}
      </div>
      <Dialog
        title={allWords.misc.review.discard.dtitle}
        open={discard}
        setOpen={setDiscard}
        onCloseBtnClick={() => {
          setDiscard(false);
        }}
      >
        <div className="text-center container-fluid">
          <h6>
            <strong>{allWords.misc.review.discard.text}</strong>
            <div className="d-flex justify-content-between py-5">
              <CancelBtn
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  setDiscard(false);
                  return navigate("/roundtable/all");
                }}
              >
                {allWords.misc.review.discard.y.split(",")[0]}
                <span className="i_sure">
                  , {allWords.misc.review.discard.y.split(",")[1]}
                </span>
              </CancelBtn>
              <button
                style={{ marginTop: "1rem" }}
                className="alt-blk-btn"
                onClick={() => {
                  setDiscard(false);
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
};

export default CommonHeader;
