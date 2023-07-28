import React from "react";

const UnauthorizedLayout = ({
  illustration,
  left_heading,
  left_subheading,
  left_subheading2,
  rightcomponent,
}) => {
  return (
    <section id="friend_suggestions" className="container mt-5">
      <div className="row" style={{ margin: "0 auto" }}>
        <div className="col-sm-12 col-md-6 col-lg-6 text-center order-second order-md-first order-sm-1">
          <br />
          <img src={illustration} alt="KhulKe" className="mt-5 img-fluid" />
          <h1 className="primary-heading">{left_heading}</h1>
          <h1 className="primary-heading">{left_subheading}</h1>
          <h1 className="primary-heading">{left_subheading2}</h1>
        </div>
        {rightcomponent}
      </div>
    </section>
  );
};

export default UnauthorizedLayout;
