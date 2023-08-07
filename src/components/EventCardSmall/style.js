import styled from "styled-components";
import Button from "@mui/material/Button";

export const Container = styled.div`
  border-radius: 10px;
  // border: 1px solid #E4E9F0;
  /* padding-left: 0.2rem; */
  /* padding-right: 0.2rem; */
  /* margin-bottom: 0.5rem; */
  // margin-top: 0.5rem,
  margin-right: 0.4rem;
`;
export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  p {
    opacity: 0.5;
    margin-left: 0.4rem;
  }
  .dot_icon {
    opacity: 0.5;
  }
  .icon {
    color: ${(props) => props.theme.color.flamingo};
  }
`;
export const CardBody = styled.div`
  display: flex;
`;

export const CardFooter = styled.div`
  /* margin-top: 0.8rem; */
  display: flex;
  justify-content: space-between;
`;

export const ImgContainer = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 10px;
`;

export const CardTitle = styled.p`
  font-size: 1rem;
  margin-left: 0.5rem;
  font-weight: bold;
  line-height: 1rem;
  white-space: nowrap;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReminderBtn = styled(Button)`
  border: 1px solid ${(props) => props.theme.color.primary} !important;
  border-radius: 50px !important;
  text-transform: capitalize !important;
  padding: 0.3rem !important;
  margin-top: 1rem;
  color: ${(props) => props.theme.color.primary} !important;
  font-size: 1rem;
  .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

export const ShareBtn = styled(Button)`
  border: 1px solid ${(props) => props.theme.color.boulder} !important;
  color: ${(props) => props.theme.color.boulder} !important;
  border-radius: 50px !important;
  text-transform: capitalize !important;
  margin-top: 1rem;
  padding: 0.2rem !important;
  font-size: 0.86rem;
  .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

export const CardTime = styled.p`
  color: #63779c;
  margin-top: -1rem;
  margin-left: 2px;
  font-size: 10px;
`;

export const CenterTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CenterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -0.5rem;
  margin-right: 1.5rem;
`;

export const CenterDiv = styled.div`
  display: flex;
`;

export const ModeratorImg = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 25px;
`;

export const PanelistTag = styled.p`
  color: #63779c;
`;

export const ModeratorTag = styled.p`
  color: #63779c;
`;

export const ModeratorTagName = styled.p`
  font-weight: bold;
  width: min-content;
  margin-left: 0.4rem;
`;

export const ViewersTag = styled.p`
  color: #63779c;
`;

export const ViewersTagName = styled.p`
  font-weight: bold;
  font-size: 2rem;
`;

export const TimeImg = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 0.4rem;
  margin-top: -1rem;
`;

export const CommentsIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 0.4rem;
  // margin-top: -1rem;
`;

export const CardDiv = styled.div`
  display: flex;
`;

export const UpBtn = styled.button`
  background-color: aliceblue;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.3rem;
  text-transform: capitalize !important;
  color: ${(props) => props.theme.color.primary} !important;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
  width: 5rem;
`;

export const LiveBtn = styled.button`
  background-color: #f5cece;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.3rem;
  text-transform: capitalize !important;
  color: #d53512 !important;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
  width: 5rem;
`;

export const PastBtn = styled.button`
  background-color: #f0f6ff;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.3rem;
  text-transform: capitalize !important;
  color: #63779c !important;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
  width: 6rem;
`;

export const AcceptBtn = styled.button`
  background-color: #66b984;
  border-radius: 50px !important;
  border: aliceblue;
  padding: 0.4rem;
  text-transform: capitalize !important;
  color: white !important;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: auto;
  width: 6rem;
`;

export const RejectBtn = styled.button`
  background-color: white;
  border-radius: 50px !important;
  border: 1px solid #ed4d29;
  padding: 0.4rem;
  text-transform: capitalize !important;
  color: #ed4d29 !important;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 20px;
  width: 6rem;
`;

export const Btndiv = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

export const MainDiv = styled.div`
  /* margin-top: 1rem; */
  background: white;
  border-radius: 0.5rem;
  width: 100%;
`;

export const TitleDiv = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const TitleTxt = styled.div`
  margin-left: 2.4rem;
  margin-top: -1.9rem;
  font-size: 0.8rem;
  font-weight: bold;
`;

export const PanelImg = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 25px;
`;

export const PanelImg_1 = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 25px;
  margin-left: -1.7rem;
`;

export const PanelP = styled.p`
  width: 46px;
  height: 46px;
  border-radius: 25px;
  padding: 0.5rem;
  font-weight: bold;
  background-color: #66b984;
  color: white;
  text-align: center;
  margin-top: -2.8rem;
  margin-left: 3rem;
  position: relative;
`;
