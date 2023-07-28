import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// Assets
import Pencil from "../../assets/icons/pencil.svg";
import { CategoryTagStyle } from "../../global_styles/components/CategoryTag";
import { Status } from "../../utils/Constant/moderator";

// Styles
import "./style.css";
import UpcomingModerator from "./components/UpcomingModerato";
import CatNTagHiden from "./components/CatNTagHiden";
import { allWords } from "../../App";

export default function CategoryTag(props) {
  const {
    current_user,
    parsed_data,
    sendData,
    status,
    progress_name,
    ownerName,
    categories,
    setCategories,
    tags,
    setTags,
    wip_rt_id,
    label,
  } = props;

  // useState
  const [host, setHost] = useState("");
  const [categoryHide, setCategoryHide] = useState(false);
  const [tagHide, setTagHide] = useState(false);

  // useRef
  const catInput = useRef();
  const tagInput = useRef();
  // useEffect
  useEffect(() => {
    if (parsed_data) {
      setHost(
        sendData?.["host"] !== undefined
          ? sendData?.["host"]
          : parsed_data?.moderator?.username
      );

      setCategories(
        sendData?.["category"] !== undefined
          ? sendData?.["category"]
          : parsed_data?.category
      );
      setTags(
        sendData?.["tags"] !== undefined
          ? sendData?.["tags"]
          : parsed_data?.tags
      );
    }
  }, [parsed_data, sendData]);

  return (
    <>
      {(parsed_data?.moderator?.m_type === Status.UPCOMING &&
        host === current_user?.["username"]) ||
      parsed_data?.["owner"]?.["user_id"] === current_user?.["_id"] ||
      wip_rt_id ? (
        <div className="row" style={CategoryTagStyle.container}>
          {/* Categories */}
          <div
            className="col-sm-12 col-lg-6 col-md-6 categoryTagBg"
            style={{ width: "45%" }}
          >
            <UpcomingModerator
              categoryOrTag={categoryHide}
              setCategoryOrTag={setCategoryHide}
              Pencil={Pencil}
              current_user={current_user}
              ownerName={ownerName}
              parsed_data={parsed_data}
              progress_name={progress_name}
              status={status}
              title={allWords.misc.review.categories}
              wip_rt_id={wip_rt_id}
            />
            <div className="d-flex" style={{ flexWrap: "wrap" }}>
              {categoryHide === true ? (
                <CatNTagHiden
                  catNTagHide={categoryHide}
                  setCatNTagHide={setCategoryHide}
                  catNTagInput={catInput}
                  catNTags={categories}
                  customMaxLength={30}
                  setCatNTags={setCategories}
                />
              ) : (
                <>
                  {categories?.length > 0 &&
                    categories?.map((item) => {
                      return (
                        <div className="tooltips" key={item}>
                          <div
                            className="tag-div catTag"
                            style={{
                              width:
                                item?.length > 22 ? "12rem" : "fit-content",
                            }}
                          >
                            <small className="text-muted">{item}</small>
                          </div>
                          {item?.length > 22 ? (
                            <span className="tooltiptext">{item}</span>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  {categories?.length === 0 && (
                    <div className="container py-3 text-center">
                      <small className="text-muted">
                        {allWords.misc.nocategoryinc}
                      </small>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div
            className="col-sm-12 col-lg-6 col-md-6 categoryTagBg"
            style={{
              // marginLeft: MOBILE_VIEW ? 0 : "1.1rem",
              width: "45%",
            }}
          >
            <UpcomingModerator
              categoryOrTag={tagHide}
              setCategoryOrTag={setTagHide}
              Pencil={Pencil}
              current_user={current_user}
              ownerName={ownerName}
              parsed_data={parsed_data}
              progress_name={progress_name}
              status={status}
              title={allWords.misc.pg3.tags}
              wip_rt_id={wip_rt_id}
            />
            <div className="d-flex" style={{ flexWrap: "wrap" }}>
              {tagHide === true ? (
                <CatNTagHiden
                  catNTagHide={tagHide}
                  setCatNTagHide={setTagHide}
                  catNTagInput={tagInput}
                  catNTags={tags}
                  customMaxLength={45}
                  setCatNTags={setTags}
                />
              ) : (
                <>
                  {tags?.length > 0 &&
                    tags?.map((item) => {
                      return (
                        <div className="tag-div catTag" key={item}>
                          <small className="text-muted">{item}</small>
                        </div>
                      );
                    })}
                  {tags?.length === 0 && (
                    <div className="container py-3 text-center">
                      <small className="text-muted">
                        {allWords.misc.notagsinc}
                      </small>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="col-sm-12 col-lg-12 col-md-12 categoryTagBg"
            style={{
              padding: label == "card" ? "2px 20px 20px 20px" : "0 20px 20px 20px",
              marginTop: "1.5rem",
            }}
            hidden={categories?.length === 0 ? true : false}
          >
            <h6 className="mt-4 rt-strong-labels">
              {allWords.misc.pg3.category}
            </h6>
            <div className="d-flex" style={{ flexWrap: "wrap" }}>
              {categories?.length > 0 &&
                categories?.map((item) => {
                  return (
                    <div
                      key={item}
                      className="tag-div"
                      style={{
                        width: "fit-content",
                        marginRight: "1rem",
                      }}
                    >
                      <small className="text-muted">{item}</small>
                    </div>
                  );
                })}
              {categories?.length === 0 && (
                <div className="container py-3 text-center">
                  <small className="text-muted">
                    {allWords.misc.nocategoryinc}
                  </small>
                </div>
              )}
            </div>
          </div>

          <div
            className="col-sm-12 col-lg-12 col-md-12 categoryTagBg"
            style={{
              padding: label == "card" ? "2px 20px 20px 20px" : "0 20px 20px 20px",
              marginTop: "1.5rem",
            }}
            hidden={tags?.length === 0 ? true : false}
          >
            <h6 className="mt-4 rt-strong-labels">{allWords.misc.pg3.tags}</h6>
            <div className="d-flex" style={{ flexWrap: "wrap" }}>
              {tags?.length > 0 &&
                tags?.map((item) => {
                  return (
                    <div
                      key={item}
                      className="tag-div"
                      style={{
                        width: "fit-content",
                        marginRight: "1rem",
                      }}
                    >
                      <small className="text-muted">{item}</small>
                    </div>
                  );
                })}
              {tags?.length === 0 && (
                <div className="container py-3 text-center">
                  <small className="text-muted">
                    {allWords.misc.notagsinc}
                  </small>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
