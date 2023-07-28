import { useEffect } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();

  const { search } = useLocation();

  const query = new URLSearchParams(search);

  useEffect(() => {
    if (!window.opener) {
      navigate("/");

      return;
    }

    window.opener.postMessage(
      {
        type: query.get("state"),

        data: query.get("code"),

        error: query.get("error"),
      },

      window.origin
    );

    window.close();
  }, []);

  return <></>;
}
