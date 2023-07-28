import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Material UI
import { Backdrop } from "@mui/material";
import InvitationCard from "./InvitationCard";

// Component

export default function InvitationPopUp() {
  const invitationData = useSelector((state) => state.invitePopUp.data);

  const [invPop, setInvPop] = useState(false);
  const [invData, setInvData] = useState([]);
  const [slideDetails, setSlideDetails] = useState({
    boxAnimate1: "animRotateLeft",
    boxAnimate2: "animLeftSlide",
  });
  const [clicked, setClicked] = useState(0);

  useEffect(() => {
    if (
      invitationData &&
      (invitationData?.status === 200 || invitationData?.status === 201)
    ) {
      let tempMod = [];
      let tempPan = [];
      let tempAud = [];
      invitationData?.data?.map((item) => {
        switch (item?.role) {
          case "moderator":
            tempMod.push(item);
            break;
          case "speakers":
            tempPan.push(item);
            break;
          case "audience":
            tempAud.push(item);
            break;
          default:
            break;
        }
      });
      setInvData(tempMod.concat(tempPan, tempAud));
      setInvPop(invitationData?.data?.length > 0 ? true : false);
    }
  }, [invitationData]);

  return (
    <>
      {invPop == true && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={invPop}
        >
          <div className="parent">
            {invData?.map((item, ind) => (
              <div
                className={`${
                  ind === clicked - 1
                    ? `box ${slideDetails?.boxAnimate1}`
                    : ind === clicked
                    ? "box animUp"
                    : "box d-none"
                }`}
                id={ind}
              >
                <div
                  className={`${
                    ind + 1 === clicked
                      ? `box2 ${slideDetails?.boxAnimate2}`
                      : "box2"
                  }`}
                >
                  <InvitationCard
                    item={item}
                    setClicked={setClicked}
                    ind={ind}
                    setSlideDetails={setSlideDetails}
                    setInvPop={setInvPop}
                    invData={invData}
                  />
                </div>
              </div>
            ))}
          </div>
        </Backdrop>
      )}
    </>
  );
}
