import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Material UI
import { ShareOutlined } from "@material-ui/icons";

// Constants
import { allWords } from "../../App";

// Redux
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";

// Components
import ToastHandler from "../../utils/ToastHandler";

// Style
import "./style.css";

export default function RtShareComponent({
  rt_id,
  className = "share-btn",
  propDivStyle = null,
  propBtnStyle = null,
}) {
  const rtAction = useSelector((state) => state.rtActionRed.data);

  const [loadingState, setLoadingState] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loadingState) {
      if (rtAction && rtAction?.data?.status == 200) {
        setLoadingState(false);
        navigator.clipboard
          .writeText(rtAction?.data?.data?.[0]?.url)
          .then(function () {
            ToastHandler("sus", allWords.misc.succcopied);
          })
          .catch(function () {
            ToastHandler("dan", "Failed. try again!");
          });
      }
    }
  }, [rtAction]);

  const handleShare = () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
    setLoadingState(true);
  };

  return (
    <>
      <div style={propDivStyle} className="share-btn-div">
        <button
          className={className}
          style={propBtnStyle}
          onClick={() => handleShare()}
        >
          <ShareOutlined />
          <span className="ml-2 btnTxt text-dark">
            &nbsp; {allWords.snip.share}
          </span>{" "}
        </button>
      </div>
    </>
  );
}
