import React, { useState } from "react";
import styled from "styled-components";

// Styles
import "react-placeholder/lib/reactPlaceholder.css";
import "../components/ProfileCenter/style.css";

// Constants
import {
  REACT_APP_BASE_URL_CLOUDFRONT,
} from "../constants/env";

import Spinner from "../components/Spinner";
import RTListingCard from "./RTListingCard";
import PreloginComp from "./PreLoginComp";

// Assets
// import SearchIcon from "../assets/icons/search_for_yapp.svg";
// import TownHallIconActive from "../assets/icons/home_icon_active.svg";

// Utils
import { globalImages } from "../assets/imagesPath/images";
import SearchRTListingCard from "./SearchRTListingCard";
import './SearchRTListingCard/style.css'

const MyContentCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 0.2rem;
  padding-top: 1rem;
  border-right: 1px solid #e4e9f0;
  overflow: hidden;
  .tab_container {
    padding: 1rem;
  }
  .firstTab {
    border-bottom: 1px solid #ed4d29;
  }
  .secondTab {
    border-bottom: 1px solid lightgray;
  }
  .thirdTab {
    border-bottom: 1px solid lightgray;
  }

  .css-1aquho2-MuiTabs-indicator {
    background-color: #ed4d29 !important;
  }
  .css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected {
    color: black;
    font-weight: bold;
  }
  .event_container {
    width: 100%;
    height: 92%;
    overflow: hidden;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 0.3em;
      display: none;
    }
  }
`;

const Container = styled.div``;

const RTSearchContent = ({
  search_loading,
  rtData,
}) => {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <MyContentCard>

      <div className="event_container">
          <Container>
            {search_loading ? (
              <Spinner />
            ) : (
              <>
                <div className="main-container">
                  {rtData &&
                    rtData?.data?.length > 0 &&
                    rtData?.data
                      ?.sort((a, b) => {
                        return b._id.localeCompare(a._id);
                      })
                      ?.map((item) => (
                        <div key={item?._id} style={{ marginTop: "1rem" }}>
                          <SearchRTListingCard
                            listingDisplay
                            displayValue={"space-between"}
                            style={{ border: "1px solid #E4E9F0" }}
                            rt_id={item?._id}
                            cardImg
                            cover_img={
                              item?.media?.length > 0 &&
                              `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                            }
                            mod_cover_img={
                              item?.media?.length > 0 &&
                              `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.moderator?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                            }
                            title={item?.name}
                            timestamp={item?.utc_time}
                            rt_type={item?.r_type}
                            rt_nature={item?.open_to_all}
                            moderator={item?.moderator}
                            speakers={item?.speakers}
                            reminder_status={
                              item.reminder_set || item.was_invited
                            }
                            upcoming={item?.upcoming_flag}
                            past={item?.happened_flag}
                            bodyRow
                            cardCenter
                            centerRow
                            cardHr
                            cardfooter
                            live={item.active_flag}
                            join_count={
                              item?.happened_flag === true
                                ? item?.["join_count"]
                                : 0
                            }
                            viewer_count={
                              item?.active_flag === true
                                ? item?.["viewer_count"]
                                : ""
                            }
                            invitees_count={
                              item?.upcoming_flag === true
                                ? item?.["invite_count"] -
                                  item?.["rejected_count"]
                                : ""
                            }
                            rt_details={item}
                            req_visitor_count={item?.req_visitor_count}
                            req_visitor={item.req_visitor_count}
                            request_status={
                              item?.invite_requested || item?.was_invited
                            }
                            was_invited={item?.was_invited}
                            request_access={
                              !item.owner_flag ||
                              !item.moderator_flag ||
                              !item.speaker_flag
                            }
                            invitation_code={item?.roundtable_code}
                            owner_details={item?.owner}
                            is_cancelled={item?.is_cancelled}
                            rec_owner_flag={
                              item?.recording?.[0]?.owner_flag === 1
                                ? true
                                : false
                            }
                            rec_start_flag={
                              item?.recording?.[0]?.start_recording === 1
                                ? true
                                : false
                            }
                            rec_end_flag={
                              item?.recording?.[0]?.soft_end_recording === 0
                                ? true
                                : false
                            }
                            media_recording={
                              item?.media_recording?.length > 0
                                ? item?.media_recording
                                : null
                            }
                            description={item?.description}
                            category={item?.category}
                            other_count={item?.other_count}
                            user_views_count={item?.user_views_count}
                            ext={
                              item?.media_recording?.length > 0
                                ? item?.media_recording?.[0]?.["metadata"]?.[
                                    "ext"
                                  ]
                                : null
                            }
                          />
                        </div>
                      ))}
                </div>
                {(rtData?.data?.length === 0 || rtData?.length === 0) && (
                  <>
                    <div className="my-5 container text-center">
                      <div className="my-5 container-fluid text-center">
                        <img
                          src={globalImages.si_search_rt}
                          alt=""
                          style={{ width: "30%" }}
                          className="mt-5"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </Container>
      </div>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <img src={globalImages.si_th_menu_a} alt="" width={40} height={40} />
        }
        title={"For searching, Login or sign up to Khul Ke"}
        description={""}
      />
    </MyContentCard>
  );
};

export default RTSearchContent;
