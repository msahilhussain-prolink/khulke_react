import React from "react";
import { Link } from "react-router-dom";
import left_arrow from "../../assets/icons/arrow_left.svg";
import ConditionBlock from "../../components/ConditionBlock";
import {
  tnc_data,
  privacy_data,
  support_data,
  faq_data,
  take_down_data,
  community_data,
  disclaimer_data,
  parental_data,
} from "../../data";
const PolicyComponent = ({ policy_for, origin, mobile = false }) => {
  let data;
  if (policy_for === "Terms & Conditions") {
    data = tnc_data;
  } else if (policy_for === "Support") {
    data = support_data;
  } else if (policy_for === "FAQ") {
    data = faq_data;
  } else if (policy_for === "Take Down Policy") {
    data = take_down_data;
  } else if (policy_for === "Community Guidelines") {
    data = community_data;
  } else if (policy_for === "Disclaimers") {
    data = disclaimer_data;
  } else if (policy_for === "Parental Consent") {
    data = parental_data;
  } else if (policy_for === "Privacy Policy") {
    data = privacy_data;
  }
  return (
    <section>
      <div className="container-fluid px-2 ">
        <div className="container my-4 px-2 d-flex justify-content-start">
          {mobile || !origin ? (
            ""
          ) : (
            <>
              <Link style={{ textDecoration: "none" }} to={origin}>
                <img src={left_arrow} height={40} width={40} alt="" />
              </Link>
              &emsp;
            </>
          )}
          <strong>
            <h2 style={{ textTransform: "capitalize" }}>{policy_for}</h2>
          </strong>
        </div>
      </div>
      <div className="container-fluid px-2">
        {data?.map((item, index) => (
          <ConditionBlock
            key={index}
            heading={item.heading}
            matter={item.matter}
            q={item.q}
            a={item.a}
          />
        ))}
      </div>
    </section>
  );
};

export default PolicyComponent;
