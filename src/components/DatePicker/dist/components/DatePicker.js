/* eslint-disable react-hooks/exhaustive-deps */
import { addDays } from "date-fns";
import React from "react";
import hexToRgb from "../global/helpers/hexToRgb";
import styles from "./DatePicker.module.css";
import { DateView } from "./DateView";
import { MonthView } from "./MonthView";
function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

const DatePicker = (props) => {
  const next = (event) => {
    event.preventDefault();
    const e = document.getElementById("container");
    const width = e ? e.getBoundingClientRect().width : null;
    e.scrollLeft += width - 60;
  };

  const prev = (event) => {
    event.preventDefault();
    const e = document.getElementById("container");
    const width = e ? e.getBoundingClientRect().width : null;
    e.scrollLeft -= width - 60;
  };

  const primaryColor = props.color
    ? props.color.indexOf("rgb") > 0
      ? props.color
      : hexToRgb(props.color)
    : "rgb(54, 105, 238)";
  const startDate = props.startDate || new Date();
  const lastDate = addDays(startDate, props.days || 365);
  let buttonzIndex = {
    zIndex: 2,
  };
  let buttonPrevStyle = {
    background: "white",
    position: "relative",
    left: "26.5rem",
    top: "-2.1rem",
  };
  let buttonNextStyle = {
    background: "white",
    position: "relative",
    left: "31rem",
    top: "-8.3rem",
  };
  let buttonPrev = {
    background: "white",
    position: "relative",
    top: "13px",
    left: "8px",
  };
  let buttonNext = {
    background: "white",
    position: "relative",
    left: "32.1rem",
    bottom: "42px",
  };

  let Component = DateView;

  if (props.type === "month") {
    buttonzIndex = {
      zIndex: 5,
    };
    Component = MonthView;
    buttonPrevStyle = {
      background: primaryColor,
      marginBottom: "5px",
    };
    buttonNextStyle = {
      background: primaryColor,
      marginBottom: "5px",
    };
  }

  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: styles.container,
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: styles.buttonWrapper,
        style: buttonzIndex,
      },
      /*#__PURE__*/ React.createElement(
        "button",
        {
          className: styles.button,
          style: buttonPrevStyle,
          onClick: prev,
        },
        // "⬅"
        "<"
      )
    ),
    /*#__PURE__*/ React.createElement(
      Component,
      _extends({}, props, {
        primaryColor: primaryColor,
        startDate: startDate,
        lastDate: lastDate,
      })
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: styles.buttonWrapper,
        style: buttonzIndex,
      },
      /*#__PURE__*/ React.createElement(
        "button",
        {
          className: styles.button,
          style: buttonNextStyle,
          onClick: next,
        },
        // "➡"
        ">"
      )
    )
  );
};

export default DatePicker;
