import React from "react";

// Material
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Typography } from "@mui/material";

const InfoToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    background: "#FFFFFF 0% 0% no-repeat padding-box;",
    color: "#63779C",
    maxWidth: 430,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #70707041",
    borderRadius: "7px",
    marginTop: "-2rem",
    boxShadow: "4px 4px 16px #0000001F",
    paddingTop: "10px",
  },
}));

export default function InfoIcon({
  infoTitle1,
  infoTitle2,
  infoTitle3,
  infoTitle4,
  infoTitle5,
  infoTitle6,
  infoTitle7,
  infoTitle8,
  infoTitle9,
  infoTitle10,
  infoTitle11,
  width = "20px",
  height = "20px",
  mt = "-3px",
  placementProp = null,
}) {
  return (
    <>
      &nbsp;{" "}
      <InfoToolTip
        title={
          <>
            <Typography
              color="inherit"
              style={{ fontWeight: "600", fontSize: "14px" }}
            >
              {infoTitle1}
            </Typography>
            {infoTitle2 && (
              <Typography style={{ fontSize: "12px" }}>{infoTitle2}</Typography>
            )}
            {infoTitle3 && (
              <ul>
                <li> {infoTitle3}</li>
                <li> {infoTitle4}</li>
                {infoTitle5 && <li> {infoTitle5}</li>}
              </ul>
            )}
            {infoTitle6 && (
              <ol type="1">
                {infoTitle6 && <li> {infoTitle6} </li>}
                {infoTitle7 && <li> {infoTitle7} </li>}
                {infoTitle8 && <li> {infoTitle8} </li>}
                {infoTitle9 && <li> {infoTitle9} </li>}
                {infoTitle10 && <li> {infoTitle10} </li>}
                {infoTitle11 && <li> {infoTitle11} </li>}
              </ol>
            )}
          </>
        }
        placement={
          placementProp
            ? placementProp
            : infoTitle2?.includes("Auto-recording")
            ? "top-start"
            : "bottom-start"
        }
      >
        <InfoOutlinedIcon
          style={{
            width: width,
            height: height,
            marginTop: mt,
            color: "#63779C",
          }}
        />
      </InfoToolTip>
    </>
  );
}
