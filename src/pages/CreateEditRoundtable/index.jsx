import React from "react";

// Component
import RadioButtonComponent from "../../components/CreateEditRoundtable/RadioButtonComponent";
import TextComponent from "../../components/CreateEditRoundtable/TextComponent";
import RtDurationComponent from "../../components/CreateEditRoundtable/RtDurationComponent";
import PreviewComponent from "../../components/CreateEditRoundtable/PreviewComponent";
import AdvanceOptionsComponent from "../../components/CreateEditRoundtable/AdvanceOptionsComponent";
import TypeOfRtComponent from "../../components/CreateEditRoundtable/TypeOfRtComponent";
import NatureofRtComponent from "../../components/CreateEditRoundtable/NatureofRtComponent";
import RoundtableTypeComponent from "../../components/CreateEditRoundtable/RoundtableTypeComponent";
import ModeratorPanelistParentBoxComponent from "../../components/CreateEditRoundtable/ModeratorPanelistParentComponent";
import AwesomePage from "../../components/CreateEditRoundtable/AwesomePage";
import InviteAudience from "../../components/CreateEditRoundtable/InviteAudience";
import InvitationSuccessComponent from "../../components/CreateEditRoundtable/InvitationSuccessComponent";
import BackdropComponent from "../../components/CreateEditRoundtable/BackdropComponent";
import KeepMeAnonymous from "../../components/CreateEditRoundtable/KeepMeAnonymous";
import ActionButtonParentComponent from "../../components/CreateEditRoundtable/ActionButtonParentComponent";
import TitleComponent from "../../components/CreateEditRoundtable/TitleComponent/index";

// Style
import "./styles.css";

const CreateEditRoundtable = ({ progress }) => {
  return (
    <>
      <div className="row w-100 m-0 p-0 ceMainDiv">
        {progress !== "invite-success" && (
          <>
            <div className="col-12 col-sm-12 col-md-8 create-edit-main">
              {progress == "creation" && (
                <div className="create-edit-parent">
                  <TitleComponent />
                  <RoundtableTypeComponent />
                  <RadioButtonComponent />
                  <NatureofRtComponent />
                  <TextComponent />
                  <RtDurationComponent />
                  <TypeOfRtComponent />
                  <ModeratorPanelistParentBoxComponent />
                  <KeepMeAnonymous />
                  <AdvanceOptionsComponent />
                  <ActionButtonParentComponent />
                </div>
              )}

              {progress == "success" && (
                <div className="create-edit-parent">
                  <AwesomePage />
                </div>
              )}

              {progress == "invite" && (
                <div className="create-edit-parent">
                  <InviteAudience />
                </div>
              )}
            </div>
            <div
              className="col-12 d-none d-md-block col-md-4 col-xl-4 preview-main-rt-div"
              hidden={progress == "invite-success" ? true : false}
            >
              <PreviewComponent />
            </div>
          </>
        )}

        {progress == "invite-success" && <InvitationSuccessComponent />}
      </div>

      <BackdropComponent />
    </>
  );
};

export default CreateEditRoundtable;
