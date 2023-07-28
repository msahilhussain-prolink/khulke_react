import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { MutePerson } from "../../pages/AgoraSandbox/MutePerson";
import { allWords } from "../../App";

export default function MutedAudienceList(props) {
  const { muted_audience_list, setMutedAudienceList, mute_username, muteUser } =
    props;

  const [mute_array, setMuteArray] = useState([]);

  function getUnique(arr, index) {
    const unique = arr
      .map((e) => e[index])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return setMuteArray(unique);
  }
  useEffect(() => {
    getUnique(mute_username, "username");
  }, [mute_username]);
  return (
    <Modal
      open={muted_audience_list}
      onClose={() => {
        setMutedAudienceList(false);
      }}
    >
      <div
        className="outer"
        style={{
          top: "12%",
          right: "calc((100vw - 1300px) / 2 - 50px)",
        }}
      >
        <div className="inner">
          <div className="participantDiv">
            <span className="title-span">Muted Audience</span>
          </div>

          <div className="mt-2">
            {mute_array?.length > 0 ? (
              <>
                {mute_array?.map((item) => (
                  <MutePerson
                    key={item}
                    person={item}
                    mutedShowDots={true}
                    mute_option
                    muteUser={muteUser}
                  />
                ))}
              </>
            ) : (
              <div className="container-fluid text-center mb-5 pt-2">
                <small className="text-muted">
                  {allWords.misc.livert.nomuted}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
