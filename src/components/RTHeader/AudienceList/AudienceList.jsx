import React from "react";
import { useSelector } from "react-redux";
import "./audienceList.css";
import { Modal } from "@mui/material";
import { FiberManualRecord } from "@material-ui/icons";
import { allWords } from "../../../App";

export default function AudienceList({
  setShowAudienceList,
  showAudienceList,
  participantCount,
  style,
  disabledWildcardAddition,
}) {
  // global state
  const {
    current_user,
    moderator,
    mod_pan_list,
    viewers,
    NoUsers,
    wc_uids,
    Person,
  } = useSelector((state) => state.HeaderData.data);

  let localData = JSON.parse(localStorage.join_rt);
  const fullScr = useSelector((state) => state.fullScreen);
  const FURT = useSelector((state) => state.followUnfollowInRT.followings);

  return (
    <Modal
      open={showAudienceList}
      onClose={() => {
        setShowAudienceList(false);
      }}
    >
      <div className="outer" style={{ position: "fixed" }}>
        <div className="inner">
          <div className="participantDiv">
            <span className="title-span">
              {allWords.misc.livert.Participants}
            </span>
            <div className="participantRight">
              <FiberManualRecord
                className="dot_icon"
                style={{ color: "green", width: "0.8rem" }}
              />
              <span
                style={{ color: fullScr.full ? "white" : "", marginTop: "4px" }}
              >
                {participantCount}
              </span>
            </div>
          </div>
          {/* {show_self && role !== "host" && (
          <div className="my-2">
            <Person
              className="personInHeader"
              person={{
                name: current_user.name,
                username: current_user.username,
                role: role,
              }}
              you
            />
          </div>
        )} */}
          <p className="title-span title-span-not1">
            {allWords.misc.livert.mod}
            {/* <span className="count-span">({moderator.has_confirmed})</span> */}
          </p>
          <Person
            person={moderator}
            you={moderator?.username === current_user?.username}
            showWildOption={false}
            no_hand
            requests
            showFollow={FURT.includes(moderator?.username) ? false : true}
            user_type={moderator?.user_type}
          />
          {Array.from(new Set(mod_pan_list))?.filter((item) => {
            return item.username !== moderator.username;
          }).length > 0 && (
            <>
              <p className="title-span-not1">
                {allWords.panelistLabel}
                {/* <span className="count-span"> ({moderator.has_confirmed})</span> */}
              </p>
              {Array.from(
                new Set(
                  mod_pan_list.filter((item) => {
                    return item.username !== moderator.username;
                  })
                )
              )
                .sort((a, b) => {
                  return a.username
                    ?.toLowerCase()
                    ?.localeCompare(b.username?.toLowerCase());
                })
                .map((item) => {
                  return (
                    <Person
                      showWildOption={false}
                      key={item.username}
                      person={item}
                      you={item.username === current_user.username}
                      no_hand
                      panelist={true}
                      showFollow={FURT.includes(item?.username) ? false : true}
                      user_type={item.user_type}
                    />
                  );
                })}
            </>
          )}
          {wc_uids?.length > 0 && (
            <p className="title-span-not1">
              {allWords.misc.livert.wildc}
              {/* <span className="count-span">
              ({newWildListSet && newWildListSet.length})
            </span> */}
            </p>
          )}
          {wc_uids?.length > 0 &&
            Array.from(new Set(wc_uids))?.map((wc) => {
              return (
                <Person
                  key={current_user?.username}
                  person={{ username: wc }}
                  you={wc === current_user.username}
                  no_hand
                  user_id={wc}
                  no_add_wildcard={true}
                  showWildOption={true}
                  disabledWildcardAddition={disabledWildcardAddition}
                  showFollow={FURT?.includes(wc) ? false : true}
                />
              );
            })}
          {mod_pan_list?.length === 0 && NoUsers && (
            <NoUsers type={"panelists"} />
          )}

          {viewers?.length > 0 && (
            <>
              <p className="title-span-not1">
                {allWords.misc.livert.Audience}
                <span className="count-span"></span>
              </p>

              <div className="audience-in-header">
                {viewers.length > 0 &&
                  Array.from(
                    new Set(
                      viewers.filter((item) => {
                        if (!wc_uids.includes(item)) {
                          return true;
                        }
                        return false;
                      })
                    )
                  )
                    .sort((a, b) => {
                      return a.toLowerCase().localeCompare(b.toLowerCase());
                    })
                    .map((item) => {
                      return (
                        <Person
                          key={item}
                          owner={
                            localData.owner.username === item ? true : false
                          }
                          person={{ name: item, username: item }}
                          no_remove_wildcard={true}
                          showWildOption={true}
                          showFollow={FURT.includes(item) ? false : true}
                          disabledWildcardAddition={disabledWildcardAddition}
                        />
                      );
                    })}
              </div>
              {viewers.length === 0 && <NoUsers type={"viewers"} />}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
