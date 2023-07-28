import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import Moment from "react-moment";
import { allWords } from "../../App";

// Material UI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Stack from "@mui/material/Stack";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";

// Assets
import check_green from "../../assets/icons/check_green.svg";
import filterImg from "../../assets/images/filter.png";
import search_icon from "../../assets/icons/search.svg";
import timeimg from "../../assets/icons/schedule.svg";
import back_button from "../../assets/icons/back.svg";
import CheckWhite from "../../assets/icons/check_white.svg";

// Components
import FormInput from "../../components/FormInput";
import Spinner from "../Spinner";

// Style
import { SearchContainer, CustomSearchInput } from "./style.js";

import { CancelOutlined } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { createEditRoundtableInitialize } from "../../redux/actions/createEditRoundtable";
export const popperSx = {
  "& .MuiButtonBase-root": {
    fontWeight: "bold",
    fontSize: "14px",
    width: "40px",
  },
  "& .MuiButtonBase-root.Mui-disabled": {
    border: "transparent",
  },
  "& .MuiPaper-root": {
    borderRadius: "10px",
    marginLeft: "100px",
    marginTop: "10px",
  },
  "& .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd, .MuiIconButton-sizeSmall.MuiIconButton-edgeStart":
    {
      border: "1px solid #e4e9f0",
    },
  "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
    color: "#fff",
    backgroundColor: "#66b984",
    fontWeight: "bold",
    border: "1px solid var(--muted-gray-color)",
    borderRadius: "10px",
  },
};

