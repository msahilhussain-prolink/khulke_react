import { Grid, Menu } from "@mui/material";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AudienceRaiseHandOption from "./Audience/AudienceRaiseHandOption";
import ShowMedia from "./MultiMediaContainers/ShowMedia";
import { role } from "../../../pages/AgoraSandbox/settings";
import ModAdminRaiseHandOptions from "./ModAdmin/ModAdminRaiseHandOptions";
import moment from "moment";
import { auto_login_continue, filterURLs, linkify } from "../../../utils/utils";
import axios from "axios";
import ReactPlayer from "react-player";
import Spinner from "../../Spinner";
import { REACT_APP_BASE_URL_FOR_USER } from "../../../constants/env";
import { PostImgContainer } from "../../Post/style";
export default function RaiseHandMessage(props) {
  //props destructuring here
  const {
    setMessageData,
    item,
    setRaisedHand,
    setOpenMessages,
    setUsers,
    rtm_channel,
    handle_wildcard_removal,
  } = props;

  //states here
  const [anchorEl, setAnchorEl] = useState(null);

  //link preview states
  const [youtubeURL, setYoutubeURL] = useState("");
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: null,
    image_url: null,
  });
  //3 dots menu state here
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //Link preview functions
  const getMetaData = async (target_url) => {
    var data = JSON.stringify({
      target_url: target_url,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        localStorage.anonymous_user
          ? "anonymous/get_meta_data"
          : "get_meta_data/"
      }`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    setMetadataLoading(true);
    await axios(config)
      .then(async function (response) {
        setMetadataLoading(false);
        setMetadata(response.data);
      })
      .catch(async function (error) {
        const response = error.response;
        if (!response) {
          setMetadataLoading(false);
          return;
        }
        if (response.status === 401) {
          return await auto_login_continue(() => getMetaData(target_url));
        }
        setMetadataLoading(false);
      });
  };

  useEffect(() => {
    if (
      item?.message?.includes("konsultera.co.in/roundtable") ||
      item?.message?.includes("konsultera.co.in:8000/roundtable") ||
      item?.message?.includes("localhost:3000/roundtable") ||
      item?.message?.includes("khulke.com/roundtable")
    ) {
      setMetadata({ title: null, image_url: null });
    } else if (item?.message?.includes("https")) {
      if (
        item?.message?.includes("youtube") ||
        item?.message?.includes("youtu.be")
      ) {
        const url = filterURLs(item?.message);
        setYoutubeURL(url[0]);
      } else {
        const url = filterURLs(item?.message);
        getMetaData(url[0]);
        setYoutubeURL("");
      }
    }
  }, [item?.message]);

  return (
    <>
      <Grid
        container
        alignItems="center"
        style={{
          marginBottom: "50px",
          backgroundColor: "rgb(211 212 213)",
          padding: "10px 20px",
          borderRadius: "10px",
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <Grid item>
          <Typography
            style={{
              fontFamily: `"Work Sans",sans-serif`,
              padding: "0px",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              color: "black",
            }}
          >
            <Link
              to={`/profile/${item?.username}/posts`}
              style={{
                textDecoration: "none",
              }}
              target="_blank"
            >
              @{item?.username}
            </Link>
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: "auto",
          }}
        >
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{
              minWidth: "0px",
            }}
          >
            <MoreVertIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {role.includes("admin") || role.includes("moderator") ? (
              <ModAdminRaiseHandOptions
                setOpenMessages={setOpenMessages}
                id={item.user_id}
                setUsers={setUsers}
                username={item.username}
                message_id={item._id}
                rtm_channel={rtm_channel}
                handle_wildcard_removal={handle_wildcard_removal}
                setMessageData={setMessageData}
                handleClose={handleClose}
              />
            ) : (
              <AudienceRaiseHandOption
                handleClose={handleClose}
                setMessageData={setMessageData}
                setRaisedHand={setRaisedHand}
                message_id={item?._id}
                rtm_channel={rtm_channel}
              />
            )}
          </Menu>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="p"
            style={{
              fontSize: "18px",
              lineBreak: "anywhere",
            }}
          >
            {linkify(item?.message)}
          </Typography>
          <Grid
            item
            style={{
              maxWidht: "100%",
            }}
          >
            {youtubeURL && (
              <Grid
                container
                style={{
                  maxWidth: "100%",
                  marginTop: "20px",
                }}
              >
                <ReactPlayer
                  className="react-player"
                  height="auto"
                  style={{
                    minHeight: "300px",
                  }}
                  width={"100%"}
                  controls={true}
                  url={youtubeURL}
                />
              </Grid>
            )}
            {metadata.title && (
              <Grid
                container
                style={{
                  marginTop: "20px",
                }}
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                  }}
                  href={item?.message}
                >
                  {metadata?.image_url && (
                    <Grid container>
                      <Grid item xs={12}>
                        <img
                          src={metadata?.image_url}
                          style={{
                            maxWidth: "100%",
                            borderRadius: "5px",
                            marginBottom: "10px",
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {metadata?.title && (
                    <Typography
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                      }}
                    >
                      {metadata?.title}{" "}
                    </Typography>
                  )}

                  {metadata?.content && (
                    <Typography
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      {metadata?.content}
                    </Typography>
                  )}
                </a>
              </Grid>
            )}
            {metadataLoading && (
              <>
                <Spinner />
              </>
            )}
          </Grid>
        </Grid>
        {(item?.file_type || item?.doc_media || item?.media) && (
          <Grid
            item
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <ShowMedia item={item} />
          </Grid>
        )}
        <Typography
          variant="p"
          style={{
            textAlign: "right",
            width: "100%",
          }}
        >
          {moment(new Date(item?.created_at)).local().format("LT")}
        </Typography>
      </Grid>
    </>
  );
}
