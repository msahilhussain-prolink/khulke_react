import { Grid, Tooltip } from "@mui/material";
import PreloginComp from "../../components/PreLoginComp";
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});

export default function PreLoginRT() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <Grid
      container
      style={{
        height: "100vh",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#191919",
      }}
    >
      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={<img src={RoundTableIconActive} alt="" width={40} height={40} />}
        title={"For watching complete RoundTable, Login or sign up to Khul Ke"}
        description={""}
        extraComp={
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "fixed",
              top: "20px",
              margin: "auto",
              width: "100%",
              left: "0px",
            }}
          >
            <NoMaxWidthTooltip
              title={
                <p className="fontBigNamee">
                  {JSON.parse(localStorage.join_rt).rt_name}
                </p>
              }
              followCursor
              arrow
            >
              <h5
                className="header-title"
                data-tip={JSON.parse(localStorage.join_rt).rt_name}
                style={{
                  color: "white",
                }}
              >
                {JSON.parse(localStorage.join_rt).rt_name}
              </h5>
            </NoMaxWidthTooltip>
          </Grid>
        }
      />
    </Grid>
  );
}
