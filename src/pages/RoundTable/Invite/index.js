import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDebounce } from "use-debounce";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// Redux
import { getRTData } from "../../../redux/actions/roundtableAction";
import { getRTSingleData } from "../../../redux/actions/roundtableAction/single_roundtable";

// Constants
import {
  REACT_APP_DEVICE_TYPE,
  POST_API_BASE_URL,
} from "../../../constants/env";

// Components
import ConfirmButton from "../../../components/ConfirmButton";

// Styles
import "../Create/style.css";
import InviteFollow from "../../../components/InviteFollow";
import InviteMore from "../../../components/InviteMore";
import { userProfileData } from "../../../redux/actions/profileAction/userProfileAction";
import SearchUser from "./SearchUser";
import PastAttendees from "../../../components/PastAttendees";
import { getPastRTData } from "../../../redux/actions/pastRTAction";
import InfoIcon from "../../../components/InfoIcon";
import { allWords } from "../../../App";

export default forwardRef(function InvitePanel(props, ref) {
  const {
    setProgress,
    url_rt_id,
    setSendData,
    sendData,
    wip_rt_id,
    setProgressName,
    setCreatedID,
    parsed_data,
    setProgressFour,
    navigate,
  } = props;
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  const dispatch = useDispatch();

  // Global State
  const user_profile = useSelector((state) => state.user_profile.data);
  const pastrtdata = useSelector((state) => state.pastrt.pastrt);

  // Local state
  let [rt_id, setRTId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [current_audience, setCurrentAudience] = useState([]);
  const [audience, setAudience] = useState("");
  const [visitor_id, setVisitorId] = useState([]);
  // Get list of past rt
  const [rt_array, setArray] = useState([]);
  const [email_list, setEmailList] = useState([]);
  const [phone_list, setPhoneList] = useState([]);
  const [phone_numbers, setPhoneNumbers] = useState([]);
  const [phone, setPhone] = useState([]);
  const [email, setEmail] = useState([]);
  const [follower_count, setFollowerCount] = useState(0);
  const [following_count, setFollowingCount] = useState(0);
  const [array_id, setArrayId] = useState([]);
  const [invite_follower, setInviteFollower] = useState(false);
  const [invite_followings, setInviteFollowings] = useState(false);
  const [user_id, setUserId] = useState([]);
  const [error_msg, setErrorMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pastCheck, setPastCheck] = useState([]);
  const [temp_check, setTempCheck] = useState([]);
  const [visitor_data, setVisitorData] = useState([]);

  // useDebounce
  const [audience_debounce] = useDebounce(audience, 1000);

  useEffect(() => {
    if (!url_rt_id) {
      setRTId(wip_rt_id);
    } else {
      let data = {
        rt_id: url_rt_id,
        token:
          localStorage.access || JSON.parse(localStorage.anonymous_user).token,
      };

      dispatch(getRTSingleData(data));
    }
  }, []);

  useEffect(() => {
    getFollow("following");
    getFollow("followers");
    let data = { type: "my", token: localStorage.access };
    dispatch(getRTData(data));
    dispatch(userProfileData({ username: current_user["username"] }));
    dispatch(getPastRTData());
  }, []);

  useEffect(() => {
    if (pastrtdata && pastrtdata.status === 200) {
      setLoading(false);
      setErrorMsg(false);
      setTempCheck(pastrtdata.data);
      setPastCheck(pastrtdata.data);
    } else if (pastrtdata && pastrtdata.status === 253) {
      setLoading(false);
      setErrorMsg(true);
    } else {
      setLoading(true);
    }
  }, [pastrtdata]);

  useEffect(() => {
    if (user_profile && user_profile.status === 200) {
      setFollowerCount(user_profile?.data?.["count"]?.["followers"]);
      setFollowingCount(user_profile?.data?.["count"]?.["following"]);
    }
  }, [user_profile]);

  useEffect(() => {
    if (url_rt_id || wip_rt_id) {
      if (sendData?.["followers"] !== undefined) {
        setInviteFollower(sendData?.["followers"]);
      } else {
        setInviteFollower(parsed_data?.followers);
      }

      if (sendData?.["following"] !== undefined) {
        setInviteFollowings(sendData?.["following"]);
      } else {
        setInviteFollowings(parsed_data?.following);
      }

      if (sendData?.["user_id"] !== undefined) {
        setUserId(sendData?.["user_id"]);
      } else {
        setUserId(parsed_data?.user_id);
      }

      if (sendData?.["email_list"] !== undefined) {
        setEmailList(sendData?.["email_list"]);
      } else {
        setEmailList(parsed_data?.email_list);
      }

      if (sendData?.["phone_list"] !== undefined) {
        setPhoneList(sendData?.["phone_list"]);
      } else {
        setPhoneList(parsed_data?.phone_list);
      }

      if (sendData?.["past_rtid"] !== undefined) {
        setArray(sendData?.["past_rtid"]);
      } else {
        setArray(parsed_data?.past_rtid);
      }

      if (sendData?.["user_data"] !== undefined) {
        setVisitorData(sendData?.["user_data"]);
      }
    }
  }, [sendData]);

  useEffect(() => {
    if (invite_follower) {
      setCurrentAudience([...audience, ...followers]);
      setInviteFollower(true);
    } else {
      let temp = [...audience];
      temp = temp.filter((item) => {
        if (!temp.includes(item)) {
          return item;
        }
      });
      setCurrentAudience(temp);
    }
    if (invite_followings) {
      setCurrentAudience([...audience, ...following]);

      setInviteFollowings(true);
    } else {
      let temp = [...audience];
      temp = temp.filter((item) => {
        if (!temp.includes(item)) {
          return item;
        }
      });
      setCurrentAudience(temp);
    }
  }, [invite_follower, invite_followings]);

  const getFollow = (which) => {
    let username = current_user["username"];
    let config = {
      method: "get",
      url: `${POST_API_BASE_URL}/details-paginate?type=${which}&skip=0&username=${username}`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": current_user["_id"],
      },
    };

    axios(config)
      .then((response) => {
        let temp = [];
        if (response.data["data"] !== undefined) {
          response.data["data"].forEach((item) => {
            if (which === "following") {
              temp.push({
                viewer_fullname: item["name"],
                viewer_name: item["username"],
              });
            } else if (which === "followers") {
              temp.push({
                viewer_fullname: item["name"],
                viewer_name: item["username"],
              });
            }
          });
        }
        if (which === "following") {
          setFollowing(temp);
        } else if (which === "followers") {
          setFollowers(temp);
        }
      })
      .catch();
  };

  const InvitePeople = () => {
    let data = null;
    data = {
      name: sendData?.["name"],
      description: sendData?.["description"],
      open_to_all: sendData?.["open_to_all"],
      date: sendData?.["date"],
      end_time: sendData?.["end_time"],
      start_time: sendData?.["start_time"],
      durationHr: sendData?.["durationHr"],
      durationMin: sendData?.["durationMin"],
      anonymous: sendData?.["anonymous"],
      r_type: sendData?.["r_type"],
      visibility: sendData?.["visibility"],
      start_recording: sendData?.["start_recording"],
      host: sendData?.["host"],
      host_name: sendData?.["host_name"],
      bio: sendData?.["bio"],
      speakers: sendData?.["speakers"],
      category: sendData?.["category"],
      tags: sendData?.["tags"],
      image_filename: sendData?.["image_filename"],
      image_upload_name: sendData?.["image_upload_name"],
      doc_filename:
        sendData?.["doc_filename"] === undefined
          ? []
          : sendData?.["doc_filename"],
      document_upload_name: sendData?.["document_upload_name"],
      previous_document: sendData?.["previous_document"],
      doc_target_files: sendData?.["doc_target_files"],
      user_data: visitor_data,
      followers: invite_follower,
      following: invite_followings,
      user_id: visitor_data?.map((item) => item?._id),
      past_rtid: array_id?.concat(rt_array !== undefined ? rt_array : []),
      host_id: sendData?.["host_id"],
      m_type: sendData?.["m_type"],
      schedule:
        sendData?.["schedule"] !== undefined ? sendData?.["schedule"] : true,
    };

    if (!url_rt_id) {
      data["email_list"] = email;
      data["phone_list"] = phone;
      data["roundtable_id"] = rt_id;
      navigate("/roundtable/create/review");
    } else {
      data["email_list"] =
        email_list !== undefined ? email_list?.concat(email) : email;
      data["phone_list"] =
        phone_list !== undefined ? phone_list?.concat(phone) : phone;
      data["roundtable_id"] = url_rt_id;
      if (wip_rt_id) {
        navigate("/roundtable/create/review");
      } else {
        navigate(`/roundtable/edit/review/${url_rt_id}`);
      }
    }

    setSendData(data);
    setProgressFour(4);
    setProgressName("confirm");
    setCreatedID(wip_rt_id);
  };

  useImperativeHandle(ref, () => ({
    saveData() {
      let data = {
        name: sendData?.["name"],
        description: sendData?.["description"],
        open_to_all: sendData?.["open_to_all"],
        date: sendData?.["date"],
        end_time: sendData?.["end_time"],
        start_time: sendData?.["start_time"],
        durationHr: sendData?.["durationHr"],
        durationMin: sendData?.["durationMin"],
        anonymous: sendData?.["anonymous"],
        r_type: sendData?.["r_type"],
        visibility: sendData?.["visibility"],
        start_recording: sendData?.["start_recording"],
        host: sendData?.["host"],
        host_name: sendData?.["host_name"],
        bio: sendData?.["bio"],
        speakers: sendData?.["speakers"],
        category: sendData?.["category"],
        tags: sendData?.["tags"],
        image_filename: sendData?.["image_filename"],
        image_upload_name: sendData?.["image_upload_name"],
        doc_filename:
          sendData?.["doc_filename"] === undefined
            ? []
            : sendData?.["doc_filename"],
        document_upload_name: sendData?.["document_upload_name"],
        previous_document: sendData?.["previous_document"],
        doc_target_files: sendData?.["doc_target_files"],
        followers: invite_follower,
        following: invite_followings,
        user_data: visitor_data,
        user_id: visitor_data?.map((item) => item?._id),
        past_rtid: array_id?.concat(rt_array !== undefined ? rt_array : []),
        email_list: !url_rt_id
          ? email
          : email_list !== undefined
            ? email_list?.concat(email)
            : email,
        phone_list: !url_rt_id
          ? phone
          : phone_list !== undefined
            ? phone_list?.concat(phone)
            : phone,
        host_id: sendData?.["host_id"],
        m_type: sendData?.["m_type"],
        schedule:
          sendData?.["schedule"] !== undefined ? sendData?.["schedule"] : true,
      };
      setSendData(data);
    },
  }));

  return (
    <section>
      {/* Invite First Div */}
      <div
        className="mt-4 d-flex justify-content-between"
        style={{ marginBottom: "15px" }}
      >
        <small style={{ color: "#63779C", fontWeight: "bold" }}>
          {allWords.misc.pg4.invite}
          <InfoIcon infoTitle2={allWords.misc.pg4.iinvite} />{" "}
        </small>
      </div>

      {/* Follow Details */}

      <InviteFollow
        custom_text={allWords.misc.allfollower}
        custom_invite={invite_follower}
        custom_set_invite={setInviteFollower}
        custom_count={follower_count}
      />

      <InviteFollow
        custom_text={allWords.misc.allfollowing}
        custom_invite={invite_followings}
        custom_set_invite={setInviteFollowings}
        custom_count={following_count}
      />

      <PastAttendees
        url_rt_id={url_rt_id}
        rt_array={rt_array}
        array_id={array_id}
        setArrayId={setArrayId}
        loading={loading}
        error_msg={error_msg}
        pastCheck={pastCheck}
        temp_check={temp_check}
        setTempCheck={setTempCheck}
      />

      {/* Invite Second Div */}
      <div style={{ marginBottom: "15px", marginTop: "2.5rem" }}>
        <small style={{ color: "#63779C", fontWeight: "bold" }}>
          {allWords.misc.pg4.invitemore}
          <InfoIcon infoTitle2={allWords.misc.pg4.iinvite2} />
        </small>
      </div>

      <SearchUser
        sendData={sendData}
        setAudience={setAudience}
        setVisitorId={setUserId}
        audience_debounce={audience_debounce}
        rt_id={rt_id}
        visitor_data={visitor_data}
        setVisitorData={setVisitorData}
        url_rt_id={url_rt_id}
      />

      <InviteMore
        url_rt_id={url_rt_id}
        phone_numbers={phone_numbers}
        email_list={email_list}
        setPhone={setPhone}
        setEmail={setEmail}
        phone_list={phone_list}
        setPhoneNumbers={setPhoneNumbers}
      />

      <ConfirmButton is_valid={true} onclick={InvitePeople} />
    </section>
  );
});
