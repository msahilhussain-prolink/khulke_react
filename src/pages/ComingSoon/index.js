import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { globalImages } from "../../assets/imagesPath/images";
// import KhulKeLogo from "../../assets/icons/KhulKe_logo.svg";
import Permission from "../../components/Permission";
const ComingSoon = () => {
  useEffect(Permission, []);
  return (
    <section>
      <div className="container-fluid text-center" style={{ marginTop: "10%" }}>
        <img
          src={globalImages.logo}
          alt="Coming Soon!"
          className="py-5"
          style={{ height: "300px", width: "300px", userSelect: "none" }}
        />
        <h1 className="primary-heading" style={{ fontSize: "4rem" }}>
          Coming Soon!
        </h1>
        <p className="mt-5">
          Back to <Link to="/home">Home</Link>
        </p>
      </div>
    </section>
  );
};

export default ComingSoon;