export default function PastAttendees(props) {
  const { loading, error_msg, pastCheck, temp_check, setTempCheck } = props;

  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const arrayId = useSelector((state) => state.createEditRoundtable.arrayId);

  // useState
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [arrayCount, setArraycount] = useState(0);
  const [filter_section, setFilterSection] = useState(false);
  const [from_value, setFromValue] = useState(null);
  const [to_value, setToValue] = useState(null);
  const [temp_check_filter, setTempCheckFilter] = useState([]);
  const [isCheckCount, setIsCheckCount] = useState([]);
  const [date_msg, setDateMsg] = useState("");
  const [past_count, setPastCount] = useState(0);
  const [a_id, setAID] = useState([]);

  //   useRef
  const pastbtn = useRef("");
  const descriptionElementRef = useRef(null);
  const search_rt_name = useRef("");
  const round_table_name = useRef("");
  const moderator_name = useRef("");
  const panelist_name = useRef("");
  const category = useRef("");
  const tag = useRef("");

  const dispatch = useDispatch();

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(
      createEditRoundtableInitialize({
        arrayId: arrayId.concat(a_id),
      })
    );
  };

  useEffect(() => {
    let temp_value = [];
    let temp_rt_array = [];

    if (arrayId !== undefined || arrayId?.size > 0) {
      arrayId?.forEach((item) => {
        if (!temp_rt_array.includes(item)) {
          temp_rt_array.push(item);
        }
      });
    }

    if (urlRtId) {
      if (temp_check !== undefined) {
        temp_check?.filter((item) =>
          temp_rt_array?.find((i) =>
            item?._id === i
              ? ((item["isChecked"] = true),
                (item["isDisabled"] = true),
                temp_value.push(item.viewers_count))
              : ""
          )
        );
      }
    }
    if (!urlRtId) {
      if (temp_check !== undefined) {
        temp_check?.filter((item) =>
          temp_rt_array?.find((i) =>
            item?._id === i
              ? ((item["isChecked"] = true),
                temp_value.push(item.viewers_count))
              : ""
          )
        );
      }
    }

    let total = 0;
    for (const i in temp_value) {
      total += temp_value?.[i];
    }
    setPastCount(total);
  }, [temp_check]);

  useEffect(() => {
    let check_total = 0;
    for (const i in isCheckCount) {
      check_total += parseInt(isCheckCount[i]);
    }

    setArraycount(check_total);
  }, [isCheckCount]);

  const handleChange = (e) => {
    const { name, checked, id } = e.target;
    let tempPastRT = null;
    if (name === "allSelect") {
      tempPastRT = temp_check.map((rt) => {
        return { ...rt, isChecked: checked };
      });

      setTempCheck(tempPastRT);
    } else {
      tempPastRT = temp_check.map((rt) => {
        return rt?._id === id ? { ...rt, isChecked: checked } : rt;
      });
      setTempCheck(tempPastRT);
    }
    const temp_array = [];
    let array_count = [];
    tempPastRT?.map((item, index) =>
      item?.isChecked === true
        ? (temp_array?.push(item?._id), array_count?.push(item?.viewers_count))
        : ""
    );
    setIsCheckCount(array_count);
  };

  const handleClick = (e) => {
    const { id, value, checked } = e.target;
    setAID([...a_id, id]);
    setIsCheckCount([...isCheckCount, value]);

    if (!checked) {
      temp_check.map((i) => {
        return { ...i, isChecked: checked };
      });
    }
  };

  const handleFilter = () => {
    let rt_name_filter = round_table_name.current.value.trim().toLowerCase();
    let moderator_name_filter = moderator_name.current.value
      .trim()
      .toLowerCase();
    let panelist_name_filter = panelist_name.current.value.trim().toLowerCase();
    let category_filter = category.current.value.trim().toLowerCase();
    let tag_filter = tag.current.value.trim().toLowerCase();
    let rt_from_value_filter = moment(from_value, "DD/MM/YYYY");
    let rt_to_value_filter = moment(to_value, "DD/MM/YYYY");
    let temp_time = "";
    let temp_date = "";
    let temp_filter = [];

    if (
      rt_name_filter === "" &&
      moderator_name_filter === "" &&
      panelist_name_filter === "" &&
      category_filter === "" &&
      tag_filter === "" &&
      from_value === null &&
      to_value === null
    ) {
      setFilterSection(false);
      setTempCheck(pastCheck);
    } else {
      // RT Name
      if (rt_name_filter !== "") {
        pastCheck?.filter((item) =>
          item.name.toLowerCase().includes(rt_name_filter)
            ? temp_filter.push({
                ...item,
                isChecked: item.isChecked || false,
                isDisabled: item.isDisabled || false,
              })
            : null
        );

        setFilterSection(false);
      }
      // Moderator Name
      if (moderator_name_filter !== "") {
        pastCheck?.filter((item) =>
          item["moderator"]["username"] !== undefined
            ? item["moderator"]["username"]
                .toLowerCase()
                .includes(moderator_name_filter)
              ? temp_filter.push({
                  ...item,
                  isChecked: item.isChecked || false,
                  isDisabled: item.isDisabled || false,
                })
              : null
            : null
        );

        setFilterSection(false);
      }
      // Panelist Name
      if (panelist_name_filter !== "") {
        pastCheck?.filter((item) =>
          item.speakers.find((pan_item) =>
            pan_item["username"] !== undefined
              ? pan_item["username"]
                  .toLowerCase()
                  .includes(panelist_name_filter)
                ? temp_filter.push({
                    ...item,
                    isChecked: item.isChecked || false,
                    isDisabled: item.isDisabled || false,
                  })
                : null
              : null
          )
        );

        setFilterSection(false);
      }
      // Category
      if (category_filter !== "") {
        pastCheck?.filter((item) =>
          item?.category?.filter((cat_item) =>
            cat_item?.toLowerCase().includes(category_filter)
              ? temp_filter.push({
                  ...item,
                  isChecked: item.isChecked || false,
                  isDisabled: item.isDisabled || false,
                })
              : null
          )
        );

        setFilterSection(false);
      }
      // Tag
      if (tag_filter !== "") {
        pastCheck?.filter((item) =>
          item?.tags?.filter((tag_item) =>
            tag_item?.toLowerCase().includes(tag_filter)
              ? temp_filter.push({
                  ...item,
                  isChecked: item.isChecked || false,
                  isDisabled: item.isDisabled || false,
                })
              : null
          )
        );

        setFilterSection(false);
      }
      // From Date !== null and To Date !== null
      if (from_value !== null && to_value !== null) {
        if (
          from_value.getDate() === to_value.getDate() &&
          from_value.getMonth() === to_value.getMonth() &&
          from_value.getFullYear() === to_value.getFullYear()
        ) {
          pastCheck?.filter(
            (item) => (
              (temp_date = new Date(item?.start)),
              ((temp_time = moment(temp_date).format("DD/MM/YYYY")),
              from_value.getDate() === temp_date.getDate() &&
              from_value.getMonth() === temp_date.getMonth() &&
              from_value.getFullYear() === temp_date.getFullYear()
                ? temp_filter.push({
                    ...item,
                    isChecked: item.isChecked || false,
                    isDisabled: item.isDisabled || false,
                  })
                : null)
            )
          );
        } else {
          pastCheck?.filter(
            (item) => (
              (temp_date = new Date(item.start)),
              ((temp_time = moment(temp_date).format("DD/MM/YYYY")),
              moment(temp_time, "DD/MM/YYYY").isBetween(
                rt_from_value_filter,
                rt_to_value_filter
              )
                ? temp_filter.push({
                    ...item,
                    isChecked: item.isChecked || false,
                    isDisabled: item.isDisabled || false,
                  })
                : null)
            )
          );
        }

        setFilterSection(false);

        setFromValue(null);
        setToValue(null);
      }
      // From Date === null and To Date !== null
      if (from_value === null && to_value !== null) {
        setDateMsg("Please select From Date.");
        setFilterSection(true);
      }
      // From Date !== null and To Date === null
      if (to_value === null) {
        rt_to_value_filter = moment(new Date(), "DD/MM/YYYY");
        pastCheck?.filter(
          (item) => (
            (temp_date = new Date(item.start)),
            ((temp_time = moment(temp_date).format("DD/MM/YYYY")),
            moment(temp_time, "DD/MM/YYYY").isBetween(
              rt_from_value_filter,
              rt_to_value_filter
            )
              ? temp_filter.push({
                  ...item,
                  isChecked: item.isChecked || false,
                  isDisabled: item.isDisabled || false,
                })
              : null)
          )
        );

        setFilterSection(false);

        setFromValue(null);
        setToValue(null);
      }

      setTempCheckFilter(temp_filter);
    }
  };

  function uniqueValue(temp_select_value1, key) {
    return [
      ...new Map(temp_select_value1.map((item) => [key(item), item])).values(),
    ];
  }

  useEffect(() => {
    setTempCheck(uniqueValue(temp_check_filter, (it) => it._id));
  }, [temp_check_filter]);

  const handleFilterRtName = (e) => {
    const search_rt_name_value = e.target.value.trim().toLowerCase();
    if (e.key !== "Enter" || search_rt_name_value === "") return;

    const temp_rt_name = [];

    pastCheck.filter((item) =>
      item.name.toLowerCase().includes(search_rt_name_value)
        ? temp_rt_name.push({
            ...item,
            isChecked: item.isChecked || false,
            isDisabled: item.isDisabled || false,
          })
        : null
    );

    setTempCheckFilter(temp_rt_name);
  };

  const handleFilterChange = (e) => {
    const search_rt_name_value = e.target.value.trim().toLowerCase();

    if (search_rt_name_value === "") {
      if (arrayId) {
        pastCheck.filter((item) =>
          arrayId.find((i) =>
            item._id === i ? (item["isChecked"] = true) : ""
          )
        );
      }
      let filter_temp_check = temp_check.concat(pastCheck);
      setTempCheckFilter(filter_temp_check);
    }
  };

  const searchFilter = () => {
    let search_rt_name_value = search_rt_name.current.value
      .trim()
      .toLowerCase();
    let temp_rt_name = [];
    if (search_rt_name_value !== "") {
      pastCheck.filter((item) =>
        item.name.toLowerCase().includes(search_rt_name_value)
          ? temp_rt_name.push({
              ...item,
              isChecked: item.isChecked || false,
              isDisabled: item.isDisabled || false,
            })
          : null
      );
      setTempCheckFilter(temp_rt_name);
    } else if (search_rt_name_value === "") {
      if (arrayId) {
        pastCheck.filter((item) =>
          arrayId.find((i) =>
            item._id === i ? (item["isChecked"] = true) : ""
          )
        );
      }
      let filter_temp_check = temp_check.concat(pastCheck);
      setTempCheckFilter(filter_temp_check);
    }
  };

  function uniqueValue1(temp_select_value1, key) {
    return [
      ...new Map(temp_select_value1.map((item) => [key(item), item])).values(),
    ];
  }

  useEffect(() => {
    setTempCheck(uniqueValue1(temp_check_filter, (it) => it._id));
  }, [temp_check_filter]);

  function backFunction() {
    if (!filter_section) {
      setFilterSection(true);
    } else {
      setFilterSection(false);
    }
    setDateMsg("");

    let temp_value = [];
    if (a_id) {
      pastCheck.filter((item) =>
        a_id.find((i) =>
          item._id === i
            ? ((item["isChecked"] = true), temp_value.push(item.viewers_count))
            : ""
        )
      );
    }

    setTempCheck(pastCheck);

    const total = 0;
    for (const i in temp_value) {
      total += temp_value[i];
    }

    setArraycount(total);
  }
  return (
    <>
      <div className="row">
        <div
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={handleClickOpen("paper")}
          ref={pastbtn}
          className="follow_detail mt-3 col-11 d-flex justify-content-between align-items-center"
        >
          <div className="p-3">
            <span>
              {allWords.misc.oldview} -{" "}
              {arrayCount > 0 ? arrayCount : past_count}
            </span>
          </div>

          <img
            className="p-2"
            src={
              past_count > 0
                ? check_green
                : arrayCount === 0
                ? CheckWhite
                : check_green
            }
            alt=""
          />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <>
          <DialogTitle id="scroll-dialog-title">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontWeight: "bold" }}>{allWords.misc.ipr}</p>
              <div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1, opacity: 0.8 }}
                >
                  <IconButton
                    onClick={() => {
                      setOpen(false);
                      setFilterSection(false);
                      setFromValue(null);
                      setToValue(null);
                    }}
                    style={{ width: 50, height: 50 }}
                  >
                    <CancelOutlined />
                  </IconButton>
                </motion.div>
              </div>
            </div>
          </DialogTitle>
          <DialogContent
            className="past-attendes-dialog-content"
            dividers={scroll === "paper"}
          >
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <>
                {!filter_section ? (
                  <>
                    <SearchContainer>
                      <CustomSearchInput
                        type="text"
                        ref={search_rt_name}
                        placeholder={allWords.misc.searchByRt}
                        onKeyDown={handleFilterRtName}
                        onChange={handleFilterChange}
                      />
                      <img
                        src={filterImg}
                        alt=""
                        width={20}
                        height={20}
                        onClick={() => {
                          backFunction();
                        }}
                      />{" "}
                      &emsp;
                      <img src={search_icon} alt="" onClick={searchFilter} />
                    </SearchContainer>

                    <br />

                    <div className="d-flex justify-content-between">
                      <div>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="allSelect"
                          checked={
                            !temp_check.some((rt) => rt?.isChecked !== true)
                          }
                          onChange={handleChange}
                        />

                        <small className="past-attendes-small">
                          &nbsp;&nbsp;&nbsp;&nbsp; {allWords.misc.rtNameDate}
                        </small>
                      </div>

                      <small className="past-attendes-small">
                        {allWords.misc.attendees}
                      </small>
                    </div>
                    <hr style={{ borderTop: "1px dashed #D3D6DB" }} />

                    {loading && <Spinner />}
                    {error_msg && (
                      <div className="text-center">
                        <small className="warn-text">
                          {allWords.misc.nopast}
                        </small>
                      </div>
                    )}

                    {!loading && !error_msg && (
                      <>
                        <div style={{ height: "400px", overflowY: "auto" }}>
                          {temp_check?.map((rt) => (
                            <>
                              <div
                                className="d-flex justify-content-between"
                                key={rt._id}
                              >
                                <div
                                  className="rt_label form-check"
                                  key={rt._id}
                                >
                                  <input
                                    id={rt._id}
                                    type="checkbox"
                                    className="form-check-input"
                                    name={rt.name}
                                    checked={rt?.isChecked}
                                    disabled={
                                      urlRtId && rt?.isDisabled ? true : false
                                    }
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    onClick={(e) => {
                                      handleClick(e);
                                    }}
                                    value={rt.viewers_count}
                                  />
                                  <label className="form-check-label ms-2">
                                    {rt.name}
                                  </label>
                                  {/* <br /> */}
                                  <div past-attendes-time-div>
                                    {/* &nbsp; */}
                                    <img
                                      src={timeimg}
                                      width="20px"
                                      height="20px"
                                      alt=""
                                    />
                                    <div className="d-flex text-muted past-attendes-moment">
                                      <Moment format="DD MMM">
                                        {rt.time["start"].split("+")[0]}
                                      </Moment>
                                      <span>&nbsp;-&nbsp;</span>
                                      <Moment format="hh:mm A">
                                        {rt.time["start"].split("+")[0]}
                                      </Moment>
                                      <span>&emsp;-&emsp;</span>

                                      <Moment format="hh:mm A">
                                        {rt.time["end"].split("+")[0]}
                                      </Moment>
                                    </div>
                                  </div>
                                </div>
                                <small
                                  style={{
                                    fontSize: "24px",
                                    alignSelf: "center",
                                    fontWeight: "bold",
                                    color: "rgba(22, 31, 58, 1)",
                                  }}
                                >
                                  {rt.viewers_count}
                                </small>
                              </div>
                              <hr style={{ borderTop: "1px solid #D3D6DB" }} />
                            </>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className=" d-flex justify-content-start">
                      <img
                        style={{ cursor: "pointer", width: "25px" }}
                        onClick={() => {
                          setFilterSection(false);
                          setTempCheck(pastCheck);
                        }}
                        src={back_button}
                        alt="Go back"
                      />{" "}
                      &nbsp;
                      <p
                        className="title"
                        style={{ color: "rgba(17, 20, 28, 1)" }}
                      >
                        {allWords.misc.advanceSearch}
                      </p>
                    </div>
                    <FormInput>
                      <input
                        ref={round_table_name}
                        type="text"
                        placeholder={allWords.misc.searchByRt}
                      />
                    </FormInput>

                    <FormInput custom_class="mt-4">
                      <input
                        ref={moderator_name}
                        type="text"
                        placeholder={allWords.misc.searchByMod}
                      />
                    </FormInput>

                    <FormInput custom_class="mt-4">
                      <input
                        ref={panelist_name}
                        type="text"
                        placeholder={allWords.misc.searchByPan}
                      />
                    </FormInput>

                    <FormInput custom_class="mt-4">
                      <input
                        ref={category}
                        type="text"
                        placeholder={allWords.misc.searchByCategory}
                      />
                    </FormInput>

                    <FormInput custom_class="mt-4">
                      <input
                        ref={tag}
                        type="text"
                        placeholder={allWords.misc.searchByTags}
                      />
                    </FormInput>

                    <div className="d-flex justify-space-between mt-4">
                      <span
                        className="disable-floating-labels"
                        style={{ width: "15.6rem" }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={1}>
                            <DatePicker
                              label="From"
                              inputFormat="dd/MM/yyyy"
                              value={from_value}
                              maxDate={new Date()}
                              onChange={(new_from_value) => {
                                setFromValue(new_from_value);
                              }}
                              PopperProps={{
                                sx: popperSx,
                              }}
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </span>
                      <span
                        className="disable-floating-labels"
                        style={{ width: "15.6rem" }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Stack spacing={1}>
                            <DatePicker
                              label="To"
                              inputFormat="dd/MM/yyyy"
                              value={to_value}
                              maxDate={new Date()}
                              onChange={(new_to_value) => {
                                setToValue(new_to_value);
                              }}
                              PopperProps={{
                                sx: popperSx,
                              }}
                              renderInput={(params) => (
                                <TextField size="small" {...params} />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </span>
                    </div>
                    <div className="mt-1 container-fluid">
                      <small className="warn-text">{date_msg}</small>
                    </div>
                  </>
                )}
              </>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <button
              className={`btn primary-btn-blk`}
              onClick={() => {
                !filter_section ? handleClose() : handleFilter();
              }}
            >
              {!filter_section ? allWords.login.btn : allWords.login.filterCap}
            </button>
          </DialogActions>
        </>
      </Dialog>
    </>
  );
}
