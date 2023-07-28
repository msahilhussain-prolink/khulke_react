import React, { useState, useEffect } from "react";
import { Waypoint } from "react-waypoint";
import {
  format,
  subDays,
  addWeeks,
  subWeeks,
  addDays,
  isSameDay,
  isBefore,
} from "date-fns";

var index = React(function ReactHorizontalDatePicker(_ref) {
  var enableDays = _ref.enableDays,
    enableDaysBefore = _ref.enableDaysBefore,
    enableScroll = _ref.enableScroll,
    selectedDay = _ref.selectedDay;

  var _useState = useState(new Date()),
    selectedDate = _useState[0],
    setSelectedDate = _useState[1];

  var _useState2 = useState(new Date()),
    headingDate = _useState2[0],
    setHeadingDate = _useState2[1];

  var _useState3 = useState(new Date()),
    currentWeek = _useState3[0],
    setCurrentWeek = _useState3[1];

  var _useState4 = useState(new Date()),
    currentDate = _useState4[0];

  var scrollWidth = 250;
  enableScroll = enableScroll || false;
  enableDays = enableScroll === true ? enableDays || 90 : 7;
  enableDaysBefore = enableScroll === true ? enableDaysBefore || 0 : 0;
  useEffect(function () {}, [headingDate]);

  var applyStyles = function applyStyles(day) {
    var classes = [];

    if (isSameDay(day, selectedDate)) {
      classes.push(" date-day-Item-selected");
    }

    if (isBefore(day, currentDate)) {
      classes.push(" date-day-item-disabled");
    }

    return classes.join(" ");
  };

  var _handlePosition = function _handlePosition(pos, date) {
    var currentPosition = pos.currentPosition;
    var previousPosition = pos.previousPosition;

    if (previousPosition == "inside" && currentPosition == "above") {
      setHeadingDate(date);
    }

    if (previousPosition == "above" && currentPosition == "inside") {
      setHeadingDate(addDays(date, -1));
    }
  };

  var _verticalList = function _verticalList() {
    var _dayFormat = "E";
    var _dateFormat = "dd";
    var _monthFormat = "MMM";
    var _verticalListItems = [];

    var _startDay = subDays(currentWeek, 1);

    var _loop = function _loop(i) {
      var _day = format(addDays(_startDay, i), _dayFormat);

      var _date = format(addDays(_startDay, i), _dateFormat);

      var _month = format(addDays(_startDay, i), _monthFormat);

      _verticalListItems.push(
        /*#__PURE__*/ React.createElement(
          Waypoint,
          {
            key: i,
            horizontal: true,
            onPositionChange: function onPositionChange(pos) {
              return _date == 1
                ? _handlePosition(pos, addDays(_startDay, i))
                : "";
            },
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "wrapper",
            },
            format(addDays(_startDay, i), _dateFormat) == 1
              ? /*#__PURE__*/ React.createElement(
                  "div",
                  {
                    className: "scroll-head",
                  },
                  format(addDays(_startDay, i), "MMM")
                )
              : /*#__PURE__*/ React.createElement("div", {
                  className: "blank-space-div",
                }),
            /*#__PURE__*/ React.createElement(
              "div",
              {
                className:
                  "datepicker-date-day-Item wrapper " +
                  applyStyles(addDays(_startDay, i)),
                onClick: function onClick() {
                  return onDateClick(addDays(_startDay, i));
                },
              },
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "datepicker-day-label ",
                },
                _day
              ),
              /*#__PURE__*/ React.createElement(
                "div",
                {
                  className: "datepicker-date-label ripple ",
                },
                _date
              )
            )
          )
        )
      );
    };

    for (var i = -Math.abs(enableDaysBefore); i < enableDays; i++) {
      _loop(i);
    }

    return /*#__PURE__*/ React.createElement(
      "div",
      {
        id: "container",
        className:
          enableScroll === true
            ? " datepicker-datelist-scrollable"
            : " datepicker-dateList",
      },
      _verticalListItems
    );
  };

  var onDateClick = function onDateClick(day) {
    setSelectedDate(day);
    selectedDay(selectedDate);
  };

  var nextScroll = function nextScroll() {
    enableScroll
      ? (document.getElementById("container").scrollLeft += scrollWidth)
      : setCurrentWeek(addWeeks(currentWeek, 1));
  };

  var prevScroll = function prevScroll() {
    enableScroll
      ? (document.getElementById("container").scrollLeft -= scrollWidth)
      : setCurrentWeek(subWeeks(currentWeek, 1));
  };

  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "datepicker-strip",
    },
    /*#__PURE__*/ React.createElement(
      "span",
      {
        className: "datepicker-month-label ",
      },
      format(selectedDate, "dd MMM yyy")
    ),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "datepicker",
      },
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "wrapper",
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "scroll-head",
          },
          format(headingDate, "MMM")
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "button-previous",
          },
          " ",
          /*#__PURE__*/ React.createElement(
            "button",
            {
              className: "datepicker-button-previous",
              onClick: prevScroll,
            },
            "\u2794"
          )
        )
      ),
      _verticalList(),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "wrapper",
        },
        /*#__PURE__*/ React.createElement("div", {
          className: "blank-space-div",
        }),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "button-previous",
          },
          " ",
          /*#__PURE__*/ React.createElement(
            "button",
            {
              className: "datepicker-button-next",
              onClick: nextScroll,
            },
            "\u2794"
          )
        )
      )
    )
  );
});

export default index;
//# sourceMappingURL=index.modern.js.map
