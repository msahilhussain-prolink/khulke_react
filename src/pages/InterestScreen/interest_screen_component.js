import React, { useEffect, useState } from "react";
// import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
import { Grid } from "@mui/material";
import TagManager from "react-gtm-module";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { globalImages } from "../../assets/imagesPath/images";
import FormInput from "../../components/FormInput";
import Spinner from "../../components/Spinner";
import logger from "../../logger";
import {
  getInterestData,
  updateInterestData,
} from "../../redux/actions/interestAction";
import { MyContentCard } from "./style";
import "./style.css";

const InterestScreenComponent = () => {
  if (!localStorage.getItem("access")) {
    window.location.replace("/");
  } else if (localStorage.getItem("interests")) {
    window.location.replace("/friends");
  } else if (
    JSON.parse(localStorage.getItem("current_user"))["is_invited"] === 0
  ) {
    // window.location.replace("/waiting"); //Temporary fix
  }

  const [searchInput, setSearchInput] = useState("");
  const [selected_iterests, setSelectedInterests] = useState([]);
  const [highlighted_interests, setHighlightedInterests] = useState([]);

  const dispatch = useDispatch();

  const allinterestData = useSelector((state) => state.interest.interest);
  const loading = useSelector((state) => state.interest.loading);
  const error = useSelector((state) => state.interest.error);
  const [curated, setCurated] = useState([]);
  useEffect(() => {
    if (allinterestData?.data) {
      let temp_structure = {};
      let temp_curated = [...curated];
      try {
        allinterestData["data"].forEach((item) => {
          let temp_main_category = item["item"][0]["category_name"];
          temp_structure[temp_main_category] = [];
          item["item"][0]["sub_category"].forEach((sub_item) => {
            temp_structure[temp_main_category].push(
              sub_item["sub_category_name"]
            );
          });
        });
        temp_curated.push(temp_structure);
        setCurated(temp_curated);
        return;
      } catch (err) {
        return;
      }
    }
  }, [allinterestData]);

  useEffect(() => {
    dispatch(getInterestData());
  }, []);

  const updateInterest = () => {
    const send_data = {
      data: selected_iterests,
    };
    dispatch(updateInterestData(send_data));
  };

  const user_interests = useSelector((state) => state.interest);
  useEffect(() => {
    if (user_interests && sessionStorage.getItem("interests")) {
      let temp_current_user = JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      );
      temp_current_user["interest"] = selected_iterests;
      localStorage.removeItem("current_user");
      localStorage.setItem("current_user", JSON.stringify(temp_current_user));
      window.location.replace("/friends");
    }
  }, [user_interests]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleInterestChange = (subitem, mainitem, action) => {
    let temp_selected_interests = [...selected_iterests];
    if (action === "add") {
      let structure = {
        category_name: mainitem,
        sub_category: [
          {
            sub_category_name: subitem,
          },
        ],
      };
      if (temp_selected_interests.length === 0) {
        temp_selected_interests.push(structure);
        setSelectedInterests(temp_selected_interests);
        return true;
      }
      let key_exists = false;
      temp_selected_interests.forEach((item) => {
        if (item["category_name"] === mainitem) {
          item["sub_category"].push({ sub_category_name: subitem });
          setSelectedInterests(temp_selected_interests);
          key_exists = true;
        }
      });
      if (!key_exists) {
        temp_selected_interests.push(structure);
        setSelectedInterests(temp_selected_interests);
      }

      return true;
    } else if (action === "remove") {
      temp_selected_interests.forEach((item) => {
        if (item["category_name"] === mainitem) {
          item["sub_category"] = item["sub_category"].filter(
            (interest) => interest["sub_category_name"] !== subitem
          );
        }
      });
      setSelectedInterests(temp_selected_interests);
    }
  };

  const [main_categories, setMainCategories] = useState([]);
  const filter_interests = () => {
    let temp_curated = [];
    Object.keys(curated[0]).forEach((main_item) => {
      curated[0][main_item].forEach((sub_item) => {
        if (sub_item.toLowerCase().includes(searchInput.toLowerCase())) {
          if (!temp_curated.includes(main_item)) {
            temp_curated.push(main_item);
          }
        }
      });
    });
    setMainCategories(temp_curated);
  };
  useEffect(() => {
    if (curated.length > 0) {
      filter_interests();
    }
  }, [curated, searchInput]);
  useEffect(() => {
    if (selected_iterests?.length > 0) {
      let temp_highlight = [];
      selected_iterests.forEach((interest) => {
        interest["sub_category"].forEach((sub_interest) => {
          temp_highlight.push(
            interest["category_name"] + "|" + sub_interest["sub_category_name"]
          );
        });
      });
      setHighlightedInterests(temp_highlight);
    }
  }, [curated, selected_iterests]);

  let current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // gtm events
  function gtmEventInterestPage() {
    TagManager.dataLayer({
      dataLayer: {
        event: "registration event",
        category: "Interest",
        action: "registration",
        label: "interest continue",
        userID: current_user._id,
      },
    });
    logger.info("interest page continue");
  }

  function gtmEventInterestPageSkip() {
    TagManager.dataLayer({
      dataLayer: {
        event: "registration event",
        category: "Interest",
        action: "registration",
        label: "interest skip",
        userID: current_user._id,
      },
    });
    logger.info("interest page skip");
  }

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <div
        className="row mb-2 col-sm-12 col-md-9 col-lg-9"
        style={{ padding: "0px", margin: "0px" }}
      >
        <div className="col-sm-6 col-md-6 col-lg-6">
          <img
            src={globalImages.logo}
            className="img-fluid logoTop"
            alt="KhulKe Logo"
          />
        </div>
        <div className="mt-2" style={{ padding: "0px", margin: "0px" }}>
          <div className="d-flex justify-content-between">
            <h1 className="primary-heading">What are your Interests?</h1>
            <Link
              to="/home"
              onClick={gtmEventInterestPageSkip}
              className="link-button pl-2"
            >
              Skip
            </Link>
          </div>
          <small className="text-muted-dark" style={{ fontSize: "1rem" }}>
            Select your interests
          </small>
        </div>
      </div>
      <br />

      <div className="col-lg-9 col-md-9 col-sm-12">
        <FormInput>
          <input
            type="text"
            placeholder="Search Interest"
            onChange={handleSearch}
          />
        </FormInput>
        <MyContentCard>
          <div className="event_container">
            <Grid container spacing={2}>
              <>
                {curated.length > 0 &&
                  Object.keys(curated[0])?.map((item, index) => (
                    <div className="container-fluid" key={index}>
                      {main_categories.includes(item) && (
                        <Grid item md={12} mt={3} mb={1}>
                          <div>
                            <img
                              alt=""
                              src={`https://via.placeholder.com/300x300/66B984/FFFFFF?text=${item[0].toUpperCase()}`}
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "7px",
                              }}
                            />
                            <small
                              style={{
                                marginLeft: "15px",
                                marginTop: "-25px",
                                fontWeight: "bold",
                              }}
                            >
                              {item}
                            </small>
                          </div>

                          <Grid container>
                            {curated[0][item]
                              .filter((fil_sub_item) => {
                                if (
                                  fil_sub_item
                                    .toLowerCase()
                                    .includes(searchInput.toLowerCase())
                                ) {
                                  return fil_sub_item;
                                }
                              })
                              .map((sub_item, sub_index) => (
                                <div key={sub_index}>
                                  <Grid
                                    item
                                    className={
                                      highlighted_interests.includes(
                                        item + "|" + sub_item
                                      )
                                        ? `px-4 active`
                                        : `px-4 card`
                                    }
                                    style={{
                                      marginRight: "0.4rem",
                                      textAlign: "center",
                                      padding: "0.3rem",
                                      fontSize: "1rem",
                                      marginTop: "1rem",
                                    }}
                                    onClick={(e) => {
                                      if (
                                        e.target.classList.contains("active")
                                      ) {
                                        e.target.classList = ["px-4 card"];
                                        handleInterestChange(
                                          sub_item,
                                          item,
                                          "remove"
                                        );
                                      } else {
                                        e.target.classList = ["px-4 active"];
                                        handleInterestChange(
                                          sub_item,
                                          item,
                                          "add"
                                        );
                                      }
                                    }}
                                  >
                                    {sub_item}
                                  </Grid>
                                </div>
                              ))}
                          </Grid>
                        </Grid>
                      )}
                    </div>
                  ))}
                {loading && (
                  <div
                    style={{
                      width: "100%",
                      minHeight: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spinner />
                  </div>
                )}
                {error && (
                  <div
                    style={{
                      width: "100%",
                      minHeight: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h6>{error}</h6>
                  </div>
                )}
              </>
            </Grid>
          </div>
        </MyContentCard>
        <br />
        <div>
          <button
            // onClick={updateInterest}
            onClick={() => {
              gtmEventInterestPage();
              updateInterest();
            }}
            className="btn primary-btn-blk"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
export default InterestScreenComponent;
