import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { allWords } from "../../App";
// Assets
import Doc from "../../assets/icons/document2.svg";
// Constants
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
// Components
import CategoryTag from "../CategoryTag";
import Participants from "../Participants";
// Utils
import ReadMoreReadLess from "../../utils/ReadMoreReadLess";
// Styles
import "./style.css";
import { moengageEvent } from "../../utils/utils";

export default function DescComp(props) {
  const { rt_details, current_user } = props;

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transferRights, setOwnerRights] = useState("moderator");

  useEffect(() => {
    moengageEvent("View Details", "RoundTable", {
      RoundTableID: rt_details?.["_id"],
      Name: rt_details?.["name"],
      "K Type": rt_details?.["r_type"],
      "K SubType": rt_details?.["open_to_all"],
      "Audience Interaction": 0,
    });
  }, []);

  return (
    <div className="desc-comp-style">
      {rt_details?.description?.length !== 0 && (
        <small
          style={{
            fontSize: "0.875rem",
            color: "var(--muted-dark-color)",
            // textTransform: "capitalize",
          }}
        >
          <ReadMoreReadLess
            children={rt_details?.description}
            txtColorM={"#ed4d29"}
            txtColor={"#11141c"}
          />
        </small>
      )}

      <div hidden>
        {(rt_details?.category?.length > 0 || rt_details?.tags?.length > 0) && (
          <CategoryTag
            label="card"
            current_user={current_user}
            parsed_data={rt_details}
            categories={categories}
            setCategories={setCategories}
            tags={tags}
            setTags={setTags}
          />
        )}
      </div>
      {rt_details?.["r_type"] !== "RECORDING_BASED" && (
        <div hidden={rt_details?.["doc_media"]?.length > 0 ? false : true}>
          <small className="rt-strong-labels" style={{ marginTop: "1.8rem" }}>
            {allWords.misc.review.Attach}
          </small>{" "}
          <br />
          <div className="desDoc d-flex py-3 px-4 mt-3">
            {rt_details?.["doc_media"]?.length > 0 ? (
              <>
                <IconButton
                  className="icon"
                  component="a"
                  href={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rt_details?.["owner"]?.["user_id"]}/roundtable/${rt_details?.["_id"]}/document/${rt_details?.["doc_media"]?.[0]?.["metadata"]?.["tempFilename"]}`}
                  download={`${rt_details?.["doc_media"]?.[0]?.["metadata"]?.["orignalFilename"]}`}
                  target="_blank"
                >
                  <img src={Doc} alt="" width={25} height={25} /> &emsp; &emsp;
                  <small className="fullellipsis">
                    {
                      rt_details?.["doc_media"]?.[0]?.["metadata"]?.[
                        "orignalFilename"
                      ]
                    }
                  </small>
                </IconButton>

                {rt_details?.["doc_media"]?.[0]?.["metadata"]?.[
                  "orignalFilename"
                ]?.length > 48 ? (
                  <small className="fullDocName">
                    {
                      rt_details?.["doc_media"]?.[0]?.["metadata"]?.[
                        "orignalFilename"
                      ]
                    }
                  </small>
                ) : null}
              </>
            ) : (
              <div className="container-fluid my-2 text-center">
                <small className="text-muted">
                  {allWords.misc.review.nodoc}
                </small>
              </div>
            )}
          </div>
        </div>
      )}
      <div>
        <Participants
          current_user={current_user}
          parsed_data={rt_details}
          transferRights={transferRights}
          setOwnerRights={setOwnerRights}
          dialog={true}
        />
      </div>
    </div>
  );
}
