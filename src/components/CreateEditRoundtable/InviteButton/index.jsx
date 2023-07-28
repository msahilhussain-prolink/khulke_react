import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allWords } from "../../../App";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import { inviteVisitorData } from "../../../redux/actions/roundtableAction/inviteVisitor";
import StaticButtonComponent from "../StaticButtonComponent";
import { CancelPreview, CreateStyle } from "../styles";

export default function InviteButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selector = useSelector((state) => state.createEditRoundtable);
  const invite_visitor_data = useSelector((state) => state.inviteVisitor.data);

  const {
    urlRtId,
    wipRtId,
    inviteFollower,
    inviteFollowing,
    user_id,
    arrayId,
    emails,
    phones,
    phoneList,
    emailList,
  } = selector;

  const [inviteProceed, setInviteProceed] = useState(false);

  const inviteAudience = () => {
    let data = null;
    try {
      data = JSON.stringify({
        data: [
          {
            following: inviteFollowing,
            roundtable_id: urlRtId ?? wipRtId,
            followers: inviteFollower,
            user_id: user_id,
            past_rtid: arrayId,
            emails: emails.concat(emailList),
            phones: phones.concat(phoneList),
          },
        ],
      });

      setInviteProceed(true);
      dispatch(inviteVisitorData({ data: data }));
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (inviteProceed === true) {
      if (invite_visitor_data && invite_visitor_data?.status === 200) {
        navigate(
          urlRtId
            ? `/roundtable/edit/invite-success/${urlRtId}`
            : "/roundtable/create/invite-success"
        );
        dispatch(
          createEditRoundtableInitialize({
            phoneList: phones.concat(phoneList),
            phones: phones.concat(phoneList),
            emails: emails.concat(emailList),
            emailList: emails.concat(emailList),
          })
        );
      }
    }
  }, [invite_visitor_data]);

  return (
    <>
      <div className="row mx-0 mt-3">
        <div className="col-5 col-sm-4  col-xl-4 p-0">
          <StaticButtonComponent
            title={allWords.misc.btn_cancel}
            styles={CancelPreview}
            onClick={() => {
              navigate("/roundtable/all");
            }}
          />
        </div>

        <div className="col-5 col-sm-4 col-xl-4 p-0">
          <StaticButtonComponent
            disabled={
              !inviteFollower &&
              !inviteFollowing &&
              user_id?.length === 0 &&
              arrayId?.length === 0 &&
              emails?.length === 0 &&
              phones?.length === 0
                ? true
                : false
            }
            title={allWords.createRT.step4}
            styles={CreateStyle}
            onClick={inviteAudience}
          />
        </div>
      </div>
    </>
  );
}
