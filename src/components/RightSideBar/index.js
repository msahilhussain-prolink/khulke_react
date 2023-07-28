import React, { useEffect, useState } from "react";

// ** Components
import SearchInput from "../common/SearchInput";

import { RightSideContainer, SearchItem, Wrapper } from "./style";
import recentIcon from "../../assets/icons/Group 1053.svg";
import ContentCard from "../../components/ContentCard";
import { moengageEvent } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { ClickAwayListener } from "@mui/material";
import PopularShows from "../PopularShows";

const RightSideBar = ({ showRoundtabaleContent }) => {
  const [recent_searches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("khulke_recents")) {
      let temp_search = JSON.parse(localStorage.getItem("khulke_recents"));
      setRecentSearches(temp_search.reverse());
    }
  }, []);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!localStorage.getItem("khulke_recents")) {
        localStorage.setItem(
          "khulke_recents",
          JSON.stringify([e.target.value])
        );
      } else {
        let recents = JSON.parse(localStorage.getItem("khulke_recents"));
        recents.push(e.target.value);
        localStorage.setItem("khulke_recents", JSON.stringify(recents));
      }

      let comp = "";
      if (window.location.pathname.includes("profile")) {
        comp = "User";
      } else if (window.location.pathname.includes("roundtable")) {
        comp = "RoundTable";
      } else {
        comp = "Post";
      }

      moengageEvent("Search", comp, { "Search Text": e.target.value });

      navigate(`/search?search_term=${e.target.value.trim()}`);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <RightSideContainer>
      <ClickAwayListener
        onClickAway={() => {
          setIsOpen(false);
        }}
      >
        <div className="custom_pos">
          <SearchInput
            className="barSearch"
            onKeyDown={(e) => {
              handleSearch(e);
            }}
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <>
              {recent_searches.length > 0 && (
                <Wrapper>
                  <h4>Recent Search</h4>
                  {recent_searches.map((item) => {
                    return (
                      <SearchItem
                        key={item}
                        onClick={() => {
                          navigate(`/search?search_term=${item}`);
                        }}
                      >
                        <img src={recentIcon} alt="" />
                        <span
                          style={{ visibility: "hidden", userSelect: "none" }}
                        >
                          a
                        </span>
                        <small style={{ fontSize: "18px" }}>{item}</small>
                      </SearchItem>
                    );
                  })}
                </Wrapper>
              )}
            </>
          )}
        </div>
      </ClickAwayListener>
      {localStorage.current_user && !localStorage.anonymous_user && (
        <>{showRoundtabaleContent ? <ContentCard /> : null}</>
      )}
      {!window.location.pathname.includes("notifications") &&
        !window.location.pathname.includes("profile") &&
        !window.location.pathname.includes("personal_details") && (
          <PopularShows />
        )}
    </RightSideContainer>
  );
};

export default RightSideBar;
