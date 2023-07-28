import { makeStyles } from "@material-ui/styles";
import {
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { allWords } from "../../App";
import Delete from "../../assets/icons/Group 19618.svg";
import { PollBtn, PollDiv } from "./style";

const InputBox = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1px solid #d3d6db",
      borderRadius: "10px",
      minWidth: "120px !important",
    },
    "&:hover fieldset": {
      border: "1px solid #d3d6db",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #d3d6db",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#63779c",
    "&.Mui-focused": {
      color: "#63779c",
    },
  },
});

const useStyles = makeStyles({
  select: { height: "35px", borderRadius: "8px" },
});

const PollFormContainer = (props) => {
  const classes = useStyles();
  const CHARACTER_LIMIT = 25;
  const { setPollData, setStateData } = props;

  const [addBtn, setAddBtn] = useState(true);

  const [days, setDays] = useState("1");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");

  const [state, setState] = useState([
    {
      id: 1,
      label: `${allWords.misc.livert.option} 1`,
      name: "option1",
      length: 0,
    },
    {
      id: 2,
      label: `${allWords.misc.livert.option} 2`,
      name: "option2",
      length: 0,
    },
  ]);

  const handleOptionAdd = () => {
    setState((prev) => [
      ...prev,
      {
        id: state.length + 1,
        label: `${allWords.misc.livert.option} ${state.length + 1}`,
        name: `option${state.length + 1}`,
        length: 0,
      },
    ]);
  };

  const handleOptionRemove = (i) => {
    const values = [...state];
    values.splice(i, 1);

    values.map(
      (item, index) => (
        (item["_id"] = index + 1),
        (item["label"] = `${allWords.misc.livert.option} ${index + 1}`),
        (item["name"] = `option${index + 1}`)
      )
    );

    setState([...values]);
  };

  useEffect(() => {
    if (state) {
      setStateData(state);

      let tempData = [];
      state?.map((item, index) =>
        item[`option${item.id}`] !== undefined
          ? tempData.push(item[`option${item.id}`])
          : null
      );

      setPollData((prevState) => ({
        ...prevState,
        option: tempData,
      }));
    }
  }, [state]);

  useEffect(() => {
    if (state.length >= 4) {
      setAddBtn(false);
    }
  }, [state, addBtn]);

  const handleChange = (e, index) => {
    const values = [...state];
    values[index][e.target.name] = e.target.value;
    values[index].length = e.target.value.length;
    setState(values);

    let tempData = [];
    values?.map((item, index) =>
      item[`option${item.id}`] !== undefined
        ? tempData.push(item[`option${item.id}`])
        : null
    );

    setPollData((prevState) => ({
      ...prevState,
      option: tempData,
    }));
  };

  useEffect(() => {
    setPollData((prevState) => ({
      ...prevState,
      duration: `${days}d${hours}h${minutes}m`,
    }));
  }, [days, hours, minutes]);

  const handleDayChange = (event) => {
    setDays(event.target.value);
  };
  const handleHourChange = (event) => {
    setHours(event.target.value);
  };
  const handleMinuteChange = (event) => {
    setMinutes(event.target.value);
  };

  return (
    <PollDiv
      className="poll-form-container"
      elevation={0}
      style={{
        marginLeft: "",
        marginTop:
          window.location.pathname === "/roundtable/join" ? "1.5rem" : "0rem",
      }}
    >
      <CardContent style={{ padding: "0px" }}>
        <Container
          style={{
            padding: "0.5rem",
          }}
        >
          <Grid container alignItems="center">
            {state.map((item, index) => (
              <>
                <Grid item md={9.6} key={item.id}>
                  <InputBox
                    fullWidth
                    label={item.label}
                    name={item.name}
                    onChange={(e) => handleChange(e, index)}
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                      autoComplete: "off",
                    }}
                    helperText={`${
                      CHARACTER_LIMIT - state[index].length
                    }/${CHARACTER_LIMIT}`}
                    value={item[`option${item.id}`]}
                    sx={{
                      marginTop: "1rem",
                    }}
                  />
                </Grid>

                <Grid item md={2.4}>
                  {state.length > 2 && (
                    <IconButton
                      size="medium"
                      onClick={() => handleOptionRemove(index)}
                      color="secondary"
                    >
                      <img alt="" src={Delete} />
                    </IconButton>
                  )}
                </Grid>
              </>
            ))}

            {/* <Grid item md={1.2}> */}
            {state.length >= 2 && state.length < 4 && (
              <PollBtn onClick={handleOptionAdd}>
                {allWords.misc.livert.addopt}
              </PollBtn>
            )}
            {/* </Grid> */}
          </Grid>
        </Container>
        <Divider
          sx={{
            marginTop: state.length >= 2 && state.length < 4 ? "-1rem" : "0rem",
          }}
        />
        <Container sx={{ marginTop: "1rem" }}>
          <Typography>{allWords.misc.livert.polldur}</Typography>
        </Container>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          {/* days */}
          <FormControl className="poll-form-control" sx={{ m: 1 }}>
            <InputLabel htmlFor="demo-dialog-native">
              {allWords.misc.livert.d}
            </InputLabel>
            <Select
              native
              value={days}
              onChange={handleDayChange}
              label={allWords.misc.livert.d}
              className={classes.select}
            >
              {Array.apply(null, { length: 8 })
                .map((_, i) => i)
                .map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
            </Select>
          </FormControl>
          {/* hours */}
          <FormControl className="poll-form-control " sx={{ m: 1 }}>
            <InputLabel htmlFor="demo-dialog-native">
              {allWords.misc.livert.h}
            </InputLabel>
            <Select
              label="Hours"
              native
              value={hours}
              onChange={handleHourChange}
              className={classes.select}
            >
              {Array.apply(null, { length: 24 })
                .map((_, i) => i)
                .map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
            </Select>
          </FormControl>
          {/* minutes */}
          <FormControl className="poll-form-control" sx={{ m: 1 }}>
            <InputLabel htmlFor="demo-dialog-native">
              {allWords.misc.livert.m}
            </InputLabel>
            <Select
              label={allWords.misc.livert.m}
              native
              value={minutes}
              onChange={handleMinuteChange}
              className={classes.select}
            >
              {Array.apply(null, { length: 60 })
                .map((_, i) => i)
                .map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
            </Select>
          </FormControl>
        </Container>
      </CardContent>
    </PollDiv>
  );
};

export default PollFormContainer;
