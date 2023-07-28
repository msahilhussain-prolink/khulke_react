import React from "react";
import { allWords } from "../../../App";

import "../style.css";

export default function InvitationSkip(props) {
  const { numSlides, inds, setSkip, skip, setInvPop } = props;

  return (
    <>
      <h3 style={{ fontWeight: "bolder" }}>
        {allWords.misc.more_inv_1} {numSlides - inds} {allWords.misc.more_inv_2}
      </h3>

      <div className="p-3">
        <span>{allWords.misc.INVITE_POP_DESC}</span>
      </div>

      <div className="mt-4 d-flex skipBtnClass">
        <button
          id="skip_all_button"
          className="invBtn invRejectBtn"
          onClick={() => {
            setSkip(false);
            setInvPop(false);
          }}
        >
          {allWords.misc.skip_all}
        </button>
        &emsp;&emsp;
        <button
          id="continue_button"
          className="invBtn invAcceptBtn"
          onClick={() => {
            setSkip(!skip);
          }}
        >
          {allWords.misc.continue}
        </button>
      </div>
    </>
  );
}
