import {
  CircularProgress,
  ClickAwayListener,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";

import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../../constants/env";
import { getCusrorPosition } from "../../utils/utils";
import UserProfile from "../UserProfile";

export default function UserListInput({
  refs,
  style,
  onChange,
  listDirection,
  name,
  ...props
}) {
  //local state
  const [list, setList] = useState([]);
  const [dynamicStyle, setDynamicStyle] = useState();
  const [loading, setLoading] = useState(false);

  //event handler
  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (!inputText) return setList([]);

    const selectionEnd = e.target.selectionEnd;

    const text = inputText.slice(0, selectionEnd);

    let lastWord = text.split(/\r?\n/).join(" ").split(" ");
    lastWord = lastWord[lastWord.length - 1];

    if (lastWord[0] !== "@" || lastWord.length < 4) return setList([]);

    getUserTags(lastWord);
  };

  //api call handlers
  const getUserTags = async (search_term) => {
    let data = new FormData();
    data.set("search_term", search_term);

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/user-search`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(
          localStorage.current_user || localStorage.anonymous_user
        )["_id"],
      },
      data: data,
    };
    setLoading(true);
    const response = await axios(config).then().catch();
    setLoading(false);

    if (!response.data) return;

    setList(response.data.data);
  };

  useEffect(() => {
    if (!refs.current) return;

    const { top, left } = getCusrorPosition(refs.current);

    switch (listDirection) {
      case "top":
        setDynamicStyle({ bottom: top, left });
        break;

      case "bottom":
        setDynamicStyle({ top: top, left });
        break;
      default:
        setDynamicStyle({ bottom: top, left });
    }
  }, [listDirection, refs, refs.current?.value]);

  return (
    <span
      style={{
        ...style,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {(list.length > 0 || loading) && (
        <ClickAwayListener onClickAway={() => setList([])}>
          <Paper
            elevation={4}
            style={{
              position: "absolute",
              left: "0px",
              backgroundColor: "white",
              zIndex: "100000",
              ...dynamicStyle,
            }}
          >
            {loading && (
              <Box
                style={{
                  minWidth: "300px",
                  minHeight: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {!loading && (
              <List
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  width: "300px",
                }}
              >
                {list.map((elem) => {
                  return (
                    <ListItem key={elem.username}>
                      <ListItemButton
                        onClick={() => {
                          const { selectionEnd } = refs.current;

                          const text = refs.current.value.slice(
                            0,
                            selectionEnd
                          );
                          const lines = text.split(/\r?\n/);

                          const lastLine = lines[lines.length - 1];

                          const words = lastLine.split(" ");

                          words[words.length - 1] = `@${elem.username} `;

                          lines[lines.length - 1] = words.join(" ");

                          const newlines = lines.join("\n");

                          const newLinesArray = newlines.split("");

                          const textArray = refs.current.value.split("");

                          textArray.splice(0, selectionEnd);

                          textArray.unshift(...newLinesArray);

                          refs.current.value = textArray.join("");

                          onChange({ target: refs.current });
                          setList([]);
                        }}
                      >
                        <Grid
                          container
                          justifyContent={"flex-start"}
                          alignItems="center"
                        >
                          <Grid item xs={3}>
                            <UserProfile username={elem?.username} />
                          </Grid>
                          <Grid item xs={8}>
                            <Grid container>
                              <Grid item xs={12}>
                                {elem.name}
                              </Grid>
                              <Grid item xs={12}>
                                @{elem.username}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </ClickAwayListener>
      )}

      <textarea
        {...props}
        ref={refs}
        onChange={(e) => {
          onChange(e);
          handleInputChange(e);
        }}
        style={{
          ...props.style,
          ...props.textInputStyle,
          paddingTop: window.innerWidth > 1440 ? "0.7rem" : "",
        }}
      />
    </span>
  );
}
