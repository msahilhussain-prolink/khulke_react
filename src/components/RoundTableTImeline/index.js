import React, { useEffect, useState } from "react";
import { allWords } from "../../App";

import "./style.css";
import { isHindiContent } from "../../utils/utils";
const Timeline = ({
  setProgress,
  progress,
  new_rt_ref,
  url_rt_id,
  created_rtid,
  progress_one,
  progress_two,
  progress_three,
  wip_rt_id,
  progress_four,
  navigate,
}) => {
  const [status, setStatus] = useState({
    "step-1": "current",
    "step-2": "incomplete",
    "step-3": "incomplete",
    "step-4": "incomplete",
  });
  useEffect(() => {
    if (!url_rt_id) {
      if (progress === "step1") {
        let temp_status = {
          "step-1": "current",
          "step-2": progress_two === 2 ? "completed" : "incomplete",
          "step-3": progress_three === 3 ? "completed" : "incomplete",
          "step-4": progress_four === 4 ? "completed" : "incomplete",
        };
        setStatus(temp_status);
      } else if (progress === "step2") {
        let temp_status = {
          "step-1": progress_one === 1 ? "completed" : "incomplete",
          "step-2": "current",
          "step-3": progress_three === 3 ? "completed" : "incomplete",
          "step-4": progress_four === 4 ? "completed" : "incomplete",
        };
        setStatus(temp_status);
      } else if (progress === "step3") {
        let temp_status = {
          "step-1": "completed",
          "step-2": "completed",
          "step-3": "current",
          "step-4": progress_four === 4 ? "completed" : "incomplete",
        };
        setStatus(temp_status);
      } else {
        let temp_status = {
          "step-1": "completed",
          "step-2": "completed",
          "step-3": "completed",
          "step-4": "current",
        };
        setStatus(temp_status);
      }
    } else {
      if (progress === "step1") {
        let temp_status = {
          "step-1": "current",
          "step-2": "completed",
          "step-3": "completed",
          "step-4": "completed",
        };
        setStatus(temp_status);
      } else if (progress === "step2") {
        let temp_status = {
          "step-1": "completed",
          "step-2": "current",
          "step-3": "completed",
          "step-4": "completed",
        };
        setStatus(temp_status);
      } else if (progress === "step3") {
        let temp_status = {
          "step-1": "completed",
          "step-2": "completed",
          "step-3": "current",
          "step-4": "completed",
        };
        setStatus(temp_status);
      } else {
        let temp_status = {
          "step-1": "completed",
          "step-2": "completed",
          "step-3": "completed",
          "step-4": "current",
        };
        setStatus(temp_status);
      }
    }
  }, [progress]);

  return (
    <section>
      <div style={{ position: "relative", paddingBottom: "5rem" }}>
        <div
          className="container-fluid"
          style={{
            width: "100%",
            position: "absolute",
            top: "10px",
            marginTop: "-4px",
            color: "gray",
          }}
        >
          <hr className="timeline-dash" />
        </div>
        <div className="d-flex justify-content-between rt-timeline-number-div">
          <div>
            <div
              onClick={() => {
                if (progress_one === 1 || url_rt_id || created_rtid) {
                  if (!url_rt_id) {
                    navigate("/roundtable/create");
                  } else {
                    if (wip_rt_id) {
                      navigate("/roundtable/create");
                    } else {
                      navigate(`/roundtable/edit/${url_rt_id}`);
                    }
                  }
                }
                new_rt_ref.current?.saveData();
              }}
              className={`timeline-circle ${status["step-1"]}-step`}
              style={{ paddingRight: "20px" }}
            >
              1
            </div>
            <br />
          </div>
          <div>
            <div
              onClick={() => {
                if (
                  progress_one === 1 ||
                  progress_two === 2 ||
                  url_rt_id ||
                  created_rtid
                ) {
                  if (!url_rt_id) {
                    navigate("/roundtable/create/moderator-panelist");
                  } else {
                    if (wip_rt_id) {
                      navigate("/roundtable/create/moderator-panelist");
                    } else {
                      navigate(
                        `/roundtable/edit/moderator-panelist/${url_rt_id}`
                      );
                    }
                  }
                }
                new_rt_ref.current?.saveData();
              }}
              className={`timeline-circle ${status["step-2"]}-step`}
              style={{ paddingRight: "22px", paddingLeft: "12px" }}
            >
              2
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                if (
                  progress_two === 2 ||
                  progress_three === 3 ||
                  url_rt_id ||
                  created_rtid
                ) {
                  if (!url_rt_id) {
                    navigate("/roundtable/create/categories");
                  } else {
                    if (wip_rt_id) {
                      navigate("/roundtable/create/categories");
                    } else {
                      navigate(`/roundtable/edit/categories/${url_rt_id}`);
                    }
                  }
                }
                new_rt_ref.current?.saveData();
              }}
              className={`timeline-circle ${status["step-3"]}-step`}
              style={{ paddingRight: "20px", paddingLeft: "12px" }}
            >
              3
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                if (
                  (progress_two === 2 && progress_three === 3) ||
                  url_rt_id ||
                  created_rtid
                ) {
                  if (!url_rt_id) {
                    navigate("/roundtable/create/send-invitation");
                  } else {
                    if (wip_rt_id) {
                      navigate("/roundtable/create/send-invitation");
                    } else {
                      navigate(`/roundtable/edit/send-invitation/${url_rt_id}`);
                    }
                  }
                }
                new_rt_ref.current?.saveData();
              }}
              className={`timeline-circle ${status["step-4"]}-step`}
              style={{ paddingRight: "22px", paddingLeft: "12px" }}
            >
              4
            </div>
          </div>
        </div>
        <div
          className="justify-content-between d-flex rt-timeline-name-div"
          style={{ width: "100%" }}
        >
          <small className={`timeline-text ${status["step-1"]}-text ms-0`}>
            {allWords.createRT.step1}
          </small>
          <small className={`timeline-text ${status["step-2"]}-text`} style={{...(isHindiContent() && {left: "-14px"})}}>
            {allWords.createRT.step2}
          </small>
          <small className={`timeline-text ${status["step-3"]}-text ms-2`} style={{...(isHindiContent() && {left: "2px"})}}>
            {allWords.createRT.step3}
          </small>
          <small className={`timeline-text ${status["step-4"]}-text`}>
            {allWords.createRT.step4}
          </small>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
