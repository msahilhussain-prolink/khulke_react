import React from "react";
import { Link } from "react-router-dom";
import { allWords } from "../../App";
// Constants
import { POST_API_BASE_URL } from "../../constants/env";

// Assets
import Delete from "../../assets/icons/Group 19618.svg";
import UserProfile from "../UserProfile";

export default function UserList(props) {
  const {
    user,
    index,
    setPanSelected,
    setPanelistBio,
    panelist_div_ref,
    setEditID,
    added_panelists,
    setAddedPanelists,
  } = props;

  const DeletePanelist = (item_id) => {
    let temp = [...added_panelists];
    temp = temp.filter((item) => item.index !== item_id);
    setAddedPanelists(temp);
  };
  return (
    <>
      <div
        className="d-flex my-4 pb-2"
        style={{
          borderBottom: "1px solid lightgray",
          paddingTop: index === 0 ? "1.8rem" : "",
        }}
        key={index}
      >
        <div>
          <UserProfile username={user.speaker_name} className="avatar" />
        </div>
        <div className="px-3" style={{ width: "85%" }}>
          <h6
            style={{
              fontSize: "1.125rem",
              margin: 0,
              textTransform: "capitalize",
            }}
          >
            {user.speaker_fullname}
          </h6>
          <span
            style={{
              display: "inline-block",
            }}
            className="text-muted"
          >
            @{user.speaker_name}
          </span>

          <p
            className="panelist-mapped-div"
            style={{
              textAlign: "left",
              paddingTop: "6px",
              color: "#475376",
              fontSize: "0.8rem",
            }}
          >
            {user.bio}
          </p>
          <Link
            onClick={() => {
              setPanSelected({
                label: user.speaker_name,
                value: user.speaker_fullname,
              });
              setPanelistBio(user.bio);
              panelist_div_ref.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
              });
              setEditID(user["index"]);
            }}
            style={{ color: "#ED4D29", fontSize: "0.9rem" }}
            to="#"
          >
            {allWords.misc.livert.editp}
          </Link>
        </div>
        <div
          style={{
            height: "2.25rem",
            width: "auto",
            cursor: "pointer",
          }}
          onClick={() => {
            DeletePanelist(user.index);
          }}
        >
          <img
            alt=""
            height="100%"
            width="auto"
            style={{
              border: "0.5px solid lightgray",
              padding: "0.3rem",
              borderRadius: "10px",
            }}
            src={Delete}
          />
        </div>
      </div>
    </>
  );
}
