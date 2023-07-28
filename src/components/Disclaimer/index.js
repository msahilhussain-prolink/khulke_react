import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { allWords } from "../../App"
const Disclaimer = ({ origin_url }) => {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    let temp_url = origin_url.split("/");
    setOrigin(temp_url[temp_url.length - 1]);
  }, []);
  return (
    <div className="my-2 text-center">
      <small className="text-muted">
        {allWords.misc.bycont}{" "}
        <Link
          target="_blank"
          to={`/policies?origin=${origin}&policy=TnC&mobile=true`}
        >
          {allWords.misc.termsof}
        </Link>{" "}
        &{" "}
        <Link
          target="_blank"
          to={`/policies?origin=${origin}&policy=Privacy&mobile=true`}
        >
          {allWords.misc.privacy}
        </Link>
        .
      </small>
    </div>
  );
};

export default Disclaimer;
