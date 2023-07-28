import React from "react";
import "./style.css";

const ConditionBlock = ({ heading, matter, q, a }) => {
  function createMarkup(data) {
    return { __html: data };
  }
  return (
    <div className="container col-lg-10 col-sm-12 col-md-10 my-4 px-2">
      <h6
        dangerouslySetInnerHTML={createMarkup(heading)}
        className="primary-heading block-heading"
      />
      <article dangerouslySetInnerHTML={createMarkup(matter)} />
      <p dangerouslySetInnerHTML={createMarkup(q)} className="block-heading" />
      <p dangerouslySetInnerHTML={createMarkup(a)} className="text-muted" />
    </div>
  );
};

export default ConditionBlock;
