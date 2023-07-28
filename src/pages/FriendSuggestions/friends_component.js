import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getFriendListData } from "../../redux/actions/interestAction/friendlist";
// import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
import ListComponent from "../../components/ListComponent";
import FormInput from "../../components/FormInput";
import Spinner from "../../components/Spinner";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";
import { allWords } from "../../App";
import { globalImages } from "../../assets/imagesPath/images";

const FriendComponent = () => {
  const follow_all_btn = useRef("");
  const dispatch = useDispatch();
  const tokens = useSelector((state) => state.token.tokens);

  const [curated, setCurated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data_error, setDataError] = useState(false);
  const [used_action, setUsedAction] = useState(false);
  const limit = 50;
  const [skip, setSkip] = useState(0);
  const navigate = useNavigate();

  if (!sessionStorage.getItem("interests")) {
    try {
      if (!JSON.parse(localStorage.getItem("current_user"))["interest"]) {
        navigate("/interests");
      }
    } catch (err) {
      navigate("/interests");
    }
  } else if (!localStorage.getItem("access")) {
    navigate("/");
  }

  function makeData() {
    let interests;
    if (sessionStorage.getItem("interests")) {
      interests = JSON.parse(sessionStorage.getItem("interests"))["data"];
    } else if (JSON.parse(localStorage.getItem("current_user"))["interest"]) {
      interests = JSON.parse(localStorage.getItem("current_user"))["interest"];
    }
    let stage = {
      data: interests,
    };
    let access = localStorage.getItem("access");
    return { interests: stage, access: access, limit: limit, skip: skip };
  }

  useEffect(async () => {
    let data = makeData();
    dispatch(getFriendListData(data));
  }, []);

  const suggested_err = useSelector((state) => state.suggestion.error);
  let suggested = useSelector((state) => state.suggestion.interest);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom && !loading) {
      setSkip(skip + 10);
      const data = makeData();
      dispatch(getFriendListData(data));
    }
  };

  useEffect(() => {
    if (suggested_err) {
      setDataError("Something went wrong while gettings suggested users list");
    } else if (suggested?.data?.length > 0) {
      setCurated((prev) => {
        return [...new Set([...prev, ...suggested["data"]])];
      });
      setLoading(false);
    }
  }, [suggested, suggested_err]);

  //TODO: Translate to redux

  const follow_unfollow_driver = async (handle, type) => {
    if (!used_action) {
      setUsedAction(true);
    }

    if (!handle || !type) {
      return;
    }
    let data = JSON.stringify({ handle, type });
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then((res) => {
        if (res.status === 200) {
          let temp_solution = [...curated];
          let toset = true;
          if (type === "unfollow") {
            toset = false;
          }
          for (let i = 0; i < temp_solution.length; i++) {
            if (temp_solution[i]["username"] === handle) {
              temp_solution[i]["is_following"] = toset;
              setCurated(temp_solution);
              return;
            }
          }
        } else if (res.status === 252) {
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(() =>
            follow_unfollow_driver(handle, type)
          );
        }
      });
  };

  async function filterResults(e) {
    setLoading(true);
    await new Promise((r) => {
      setTimeout(r, 2000);
    });
    let filtered_data = suggested["data"].filter((item) => {
      if (
        item["username"].toLowerCase().includes(e.target.value.toLowerCase()) ||
        item["name"].toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return item;
      }
    });
    setCurated(filtered_data);
    setLoading(false);
  }
  const followAll = () => {
    follow_all_btn.current.style.display = "none";
    setLoading(true);
    let usernames_curated = [];
    curated.forEach((item) => {
      usernames_curated.push({
        phone_number: "",
        username: item.username,
        email: "",
      });
    });

    var data = JSON.stringify({
      data: usernames_curated,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-all/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          let temp = [...curated];
          temp.forEach((item) => {
            item["is_following"] = true;
          });
          setCurated(temp);
          setLoading(false);
          setUsedAction(true);
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return setLoading(false);
        if (res.status === 401) {
          return await auto_login_continue(() => {
            return followAll();
          });
        }
        setLoading(false);
      });
  };
  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <div className="col-sm-12 col-md-10 col-lg-10 d-flex justify-content-between">
        <img
          src={globalImages.logo}
          height={"100px"}
          width={"100px"}
          alt="KhulKe Logo"
        />
        {!used_action ? (
          <Link
            to="/home"
            className="link-button pl-2 mt-5"
            style={{ fontSize: "1.125rem" }}
          >
            {allWords.misc.skip}
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="col-sm-12 col-md-10 col-lg-10">
        <div className="mt-2">
          <div className="d-flex justify-content-between">
            <h1 className="primary-heading">
              Follow friends who share similar interests
            </h1>
          </div>
          <br />
          <div className="d-flex justify-content-between">
            <small className="text-muted-dark" style={{ fontSize: "1rem" }}>
              Follow your friends
            </small>
            <span></span>
            <small>
              <Link
                to="#"
                ref={follow_all_btn}
                className="link-button"
                onClick={followAll}
              >
                Follow All
              </Link>
            </small>
          </div>
        </div>
        {data_error ? (
          <div className="container text-center mt-5">
            <p className="warn-text">Something went wrong! Try again later!</p>
          </div>
        ) : (
          <>
            <FormInput>
              <input
                type="text"
                id="search_friends"
                placeholder="Search friends"
                onChange={(e) => {
                  filterResults(e);
                }}
              />
            </FormInput>
            <div
              className="friends-list mt-3"
              onScroll={handleScroll}
              style={{ paddingRight: "5%" }}
            >
              {loading ? (
                <Spinner />
              ) : curated !== "No users found with similar interest" ? (
                <ListComponent
                  render_points={curated}
                  btn_fucntion={follow_unfollow_driver}
                  type={"follow"}
                  need_badge={false}
                  div_border={false}
                />
              ) : curated.length === 0 ? (
                <div className="text-center">
                  <small className="warn-text">{curated}</small>
                </div>
              ) : (
                <div className="text-center">
                  <small className="warn-text">{curated}</small>
                </div>
              )}
            </div>
            <Link
              to="/home"
              className={
                used_action
                  ? `btn primary-btn-blk`
                  : `disabled-button btn primary-btn-blk`
              }
            >
              CONTINUE
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendComponent;
