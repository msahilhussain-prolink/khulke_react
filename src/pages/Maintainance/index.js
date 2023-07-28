import maintainance from "../../assets/icons/under_maintenance.svg";
// import logo from "../../assets/icons/KhulKe_logo.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MAINTAINANCE_KEY, MAINTAINANCE_URL } from "../../constants/env";
import { returnMinString, returnSecondString } from "../../utils/timeutils";
import ReactPlayer from "react-player";
import ToastHandler from "../../utils/ToastHandler";
import { allWords } from "../../App";
import { globalImages } from "../../assets/imagesPath/images";
export default function Maintainance() {
  const [timeRemaining, setTimeRemaining] = useState(1);
  const [intervalVar, setIntervalVar] = useState();
  const [youtubeLink, setYoutubeLink] = useState();
  const [mainErrFlag, setMainErrFlag] = useState(false);
  const [mainErrMsg, setMainErrMsg] = useState(false);

  const navigate = useNavigate();

  const getTimeRemaining = async () => {
    const apiData = {
      url: MAINTAINANCE_URL,
      method: "GET",
      headers: {
        "x-api-key": MAINTAINANCE_KEY,
      },
    };

    try {
      const response = await axios(apiData);

      if (response.status === 282) {
        return navigate("/roundtable/all", { replace: true });
      }

      if (response.status !== 200) {
        // return alert("Something went wrong");
        ToastHandler("dan", allWords.misc.somethingwrong);
        return;
      }

      const data = response.data.data;

      let time = new Date(data.end_time).getTime() - new Date().getTime();
      time = time / 1000;

      if (time <= 0) {
        return navigate("/");
      }

      setYoutubeLink(data.youtube_link);

      setIntervalVar(() => {
        return setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });

      setTimeRemaining(time);
    } catch (e) {
      // setMainErrFlag(true);
      // setMainErrMsg("We are facing some difficulty. Please try again!");
      return ToastHandler("dan", allWords.misc.pages.facingDiffi);
    }
  };

  useEffect(() => {
    getTimeRemaining();

    return () => {
      if (intervalVar) {
        clearInterval(intervalVar);
      }
    };
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      navigate("/roundtable/all", { replace: true });
    }
  }, [timeRemaining]);

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <section>
        <div className="container-fluid px-2">
          <div className="container d-flex justify-content-start">
            <div
              className="row"
              style={{
                margin: "auto",
              }}
            >
              <div className="col">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={globalImages.logo} alt="" width="75" height="75" />

                  <p
                    style={{
                      fontWeight: "bolder",
                      fontSize: "28px",
                    }}
                  >
                    Maintenance Break
                  </p>
                </div>
                <p
                  className="mt-3 mb-3"
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "normal",
                    textAlign: "center",
                  }}
                >
                  We are under maintenance of application
                </p>

                <ReactPlayer
                  lassName="react-player"
                  width="100%"
                  height="300px"
                  controls={true}
                  url={youtubeLink}
                  style={{
                    maxWidth: "500px",
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "15px",
                    border: "transparent",
                    marginTop: "25px",
                  }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                <p
                  className="ml-2 mt-3"
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "normal",
                    textAlign: "center",
                  }}
                >
                  We will be back in
                </p>
                <p
                  id="timer"
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "bolder",
                    textAlign: "center",
                  }}
                >
                  {returnMinString(timeRemaining)} :
                  {returnSecondString(timeRemaining)}
                </p>
              </div>
              <div className="col ml-5">
                <p
                  className="mt-5"
                  style={{
                    marginLeft: "30px",
                    fontSize: "1.35rem",
                    fontWeight: "normal",
                  }}
                >
                  What you can do:
                </p>

                <ul
                  style={{
                    listStyleType: "disc",
                    marginLeft: "20px",
                    fontSize: "1.1rem",
                  }}
                >
                  <li>
                    Visit our Website:
                    <Link to="/home" style={{ color: "#3e965e" }}>
                      https://khulke.com/home
                    </Link>
                  </li>
                  <li>
                    Visit our
                    <a
                      href="https://www.youtube.com/channel/UClcH1SszU2xH54IL6Nn9QEw"
                      style={{ color: "#3e965e", textDecoration: "none" }}
                    >
                      YouTube
                    </a>
                  </li>
                </ul>

                <div className="text-center">
                  <img
                    src={maintainance}
                    alt="Under Maintenance"
                    width="250px"
                    height="250px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
