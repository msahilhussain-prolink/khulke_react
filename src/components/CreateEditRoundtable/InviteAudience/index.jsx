import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";

// Constants
import { allWords } from "../../../App";

// Redux
import { getPastRTData } from "../../../redux/actions/pastRTAction";
import { userProfileData } from "../../../redux/actions/profileAction/userProfileAction";
import { getRTData } from "../../../redux/actions/roundtableAction";

// Component
import InfoIcon from "../../InfoIcon";
import InviteFollow from "../../InviteFollow";
import InviteMore from "../../InviteMore";
import PastAttendees from "../../PastAttendees";
import InviteButton from "../InviteButton";
import SearchUser from "./SearchUser";

export default function InviteAudience() {
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  const dispatch = useDispatch();

  // Global State
  const user_profile = useSelector((state) => state.user_profile.data);
  const pastrtdata = useSelector((state) => state.pastrt.pastrt);

  const [follower_count, setFollowerCount] = useState(0);
  const [following_count, setFollowingCount] = useState(0);
  const [error_msg, setErrorMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pastCheck, setPastCheck] = useState([]);
  const [temp_check, setTempCheck] = useState([]);
  const [audience, setAudience] = useState("");

  const [audience_debounce] = useDebounce(audience, 1000);

  useEffect(() => {
    let data = { type: "my", token: localStorage.access };
    dispatch(getRTData(data));
    dispatch(userProfileData({ username: current_user["username"] }));
    dispatch(getPastRTData());
  }, []);

  useEffect(() => {
    if (user_profile && user_profile.status === 200) {
      setFollowerCount(user_profile?.data?.["count"]?.["followers"]);
      setFollowingCount(user_profile?.data?.["count"]?.["following"]);
    }
  }, [user_profile]);

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

  return (
    <div>
      <div className="row">
        <Link className="preview-link-class" to={"/roundtable/all"}>
          <img src={"/assets/icons/back.svg"} alt="back" />
        </Link>
        <h3 className="preview-h3">{allWords.misc.invite_your_audience}</h3>
      </div>

      <div
        className="mt-4 d-flex justify-content-between"
        style={{ marginBottom: "15px" }}
      >
        <small
          style={{ color: "#63779C", fontWeight: "bold", fontSize: "16px" }}
        >
          {allWords.misc.pg4.invite}
          <InfoIcon infoTitle2={allWords.misc.pg4.iinvite} />
        </small>
      </div>

      <div className="my-3">
        <InviteFollow
          custom_text={allWords.misc.allfollower}
          custom_count={follower_count}
          invite_type="inviteFollower"
        />
      </div>

      <div className="my-3">
        <InviteFollow
          custom_text={allWords.misc.allfollowing}
          custom_count={following_count}
          invite_type="inviteFollowing"
        />
      </div>

      <div className="my-3">
        <PastAttendees
          loading={loading}
          error_msg={error_msg}
          pastCheck={pastCheck}
          temp_check={temp_check}
          setTempCheck={setTempCheck}
        />
      </div>

      <div style={{ marginBottom: "15px", marginTop: "2.5rem" }}>
        <small
          style={{ color: "#63779C", fontWeight: "bold", fontSize: "16px" }}
        >
          {allWords.misc.pg4.invitemore}
          <InfoIcon infoTitle2={allWords.misc.pg4.iinvite} />
        </small>
      </div>

      <div className="row mx-0">
        <div className="col-11 px-0">
          <SearchUser
            setAudience={setAudience}
            audience_debounce={audience_debounce}
          />

          <InviteMore />
        </div>
      </div>

      <InviteButton />
    </div>
  );
}
