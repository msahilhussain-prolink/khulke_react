import React, { useState, useEffect } from "react";
import PolicyComponent from "./policy_component";
import logger from "../../logger";
const Policies = () => {
  const [policy_view, setPolicyView] = useState("");
  const [origin_view, setOriginView] = useState("");
  const [mobile_view_show, setMobileViewShow] = useState(false);
  useEffect(() => {
    const current_url = new URL(window.location.href);
    let policy = current_url.searchParams.get("policy");
    let origin = current_url.searchParams.get("origin");
    logger.info("current_url", policy, origin);
    if (policy === "TnC") {
      setOriginView("account_settings");
      setPolicyView("Terms & Conditions");
    } else if (policy === "Privacy") {
      setPolicyView("Privacy Policy");
    } else if (policy === "Support") {
      setPolicyView("Support");
    } else if (policy === "FAQ") {
      setPolicyView("FAQ");
    } else if (policy === "TakeDown") {
      setPolicyView("Take Down Policy");
    } else if (policy === "CommunityGuidelines") {
      setPolicyView("Community Guidelines");
    } else if (policy === "Disclaimer") {
      setPolicyView("Disclaimers");
    } else if (policy === "ParentalConsent") {
      setPolicyView("Parental Consent");
    }

    setOriginView(origin);
    setMobileViewShow(current_url.searchParams.get("mobile"));
  }, []);

  return (
    <section id="Policy_Section" className="my-5 pb-2">
      <PolicyComponent
        policy_for={policy_view}
        origin={origin_view}
        mobile={mobile_view_show}
      />
    </section>
  );
};

export default Policies;
