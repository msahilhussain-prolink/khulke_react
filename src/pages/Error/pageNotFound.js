import { Link } from "react-router-dom";
import { allWords } from "../../App"

export default function PageNotFound() {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1> {allWords.misc.pages.pagenotfound}</h1>

        <Link
          to='/roundtable/all'
          style={{
            marginLeft: "20px",
          }}
        >
          {allWords.misc.pages.gotohome}
        </Link>
      </div>
    </>
  );
}
