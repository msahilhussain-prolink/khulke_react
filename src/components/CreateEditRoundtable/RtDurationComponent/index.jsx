import React, { useEffect } from "react";

// Components

import moment from "moment";
import { allWords } from "../../../App";
import Timer from "./Timer";
import "./style.css";
import InfoIcon from "../../InfoIcon";
import { useDispatch, useSelector } from "react-redux";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import DurationOfRt from "./DurationOfRt";

export default function RTDurationComponent() {
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.createEditRoundtable.schedule);
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);

  useEffect(() => {
    if (rtType == `${allWords.rt.opt3.toLowerCase()}`) {
      dispatch(
        createEditRoundtableInitialize({
          schedule: false,
          timeValue: moment(new Date()),
        })
      );
    } else {
      if (rtType == `${allWords.rt.live.toLowerCase()}`) {
        dispatch(
          createEditRoundtableInitialize({
            schedule: true,
          })
        );
      }
    }
  }, [rtType]);

  return (
    <div>
      <div className="row mx-0 rtDuration-header justify-space-between">
        <div className={`col-12 col-sm-6 col-md-4 col-xl-3 p-0 mb-3 mb-xl-0`}>
          <div>
            <small className="rt-strong-labels-gray">
              {allWords.misc.selectSche}
              <InfoIcon
                infoTitle2={allWords.misc.sche1}
                infoTitle3={allWords.misc.sche2}
                infoTitle4={allWords.misc.sche3}
              />
            </small>
          </div>
          <div className="laterSoon">
            <div className="btn-container">
              <label className="switch btn-schedule-switch">
                <input
                  type="checkbox"
                  name="schedule_type"
                  id="schedule_type"
                  value={schedule}
                  checked={schedule}
                  onChange={(e) => {
                    dispatch(
                      createEditRoundtableInitialize({
                        schedule: e.target.checked,
                      })
                    );
                  }}
                  onClick={() => {
                    if (schedule === false)
                      return dispatch(
                        createEditRoundtableInitialize({
                          timeValue: moment(new Date()).add(30, "minutes"),
                          dateValue: moment(new Date()).add(30, "minutes"),
                        })
                      );
                    else
                      return dispatch(
                        createEditRoundtableInitialize({
                          timeValue: moment(new Date()),
                          dateValue: moment(new Date()),
                        })
                      );
                  }}
                />
                <label
                  htmlFor="schedule_type"
                  data-on={allWords.misc.later}
                  data-off={allWords.misc.now}
                  className="btn-schedule-switch-inner"
                ></label>
              </label>
            </div>
          </div>
        </div>
        {schedule === true || schedule === undefined ? (
          <div className="col-12 col-sm-6 col-xl-4 p-0">
            <Timer /> &emsp;&emsp;
          </div>
        ) : null}

        <div
          className={`col-12 col-sm-4 col-xl-${
            window.innerWidth < 1380 ? "6" : "4"
          } ${window.innerWidth === 1200 ? "mb-4" : ""} duration-of-rt-div`}
        >
          {rtType !== `${allWords.rt.opt3.toLowerCase()}` ? (
            <DurationOfRt />
          ) : null}
        </div>
      </div>
    </div>
  );
}
