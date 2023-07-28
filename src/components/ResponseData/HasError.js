import React from "react";
import { allWords } from "../../App";
import Spinner from "../Spinner";

export default function HasMore({ loading, has_error, rtData, hasMore }) {
  if (loading || has_error) {
    return <></>;
  }
  return hasMore ? (
    <>
      <Spinner />
    </>
  ) : (
    <>
      {localStorage.current_user && !localStorage.anonymous_user ? (
        <>
          {rtData?.length > 4 && (
            <div className="text-center container mt-5">
              <small style={{ color: "#63779c" }}>
                {allWords.rt.scrolledBottom}
              </small>
            </div>
          )}
        </>
      ) : (
        <>
          {!localStorage.current_user && localStorage.anonymous_user && (
            <>
              {rtData?.length > 6 && (
                <div className="text-center container mt-5">
                  <small style={{ color: "#63779c" }}>
                    {allWords.rt.scrolledBottom}
                  </small>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
