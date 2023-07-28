import { CenterDiv, LeftDiv, MainDiv, RightDiv } from "../style";
import AccountLeftSideBar from "../../../components/AccountLeftsideBar";
import BroadCastPage from "./BroadCastPage";

export default function BroadCastPageMain() {
  return (
    <MainDiv>
      <LeftDiv>
        <AccountLeftSideBar />
      </LeftDiv>
      <CenterDiv>
        <BroadCastPage />
      </CenterDiv>
      <RightDiv></RightDiv>
    </MainDiv>
  );
}
