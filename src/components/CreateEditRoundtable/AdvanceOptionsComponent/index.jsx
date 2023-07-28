import React from "react";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CardContent, Collapse, IconButton } from "@mui/material";
import "./styles.css";
import ThumbnailComponent from "../ThumbnailComponent";
import { useSelector } from "react-redux";
import { ExpandMoreStyle } from "../styles";
import { allWords } from "../../../App";
import InfoIcon from "../../InfoIcon";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "0",
  width: "max-content",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const AdvanceOptionsComponent = () => {
  const isRecorded = useSelector((state) => state.createEditRoundtable.rtType);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {isRecorded === `${allWords.rt.opt3.toLowerCase()}` ? null : (
        <div className="row m-0 overflow-hidden">
          <div
            className="col-8 col-sm-5 col-xl-6  rt-advance-options-div"
            onClick={handleExpandClick}
          >
            {allWords.misc.advance_option}
            <InfoIcon infoTitle2={allWords.misc.advance_option_info} />
            <ExpandMore
              expand={expanded}
              aria-expanded={expanded}
              aria-label="show more"
              disableRipple
            >
              <ExpandMoreIcon style={ExpandMoreStyle} />
            </ExpandMore>
          </div>
          <Collapse
            className="rt-advance-options"
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <div className="row m-0">
                <div className="col-6 col-sm-6 col-md-6 col-xl-4">
                  <p className="rt-advance-upload-title">
                    {allWords.misc.intro_video}
                    <InfoIcon
                      infoTitle1={allWords.misc.pg3.uplintro.recomm}
                      infoTitle6={allWords.misc.pg3.uplintro.introl1}
                      infoTitle7={allWords.misc.pg3.uplintro.introl2}
                      infoTitle8={allWords.misc.pg3.uplintro.introl3}
                      infoTitle9={allWords.misc.pg3.uplintro.introl4}
                    />
                  </p>
                  <ThumbnailComponent
                    fileType="video"
                    text=""
                    uploadType="intro"
                  />
                </div>
                <div className="col-6 col-sm-6 col-md-6 col-xl-4">
                  <p className="rt-advance-upload-title">
                    {allWords.misc.outro_video}

                    <InfoIcon
                      infoTitle1={allWords.misc.pg3.uplintro.recomm}
                      infoTitle6={allWords.misc.pg3.uplintro.outro1}
                      infoTitle7={allWords.misc.pg3.uplintro.outro2}
                      infoTitle8={allWords.misc.pg3.uplintro.outro3}
                      infoTitle9={allWords.misc.pg3.uplintro.outro4}
                    />
                  </p>
                  <ThumbnailComponent
                    fileType="video"
                    text=""
                    uploadType="outro"
                  />
                </div>
              </div>
              <div className="row m-0 mt-3">
                <div className="col-6 col-sm-6 col-md-4 col-xl-4">
                  <p className="rt-advance-upload-title">
                    {allWords.misc.multiple_logos}
                    <InfoIcon
                      infoTitle1={allWords.misc.pg3.Recommendation}
                      infoTitle6={allWords.misc.pg3.ll1}
                      infoTitle7={allWords.misc.pg3.ll2}
                      infoTitle8={allWords.misc.pg3.l2}
                      infoTitle9={allWords.misc.pg3.ll4}
                    />
                  </p>
                  <ThumbnailComponent
                    fileType="image"
                    text=""
                    uploadType="logo1"
                  />
                </div>
                <div className="col-6 col-sm-6 col-md-4 col-xl-4">
                  <p
                    className="rt-advance-upload-title"
                    style={{ visibility: "hidden" }}
                  >
                    Logo2
                  </p>
                  <ThumbnailComponent
                    fileType="image"
                    text=""
                    uploadType="logo2"
                  />
                </div>
                <div className="col-6 col-sm-6 col-md-4 col-xl-4">
                  <p
                    className="rt-advance-upload-title"
                    style={{ visibility: "hidden" }}
                  >
                    Logo 3
                  </p>
                  <ThumbnailComponent
                    fileType="image"
                    text=""
                    uploadType="logo3"
                  />
                </div>
              </div>
              <div className="row m-0">
                <div className="col-6 col-sm-6 col-md-4 col-xl-3">
                  <p className="rt-advance-upload-title">
                    {allWords.th.document}
                    <InfoIcon
                      infoTitle1={allWords.misc.pg3.docRecommendation}
                      infoTitle6={allWords.misc.pg3.docl1}
                      infoTitle7={allWords.misc.pg3.docl2}
                      infoTitle8={allWords.misc.pg3.docl3}
                    />
                  </p>
                  <ThumbnailComponent
                    fileType="doc"
                    text=""
                    uploadType="rtDoc"
                  />
                </div>
              </div>
            </CardContent>
          </Collapse>
        </div>
      )}
    </>
  );
};

export default AdvanceOptionsComponent;
