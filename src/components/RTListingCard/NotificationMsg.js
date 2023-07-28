import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { allWords } from "../../App";

// Assets
import check from "../../assets/icons/Group 21224.svg";
import AcceptInvite from "../../assets/icons/Accept.svg";
import RejectInvite from "../../assets/icons/Reject.svg";
import DeleteInvite from "../../assets/images/delete_icon_cross.png";

// Redux
import { InviteByData } from "../../redux/actions/inviteByAction";

// Component
import InviteMore from "./InviteMore";

// Style
import "./style.css";
import RTDialogs from "./RTDialogs";

export default function NotificationMsg(props) {
  const {
    owner_flag,
    last_requested_user,
    accepted_count,
    rejected_count,
    invite_by,
    has_removed,
    has_accepted,
    has_rejected,
    moderator_flag,
    speaker_flag,
    audience_flag,
    nt_id,
    past,
    acr,
    rt_name,
    rt_nature,
    rt_id,
    invitation_token,
    speakers,
    moderator,
    rt_details,
    accept,
    setAccept,
    reject,
    setReject,
    top,
    bottom,
  } = props;

  const dispatch = useDispatch();
  // Local State
  const [open_acr, setOpenACR] = useState(false);
  const [open_action, setOpenAction] = useState(false);
  const [inviteBySkip, setInviteBySkip] = useState(0);
  const [inviteby, setInviteBy] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpenIB = (scrollType) => () => {
    setInviteBy(true);
    setScroll(scrollType);
    setInviteBySkip(0);
    dispatch(InviteByData({ nt_id: nt_id, skip: inviteBySkip }));
  };

  return (
    <>
      <div className="msgs_button" id="msgs_button">
        {top && (
          <div id="msg_button">
            {owner_flag && (
              <>
                {last_requested_user !== "" ||
                  accepted_count + rejected_count > 0 ? (
                  <>
                    <div className="d-flex msg_div" id="msg_div_button">
                      <img
                        className="msg_img"
                        alt=""
                        src={check}
                        style={{ marginLeft: "0px" }}
                        id="msg_img_button"
                      />
                      &nbsp;
                      <div
                        id="msg_txt_button"
                        className="msg_txt"
                        onClick={() => {
                          setOpenACR(true);
                        }}
                      >
                        &nbsp; Check status of invitations sent
                      </div>
                    </div>
                    {window.screen.width >= 768 && (
                      <hr
                        style={{
                          border: "1px solid #F4F6F8",
                          opacity: "100%",
                        }}
                      />
                    )}
                  </>
                ) : null}
              </>
            )}

            {!owner_flag && invite_by?.length > 0 && !has_removed && (
              <>
                <div className="d-flex msg_div" id="msg_div_button">
                  <img
                    className="msg_img"
                    id="msg_img_button"
                    alt=""
                    src={check}
                    style={{ marginLeft: "0px" }}
                  />
                  &nbsp;
                  <div
                    className="msg_txt"
                    onClick={handleClickOpenIB("paper")}
                    id="msg_txt_button"
                  >
                    {/* &nbsp;{" "} */}
                    <>
                      @{invite_by?.[0]?.["username"]}{" "}
                      {invite_by?.length > 1 ? (
                        <>
                          {" "}
                          and
                          {invite_by?.length - 1 > 1 ? (
                            <> {invite_by?.length - 1} Others have</>
                          ) : (
                            <> {invite_by?.length - 1} Other have</>
                          )}{" "}
                        </>
                      ) : (
                        <>  {allWords.misc.hassecond} </>
                      )}{" "}
                      {allWords.misc.invitedu}
                      {accept && <> and you have accepted the invite.</>}
                      {reject && <> and you have rejected the invite.</>}
                      {!owner_flag && (
                        <>
                          {has_rejected && !reject && (
                            <> and you have rejected the invite.</>
                          )}
                          {has_accepted && !accept && (
                            <> and you have accepted the invite.</>
                          )}
                        </>
                      )}
                    </>
                  </div>
                </div>
                {window.screen.width >= 768 && (
                  <hr
                    style={{
                      border: "1px solid #E4E9F0",
                      opacity: "100%",
                    }}
                  />
                )}
              </>
            )}

            {accept && invite_by?.length === 0 && (
              <>
                <div className="d-flex msg_div" id="msg_div_button">
                  <img
                    className="msg_img"
                    id="msg_img_button"
                    alt=""
                    src={AcceptInvite}
                    style={{ marginLeft: "0px" }}
                  />
                  &nbsp;
                  <div className="msg_txt" id="msg_txt_button">
                    {/* &nbsp; */}
                    You have accepted the invite.
                  </div>
                </div>
                {window.screen.width >= 768 && (
                  <hr
                    style={{
                      border: "1px solid #E4E9F0",
                      opacity: "100%",
                    }}
                  />
                )}
              </>
            )}

            {reject && invite_by?.length === 0 && (
              <>
                <div className="d-flex msg_div" id="msg_div_button">
                  <img
                    className="msg_img"
                    id="msg_img_button"
                    alt=""
                    src={RejectInvite}
                    style={{ marginLeft: "0px" }}
                  />
                  &nbsp;
                  <div className="msg_txt" id="msg_txt_button">
                    {/* &nbsp;  */}
                    You have rejected the invite.
                  </div>
                </div>
                {window.screen.width >= 768 && (
                  <hr
                    style={{
                      border: "1px solid #E4E9F0",
                      opacity: "100%",
                    }}
                  />
                )}
              </>
            )}

            {has_rejected &&
              !reject &&
              !owner_flag &&
              invite_by?.length === 0 && (
                <>
                  <div className="d-flex msg_div" id="msg_div_button">
                    <img
                      className="msg_img"
                      id="msg_img_button"
                      alt=""
                      src={RejectInvite}
                      style={{ marginLeft: "0px" }}
                    />
                    &nbsp;
                    <div className="msg_txt" id="msg_txt_button">
                      {/* &nbsp;  */}
                      You have rejected the invite.
                    </div>
                  </div>
                  {window.screen.width >= 768 && (
                    <hr
                      style={{
                        border: "1px solid #E4E9F0",
                        opacity: "100%",
                      }}
                    />
                  )}
                </>
              )}

            {has_accepted &&
              !accept &&
              !owner_flag &&
              invite_by?.length === 0 && (
                <>
                  <div className="d-flex msg_div" id="msg_div_button">
                    <img
                      className="msg_img"
                      id="msg_img_button"
                      alt=""
                      src={AcceptInvite}
                      style={{ marginLeft: "0px" }}
                    />
                    &nbsp;
                    <div className="msg_txt" id="msg_txt_button">
                      {/* &nbsp;  */}
                      You have accepted the invite.
                    </div>
                  </div>
                  {window.screen.width >= 768 && (
                    <hr
                      style={{
                        border: "1px solid #E4E9F0",
                        opacity: "100%",
                      }}
                    />
                  )}
                </>
              )}

            {has_removed && (
              <>
                <div className="d-flex msg_div" id="msg_div_button">
                  <img
                    className="msg_img"
                    id="msg_img_button"
                    alt=""
                    src={DeleteInvite}
                    style={{ marginLeft: "0px" }}
                  />
                  &nbsp;
                  <div className="msg_txt" id="msg_txt_button">
                    {/* &nbsp;  */}
                    RoundTable owner has removed your invite as
                    {moderator_flag && <b> MODERATOR</b>}
                    {audience_flag && <b> AUDIENCE</b>}
                    {speaker_flag && <b> PANELIST</b>}.
                  </div>
                </div>
                {window.screen.width >= 768 && (
                  <hr
                    style={{
                      border: "1px solid #E4E9F0",
                      opacity: "100%",
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}

        {bottom && (
          <InviteMore
            past={past}
            owner_flag={owner_flag}
            acr={acr}
            rt_name={rt_name}
            speaker_flag={speaker_flag}
            audience_flag={audience_flag}
            moderator_flag={moderator_flag}
            rt_id={rt_id}
            invitation_token={invitation_token}
            setAccept={setAccept}
            setReject={setReject}
            speakers={speakers}
            moderator={moderator}
            rt_nature={rt_nature}
          />
        )}
      </div>

      <RTDialogs
        open_acr={open_acr}
        setOpenACR={setOpenACR}
        rt_details={rt_details}
        open_action={open_action}
        setOpenAction={setOpenAction}
        inviteby={inviteby}
        setInviteBy={setInviteBy}
        scroll={scroll}
        invite_by={invite_by}
        inviteBySkip={inviteBySkip}
        setInviteBySkip={setInviteBySkip}
        nt_id={nt_id}
      />
    </>
  );
}
