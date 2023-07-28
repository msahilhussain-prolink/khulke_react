import React from "react";
import { MOBILE_VIEW } from "../../constants/env";
import ReadMoreReadLess from "../../utils/ReadMoreReadLess";
import { profileRedirect } from "../../utils/utils";
import UserProfile from "../UserProfile";
import { HrLine } from "./style";

export default function PersonList({
  username,
  name,
  bio,
  label1,
  label2,
  label3,
  item,
  speakers,
}) {
  return (
    <div
      className="py-2"
      style={{
        cursor: "pointer",
        paddingTop: item?.user_id === speakers?.[0]?.user_id ? "1.5rem" : "0",
      }}
      onClick={(e) => {
        if (!e.target.id.includes("read")) {
          profileRedirect(username);
        }
      }}
    >
      <div className="d-flex">
        <UserProfile username={username} className="avatar" />
        &emsp;
        <div style={{ width: "90%" }}>
          {label3 !== "record" ? (
            <>
              <div
                className="d-flex"
                style={{
                  display: "block",
                  width: MOBILE_VIEW ? "23rem" : "100%",
                }}
              >
                <h6
                  style={{
                    fontWeight: "600",
                    fontSize: "1.125rem",
                    color: "var(--secondary-heading-color)",
                  }}
                >
                  {name}
                </h6>
                &emsp; &nbsp;
                {label1 && (
                  <span className="text-muted modpan_label">{label1}</span>
                )}{" "}
                &emsp;
                {label2 && (
                  <span className="text-muted modpan_label">{label2}</span>
                )}
              </div>
              <h6 className="text-muted">@{username}</h6>
            </>
          ) : (
            <>
              <div
                className="d-flex"
                style={{
                  display: "block",
                  width: MOBILE_VIEW ? "71%" : "100%",
                }}
              >
                <h6
                  style={{
                    fontWeight: "600",
                    fontSize: "1.125rem",
                    color: "var(--secondary-heading-color)",
                  }}
                >
                  {username}
                </h6>
                &emsp; &nbsp;
                {label1 && (
                  <span className="text-muted modpan_label">{label1}</span>
                )}{" "}
                &emsp;
                {label2 && (
                  <span className="text-muted modpan_label">{label2}</span>
                )}
              </div>
              {bio === "" && <br />}
            </>
          )}
          {label1 !== "Owner" ? (
            <>
              {bio !== "" ? (
                <>
                  <div>
                    <ReadMoreReadLess
                      children={bio}
                      txtColorM={"#ed4d29"}
                      txtColor={"#11141c"}
                    />
                  </div>
                  {label2 === "" ? (
                    <>
                      <HrLine label3={label3} />
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {label2 === "" ? (
                    <>
                      <HrLine label3={label3} />
                    </>
                  ) : null}
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
