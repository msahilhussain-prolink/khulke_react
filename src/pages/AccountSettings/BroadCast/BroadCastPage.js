import { useState } from "react";
import AddBroadCastPage from "./BroadCastPages/AddBroadCasts";
import ViewBroadCastPage from "./BroadCastPages/ViewBroadcasts";
import { BROADCAST_PAGE } from "./BroadCastUtils/Configs";

export default function BroadCastPage() {
  const [activePage, setActivePage] = useState(BROADCAST_PAGE.VIEW);

  return (
    <>
      {activePage === BROADCAST_PAGE.VIEW ? (
        <ViewBroadCastPage setActivePage={setActivePage} />
      ) : (
        <AddBroadCastPage setActivePage={setActivePage} />
      )}
    </>
  );
}
