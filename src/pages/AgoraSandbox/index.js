import React, { useState, useEffect } from "react";
import VideoCall from "./VIdeoCall";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

const AgoraSandbox = () => {
  //!Check call status
  const [in_call, setInCall] = useState(null);
  const [end_time, setEndTime] = useState(null);
  const [start_time, setStartTime] = useState(null);
  const [views, setViews] = useState(0);
  const fullScrc = useSelector((state) => state.fullScreen.full);
  const navigate = useNavigate();

  useEffect(() => {
    if (in_call === false) {
      navigate("/roundtable/all", { replace: true });
    }
    if (localStorage.getItem("join_rt")) {
      let rt_details = JSON.parse(localStorage.join_rt);
      setEndTime(
        rt_details?.rt_type !== "RECORDING_BASED"
          ? moment(new Date(rt_details?.end)).local()
          : moment(new Date(rt_details?.end)).add(5, "seconds").local()
      );
      setStartTime(moment(new Date(rt_details?.start)).local());
      setViews(rt_details.viewer_count);
      setInCall(true);
    } else {
      setInCall(false);
    }
  }, [in_call]);

  return (
    <div className={`${fullScrc ? "agora-sandbox-main-div" :"agora-sandbox-main-div"}`}>
      {in_call ? (
        <VideoCall
          setInCall={setInCall}
          end_time={end_time}
          views={views}
          start_time={start_time}
        />
      ) : (
        <div
          className="container-fluid text-center"
          style={{ marginTop: "25%", width: "100%" }}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default AgoraSandbox;
