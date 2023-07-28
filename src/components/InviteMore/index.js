import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { allWords } from "../../App";
// Constants
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../../constants/env";

// Components
import FormInput from "../FormInput";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { createEditRoundtableInitialize } from "../../redux/actions/createEditRoundtable";

export default function InviteMore() {
  const selector = useSelector((state) => state.createEditRoundtable);

  const { phoneList, emailList } = selector;

  // useState
  const [phoneAlertEmo, setPhoneAlertEmo] = useState({
    alert: "",
    emotion: "",
  });
  const [addMobile, setAddMobile] = useState([]);
  const [emailText, setEmailText] = useState("");
  const [phone_numbers, setPhoneNumbers] = useState([]);

  // useRef
  const addInput = useRef();
  const phone_alert_text = useRef("");

  const dispatch = useDispatch();

  let validPhone = /^([+[1-9]{1,5})?([6-9]\d{9})$/;
  let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    let temp_phone = [];
    let temp_email = [];
    addMobile.map((item) =>
      item.match(validPhone)
        ? (temp_phone.push(item),
          dispatch(createEditRoundtableInitialize({ phones: temp_phone })))
        : (temp_email.push(item),
          dispatch(createEditRoundtableInitialize({ emails: temp_email })))
    );
  }, [addMobile]);

  // PhoneList
  useEffect(() => {
    try {
      if (phoneList !== undefined) {
        let temp_phone_list = [];
        let item_slice = "";
        phoneList.map(
          (item) => (
            (item_slice = item.slice(-10)), temp_phone_list.push(item_slice)
          )
        );
        setPhoneNumbers(temp_phone_list);
      }
    } catch (e) {
      return;
    }
  }, [phoneList]);

  const validate = (validate_for) => {
    if (validate_for === "email") {
      if (!validEmail.test(addInput.current.value)) {
        return false;
      }
      return "email";
    } else if (validate_for === "phone") {
      if (!validPhone.test(addInput.current.value)) {
        return false;
      }
      return "phone";
    }
  };

  const removeMobile = (i) => {
    const newMob = [...addMobile];
    newMob.splice(i, 1);
    setAddMobile(newMob);
  };

  const check_existence = async (value) => {
    let data = {};

    if (value.match(validPhone)) {
      if (value.length === 10) {
        data = JSON.stringify({
          phone_number: "+91" + value,
        });
      } else if (value.length > 10) {
        data = JSON.stringify({
          phone_number: value,
        });
      }
    } else if (value.match(validEmail)) {
      data = JSON.stringify({ email: value });
    } else {
      return;
    }

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/check/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        if (response.data["status"] !== 200) {
          //email/phone in use
          if (value.match(validEmail)) {
            setPhoneAlertEmo({
              alert: "This email is already in use.",
              emotion: "-alert",
            });

            phone_alert_text.current.classList = ["warn-text"];
          } else if (value.match(validPhone)) {
            setPhoneAlertEmo({
              alert: "This phone number is already in use.",
              emotion: "-alert",
            });
            phone_alert_text.current.classList = ["warn-text"];
          } else {
            setPhoneAlertEmo({
              alert: "",
              emotion: "",
            });
            phone_alert_text.current.classList = ["alert-text"];
          }
        } else {
          if (
            addMobile.find((mob) => mob.toLowerCase() === value.toLowerCase())
          ) {
            return;
          }
          setAddMobile([...addMobile, value]);
          addInput.current.value = null;
          setPhoneAlertEmo({
            alert: "",
            emotion: "-success",
          });
          return false;
        }
      })
      .catch(function (error) {
        return false;
      });
  };
  const inputAddDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      if (!validate("phone") && !validate("email")) {
        setPhoneAlertEmo({
          alert: "Enter a valid phone number /email ID.",
          emotion: "-alert",
        });
        return false;
      } else {
        check_existence(val);
      }
    } else if (e.key === "Backspace" && !val) {
      removeMobile(addMobile.length);
    }
  };

  function handleAdd() {
    const val = addInput.current.value;
    if (!validate("phone") && !validate("email")) {
      setPhoneAlertEmo({
        alert: "Enter a valid phone number /email ID.",
        emotion: "-alert",
      });
      return false;
    } else {
      check_existence(val);
    }
  }

  return (
    <div>
      <div className="mt-2 d-flex justify-space-between">
        <FormInput
          emotion={phoneAlertEmo?.emotion}
          custom_styles={{ width: "75%" }}
        >
          <input
            type="text"
            style={{
              border: "none",
              width: "100%",
              height: "1.5rem",
              outline: "none",
            }}
            maxLength={"300"}
            placeholder={allWords.misc.pg4.addMobile}
            onKeyDown={inputAddDown}
            onChange={(e) => {
              setEmailText(e.target.value);
            }}
            ref={addInput}
          />
        </FormInput>
        <button
          className="btn addInvStyle"
          onClick={() => {
            handleAdd();
          }}
          disabled={emailText?.length !== 0 ? false : true}
        >
          {allWords.misc.pg3.addbtn}
        </button>
      </div>
      {phoneAlertEmo?.alert !== "" && (
        <small className="warn-text" ref={phone_alert_text}>
          {phoneAlertEmo?.alert}
        </small>
      )}
      <br />
      <div className="d-flex invite-more-div">
        {phone_numbers !== undefined && (
          <>
            {phone_numbers?.map((p_no) => (
              <>
                <div className="invEmailMob" key={p_no}>
                  {p_no}
                </div>{" "}
                &nbsp;
              </>
            ))}
          </>
        )}
        {emailList !== undefined && (
          <>
            {emailList?.map((p_no) => (
              <>
                <div className="invEmailMob" key={p_no}>
                  {p_no}
                </div>{" "}
                &nbsp;
              </>
            ))}
          </>
        )}

        {addMobile.map((mob, i) => (
          <>
            <div className="invEmailMob" key={mob}>
              {mob}
              <button
                className="crossInvbtn"
                type="button"
                onClick={() => {
                  removeMobile(i);
                }}
              >
                +
              </button>
            </div>{" "}
            &nbsp;
          </>
        ))}
      </div>
    </div>
  );
}
