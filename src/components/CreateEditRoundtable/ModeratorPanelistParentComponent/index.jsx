import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Constants
import { allWords } from "../../../App";

// Redux
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";

// Component
import InfoIcon from "../../InfoIcon";
import ModeratorPanelistSelectBox from "../ModeratorPanelistSelectBox";
import PanelistInput from "../PanelistInput";

// Style
import "./style.css";
import { CustomColorCheckbox } from "../styles";

const ModeratorPanelistParentBoxComponent = () => {
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);

  let userData = useSelector((state) => state.createEditRoundtable.panelists);

  let moderator_data = useSelector(
    (state) => state.createEditRoundtable.moderator
  );

  const m_type = useSelector((state) => state.createEditRoundtable["m_type"]);

  const dispatch = useDispatch();

  const [num, setNum] = useState(
    window.location.href.includes("edit")
      ? userData?.length > 0
        ? userData?.length + 1
        : 1
      : 1
  );

  const numHandler = () => {
    dispatch(createEditRoundtableInitialize({ panelists: [...userData] }));
  };

  const mType = () => {
    dispatch(
      createEditRoundtableInitialize({
        m_type: !m_type,
      })
    );
  };

  return (
    <div className="rt-user-details-div">
      <div className="d-flex justify-content-between">
        <h6 className="p-0">
          {allWords.moderatorLabel}
          <span className="asterikMark">*</span>
          <InfoIcon
            infoTitle2={allWords.misc.minfo1}
            infoTitle6={allWords.misc.minfor2}
            infoTitle7={allWords.misc.minfor3}
            infoTitle8={allWords.misc.minfor4}
            infoTitle9={allWords.misc.minfor5}
            infoTitle10={allWords.misc.minfor6}
            infoTitle11={allWords.misc.minfor7}
            placementProp={"top-start"}
          />{" "}
        </h6>
        {moderator_data && (
          <div
            style={{ textAlign: "right" }}
            hidden={
              rtType === `${allWords.rt.label2.toLowerCase()}` ? false : true
            }
          >
            {moderator_data?.label !==
              JSON.parse(
                localStorage.current_user || localStorage.anonymous_user
              )?.["username"] && (
              <>
                <span>
                  <p className="make-co-owner">
                    {allWords.misc.pages.makecoowner}
                  </p>
                  &emsp;
                  <CustomColorCheckbox checked={m_type} onChange={mType} />
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <ModeratorPanelistSelectBox
        boxType={"moderator"}
        value={moderator_data}
      />
      <div className="mt-3 row mx-0">
        <h6 className="p-0">
          {allWords.panelistLabel}
          <InfoIcon
            infoTitle2={allWords.misc.pages.l1}
            infoTitle3={allWords.misc.pages.l2}
            infoTitle4={allWords.misc.pages.l3}
          />
        </h6>

        {rtType === `${allWords.rt.label2.toLowerCase()}` ? (
          <div className="col-12 px-0">
            {[...Array(num).keys()].map((el, ind) => (
              <ModeratorPanelistSelectBox
                key={userData[ind]?.name?.label ?? ind}
                index={ind}
                boxType={"panelists"}
                numHandler={numHandler}
                num={num}
                value={userData[ind]?.name}
                setNum={setNum}
                panelistIntro={userData[ind]?.introduction}
              />
            ))}
          </div>
        ) : (
          <PanelistInput />
        )}
      </div>
    </div>
  );
};

export default ModeratorPanelistParentBoxComponent;
