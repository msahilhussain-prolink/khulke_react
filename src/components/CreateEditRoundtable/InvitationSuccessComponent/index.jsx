import React from "react";
import "./style.css";
import StaticButtonComponent from "../StaticButtonComponent";
import { useNavigate } from "react-router-dom";
import { done_for_now, manageInvitationStyle } from "../styles";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../../App";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";

const InvitationSuccessComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const phones = useSelector((state) => state.createEditRoundtable.phones);
  const emails = useSelector((state) => state.createEditRoundtable.emails);

  const manageInvitations = () => {
    navigate(
      urlRtId
        ? `/roundtable/edit/invite-audience/${urlRtId}`
        : "/roundtable/create/invite-audience"
    );

    dispatch(
      createEditRoundtableInitialize({
        phoneList: phones,
        email_list: emails,
      })
    );
  };
  return (
    <div>
      <div className="invite-main-div">
        <div className="row invite-lottie-parent-div mx-0">
          <lottie-player
            src="https://assets9.lottiefiles.com/packages/lf20_qNj8yigUYe.json"
            background="transparent"
            speed="1"
            style={{
              width: "500px",
            }}
            loop
            autoplay
          />
        </div>
        <h1
          className="text-content-for-invite"
          style={{ marginTop: "-3rem", marginBottom: "1rem" }}
        >
          {allWords.misc.invitation_sent_successfully}
        </h1>
        <p
          className="text-content-for-invite"
          style={{ marginBottom: "1.5rem" }}
        >
          {allWords.misc.you_can_edit_rt_manage_your_invitations_anytime}
        </p>
        <div className="row mx-0 mt-4 d-flex justify-content-center">
          <div className="col-6 d-flex justify-content-center col-sm-4 col-xl-3">
            <StaticButtonComponent
              title={allWords.misc.manage_invitations}
              styles={manageInvitationStyle}
              onClick={manageInvitations}
            />
          </div>
          <div className="col-6 d-flex justify-content-center col-sm-4 col-xl-3">
            <StaticButtonComponent
              title={allWords.misc.done_for_now}
              styles={done_for_now}
              onClick={() => navigate("/roundtable/all")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationSuccessComponent;
