import React from "react";
import { useSelector } from "react-redux";
import ActionButtonComponent from "../ActionButtonComponent";

export default function ActionButtonParentComponent() {
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);

  return (
    <div className="mt-4">
      {(rtType === "recorded" || !urlRtId) && (
        <ActionButtonComponent type="create" />
      )}
    </div>
  );
}
