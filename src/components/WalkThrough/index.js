import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShepherdTour } from "react-shepherd";

// Redux
import { walkthroughData } from "../../redux/actions/walkthroughAction";

// Component
import ConfirmationDialog from "../ConfirmationDialog";

// Assets
import Walkthrough from "../../assets/icons/walkthrough.svg";

// Styles
import "../../global_styles/shepherdTour.css";
import {
  drawerFlag,
  tabSwitchFlag,
  toggleFlag,
  toggleSignUpFlag,
} from "../../redux/actions/compActions";
import { userProfileData } from "../../redux/actions/profileAction/userProfileAction";
import { MOBILE_VIEW } from "../../constants/env";
import { allWords } from "../../App";

export const tourOptions = {
  defaultStepOptions: {
    // cancelIcon: {
    //   enabled: true,
    // },
  },
  useModalOverlay: true,
};

export default function WalkThrough(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.drawerSwitchRed.drawFlag);

  const [tourDialog, setTourDialog] = useState(false);
  const [tourId, setTourId] = useState(0);
  return (
    <>
      <ShepherdTour
        steps={[
          {
            id: "khulkeLogoHome",
            attachTo: { element: ".khulkeLogoHome", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.deactiveModal.yes,
                type: "next",
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(1);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".khulkeLogoHome",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 50,
            text: [
              `
      <img src=${Walkthrough} class="khulkeArrow">
    <span>${allWords.walkthrough.step_1_1}</span> <br> <span>${allWords.walkthrough.step_1_2}</span>
    `,
            ],
            arrow: false,
          },
          {
            id: "townhallStep",
            attachTo: { element: ".townhallStep", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                action: function () {
                  if (MOBILE_VIEW) {
                    dispatch(drawerFlag(false));
                  }
                  const homeCenter = document.getElementById("home_center");
                  const footer =
                    homeCenter.getElementsByClassName("footerStep");
                  footer[0]?.scrollIntoView(false);
                  this.next();
                },
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(2);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".townhallStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
                <img src=${Walkthrough} class="townArrow">
                ${allWords.walkthrough.step_2}
              `,
            ],
            arrow: false,
          },
          {
            id: "footerStep",
            attachTo: { element: ".footerStep", on: "top" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                type: "next",
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(3);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".footerStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
      <img src=${Walkthrough} class="footerArrow">
      <span>${allWords.walkthrough.step_3} </span>
    `,
            ],
            arrow: false,
          },
          {
            id: "snippetStep",
            attachTo: { element: ".snippetStep", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                // type: "next",
                action: function () {
                  if (MOBILE_VIEW) {
                    dispatch(drawerFlag(true));
                  }

                  dispatch(tabSwitchFlag("timeline"));
                  this.next();
                  return;
                },
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(4);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".snippetStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
      <img src=${Walkthrough} class="snippetArrow">
      <span> ${allWords.walkthrough.step_4} </span>
    `,
            ],
            arrow: false,
          },
          {
            id: "newPostStep",
            attachTo: { element: ".newPostStep", on: "top" },
            buttons: [
              {
                classes: "tourNextBtn cpostTourNextBtn",
                text: allWords.misc.next,
                action: function () {
                  if (MOBILE_VIEW) {
                    dispatch(drawerFlag(false));
                  }
                  const homeCenter = document.getElementById("home_center");
                  const cpArea =
                    homeCenter.getElementsByClassName("createPostStep");

                  cpArea[0]?.scrollIntoView(false);
                  this.next();
                },
              },
              {
                classes: "tourSkipBtn cpostTourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(5);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".newPostStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
      <span>${allWords.walkthrough.step_5}</span>
      <br>
      <br> <span></span>
      <img src=${Walkthrough} class="newPostArrow">
    `,
            ],
            hide: true,
            arrow: false,
          },
          {
            id: "createPostStep",
            attachTo: { element: ".createPostStep", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                // type: "next",
                action: function () {
                  if (MOBILE_VIEW) {
                    dispatch(drawerFlag(true));
                  }
                  this.next();
                },
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(6);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".createPostStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
      <img src=${Walkthrough} class="createPArrow">
      <br><br>
      <span style="width: max-content"> ${allWords.walkthrough.step_6}  </span>
    `,
            ],
            arrow: false,
          },
          {
            id: "roundtableStep",
            attachTo: { element: ".roundtableStep", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                action: function () {
                  window.location.href = "/roundtable/all?shtc=t";
                },
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(7);
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".roundtableStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
      <img src=${Walkthrough} class="roundtableArrow">
      <br> <br>
      <span style="width: max-content;"> ${allWords.walkthrough.step_7}</span>
      `,
            ],
            arrow: false,
          },
          {
            id: "rtTabStep",
            attachTo: { element: ".rtTabStep", on: "top" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                type: "next",
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(8);
                  if (window.location.pathname.includes("all") === true) {
                    navigate("/roundtable/all");
                  }

                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".rtTabStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
                <img src=${Walkthrough} class="rtTabArrow">
                <br> <br> 
                <span style="width: max-content;"> ${allWords.walkthrough.step_8}</span>
              `,
            ],
            arrow: false,
          },
          {
            id: "newStep",
            attachTo: { element: ".newStep", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                type: "next",
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(9);
                  if (window.location.pathname.includes("all") === true) {
                    navigate("/roundtable/all");
                  }

                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".newStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
      <img src=${Walkthrough} class="newArrow">
      <br> <br> <br>
      <span style="width: max-content;"> ${allWords.walkthrough.step_9}</span>
      `,
            ],
            arrow: false,
          },
          // Enable once Yapp is integrated
          {
            id: "yappStep",
            attachTo: { element: ".yappStep", on: "right" },
            buttons: [
              {
                classes: "tourNextBtn",
                text: allWords.misc.next,
                action: function () {
                  const leftDiv = document.getElementById("leftSide_div");
                  const userArea = leftDiv.getElementsByClassName("yappStep");
                  userArea[0]?.scrollIntoView(true);
                  this.next();
                },
              },
              {
                classes: "tourSkipBtn",
                text: allWords.misc.skip,
                action: function () {
                  setTourDialog(true);
                  setTourId(10);
                  if (window.location.pathname.includes("all") === true) {
                    navigate("/roundtable/all");
                  }

                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".yappStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
          <img src=${Walkthrough} class="yappArrow">
          <br> <br> <br>
          <span style="width: max-content;"> ${allWords.walkthrough.step_10} </span>
          `,
            ],
            arrow: false,
          },
          {
            id: "userCardStep",
            attachTo: { element: ".userCardStep", on: "bottom" },
            buttons: [
              {
                classes: "tourSkipBtn ucTourBtn",
                text: allWords.misc.close,
                action: function () {
                  // setTourDialog(true);
                  // setTourId(10);
                  if (window.location.pathname.includes("all") === true) {
                    navigate("/roundtable/all");
                  }
                  dispatch(
                    walkthroughData({
                      walkthrough_step: 11,
                      is_interested: false,
                    })
                  );
                  dispatch(toggleFlag(false));
                  dispatch(toggleSignUpFlag(false));
                  this.cancel();
                  return;
                },
              },
            ],
            classes: ".userCardStep",
            highlightClass: "highlight",
            scrollTo: false,
            modalOverlayOpeningRadius: 20,
            canClickTarget: false,
            text: [
              `
          <span style="width: max-content;"> ${allWords.walkthrough.step_11} </span>
          <br> <br>
          <img src=${Walkthrough} class="ucArrow">
          `,
            ],
            arrow: false,
          },
        ]}
        tourOptions={tourOptions}
      >
        {props.children}
      </ShepherdTour>

      <ConfirmationDialog
        open={tourDialog}
        setOpen={setTourDialog}
        msg={allWords.walkthrough.walkthrough_dailog_question}
        custom_yes={() => {
          setTourDialog(false);
          if (window.location.pathname.includes("all") === true) {
            navigate("/roundtable/all");
          }
          dispatch(
            walkthroughData({
              walkthrough_step: tourId,
              is_interested: true,
            })
          );
          dispatch(toggleFlag(true));
          dispatch(
            userProfileData({
              username: JSON.parse(localStorage?.current_user)?.["username"],
            })
          );
        }}
        custom_no={() => {
          setTourDialog(false);
          if (window.location.pathname.includes("all") === true) {
            navigate("/roundtable/all");
          }
          dispatch(
            walkthroughData({
              walkthrough_step: 0,
              is_interested: false,
            })
          );
          dispatch(toggleFlag(false));
          dispatch(
            userProfileData({
              username: JSON.parse(localStorage?.current_user)?.["username"],
            })
          );
        }}
      />
    </>
  );
}
