import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Constants
import { allWords } from "../../../App";

// Components
import Dialog from "../../LeftSideBar/Dialog";

// Redux
import { deleteRtData } from "../../../redux/actions/roundtableAction/deleteRT";

// Style
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function ActionDialog({ show_discard, setShowDiscard }) {
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const wipRtId = useSelector((state) => state.createEditRoundtable.wipRtId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const keepItFunc = () => {
    setShowDiscard(false);
    if (rtType === "live") {
      if (!urlRtId) {
        if (wipRtId) {
          dispatch(deleteRtData({ rt_id: wipRtId }));
          navigate("/roundtable/all");
        } else navigate("/roundtable/all");
      } else navigate("/roundtable/all");
    } else navigate("/roundtable/all");
  };
  return (
    <Dialog
      title={allWords.misc.review.discard.dtitle}
      open={show_discard}
      setOpen={setShowDiscard}
      onCloseBtnClick={() => {
        setShowDiscard(false);
      }}
    >
      <div className="text-center container-fluid">
        <h6>
          <strong>{allWords.misc.confdiscard}</strong>
          <div className="d-flex justify-content-between py-5">
            <button className="discard-keep-btn" onClick={keepItFunc}>
              {allWords.th.disbtnOption1.split(",")[0]}
              <span className="i_sure">
                , {allWords.th.disbtnOption1.split(",")[1]}
              </span>
            </button>
            <button
              className="discard-no-btn"
              onClick={() => {
                setShowDiscard(false);
              }}
            >
              {allWords.th.disbtnOption2.split(",")[0]}
              <span className="i_sure">
                , {allWords.th.disbtnOption2.split(",")[1]}
              </span>
            </button>
          </div>
        </h6>
      </div>
    </Dialog>
  );
}
