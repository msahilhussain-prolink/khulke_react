import { Grid } from "@mui/material";
import { allWords } from "../../App";
import CommonRTListing from "./CommonRTListing";
import { useEffect, useState } from "react";
import { RTType } from "../../utils/RTType";
import { useSelector } from "react-redux";
import { auto_login_continue } from "../../utils/utils";

const MineRT = ({ width = window.innerWidth, isProfile = false }) => {
  const user_id = useSelector((state) => state?.user_profile?.data?.data?.self_user?._id);
  const [rtData, setRTData] = useState();
  const mineRtList = useSelector((state) => state?.mineRTList?.data);
  const mineRtIsError = useSelector((state) => state?.mineRTList?.isError);
  const mineRtError = useSelector((state) => state?.mineRTList?.error);
  const categoryRTList = useSelector((state) => state?.categoryRTList?.data);
  useEffect(()=>{
    if(mineRtList){
      setRTData(mineRtList)
    } else if(mineRtIsError && mineRtError?.response?.status === 401) {
      auto_login_continue();
    }
  },[mineRtList]);
  return (
    <Grid className="rtTabStep" container>
      <CommonRTListing
        isProfile={isProfile}
        width={width}
        data={{
          data: rtData?.owner,
          sentence: allWords.rtList.owner,
          type: RTType.OWNER,
        }}
        listType="MINE"
        type={RTType.OWNER.toLowerCase()}
        setRTData={setRTData}
        user_id={user_id}
        rtData={rtData}
      />
      <CommonRTListing
        isProfile={isProfile}
        width={width}
        data={{
          data: rtData?.moderator,
          sentence: allWords.rtList.moderator,
          type: RTType.MODERATOR,
        }}
        listType="MINE"
        type={RTType.MODERATOR.toLowerCase()}
        setRTData={setRTData}
        user_id={user_id}
        rtData={rtData}
      />
      <CommonRTListing
        isProfile={isProfile}
        width={width}
        data={{
          data: rtData?.panelist,
          sentence: allWords.rtList.panalist,
          type: RTType.PANALIST,
        }}
        listType="MINE"
        type={RTType.PANALIST.toLowerCase()}
        setRTData={setRTData}
        user_id={user_id}
        rtData={rtData}
      />
      <CommonRTListing
        isProfile={isProfile}
        width={width}
        data={{
          data: rtData?.audience,
          sentence: allWords.rtList.audiance,
          type: RTType.AUDIENCE,
        }}
        listType="MINE"
        type={RTType.AUDIENCE.toLowerCase()}
        setRTData={setRTData}
        user_id={user_id}
        rtData={rtData}
      />
    </Grid>
  )
};
export default MineRT;
