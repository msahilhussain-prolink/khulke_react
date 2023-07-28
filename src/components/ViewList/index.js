import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import DialogList from "../../components/DialogList";

// Constants
import { accessAcceptData } from "../../redux/actions/roundtableAction/acceptAccess";
import { ViewListData } from "../../redux/actions/roundtableAction/viewList";
import UserProfile from "../UserProfile";
import { allWords } from "../../App"
export default function ViewList(props) {
  const { parsed_data, current_user, rt_id } = props;
  const dispatch = useDispatch();

  // Global State
  const viewListData = useSelector((state) => state.viewList.data);
  const accessAccept_data = useSelector((state) => state.acceptAccess.data);
  // useState
  const [show, setShow] = useState(false);
  const [addbtn, setAddBtn] = useState([]);
  const [viewList, setViewList] = useState([]);
  const [u_id, setUID] = useState([]);

  //   useEffect
  useEffect(() => {
    if (viewListData && viewListData?.status === 200) {
      setViewList(viewListData?.data?.data);
    }
  }, [viewListData]);

  useEffect(() => {
    if (accessAccept_data) {
      if (
        accessAccept_data.status === 200 ||
        accessAccept_data.status === 253
      ) {
        setAddBtn(u_id);
      }
    }
  }, [accessAccept_data]);

  return (
    <>
      {parsed_data?.["owner"]?.["user_id"] === current_user?.["_id"] &&
        parsed_data?.["req_visitor_count"] > 0 && (
          <div
            className="d-flex justify-content-between"
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#FFEBAC",
              padding: "8px",
              borderRadius: "10px",
            }}
          >
            <small>
              &nbsp; {allWords.misc.joinreq}- <b>{parsed_data?.["req_visitor_count"]}</b>
            </small>
            <button
              style={{
                color: "#66B984",
                backgroundColor: "white",
                padding: "0px 5px",
                borderRadius: "50px",
                border: "1px solid #66B984",
                fontSize: "0.875rem",
              }}
              onClick={() => {
                setShow(true);
                dispatch(ViewListData({ rt_id: rt_id }));
              }}
            >
              {allWords.misc.vlist}
            </button>
          </div>
        )}

      {/* Requested User List */}
      <DialogList
        title={allWords.misc.joinreq}
        open={show}
        setOpen={setShow}
        onCloseBtnClick={() => {
          setShow(false);
          window.location.reload(false);
        }}
      >
        <>
          {viewList?.map((item) => (
            <>
              {item?.request_user_list.map((items) => (
                <>
                  <div
                    key={items?.username}
                    className="d-flex justify-content-between py-2"
                  >
                    <div className="d-flex">
                      <UserProfile
                        username={items?.username}
                        className="avatar"
                      />
                      <span
                        style={{ userSelect: "none", visibility: "hidden" }}
                      >
                        ||
                      </span>
                      <div>
                        <strong style={{ display: "block" }}>
                          {items?.name}
                        </strong>
                        <small className="text-muted">@{items?.username}</small>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "2rem",
                        cursor: "pointer",
                      }}
                    >
                      {items.is_accepted === 1 ? (
                        <button disabled={true} className="set-reminder-white">
                          {allWords.addedalready}
                        </button>
                      ) : (
                        <>
                          {addbtn?.includes(items?.user_id) ? (
                            <button
                              disabled={true}
                              className="set-reminder-white"
                            >
                              {allWords.addedalready}
                            </button>
                          ) : (
                            <button
                              className="request-acccess-green"
                              onClick={() => {
                                dispatch(
                                  accessAcceptData({
                                    rt_id: rt_id,
                                    user_id: items?.user_id,
                                  })
                                );
                                dispatch(ViewListData({ rt_id: rt_id }));
                                setUID(items?.user_id);
                              }}
                              style={{ padding: "7px 36px" }}
                              id="request_access_button"
                            >
                              {allWords.misc.add}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </>
          ))}
        </>
      </DialogList>
    </>
  );
}
