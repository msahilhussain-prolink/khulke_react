import { globalImages } from "../../assets/imagesPath/images";
import "react-placeholder/lib/reactPlaceholder.css";
import "../ProfileCenter/style.css";
const NoTables = () => {
    return (
      <div className="noRtProfile">
        <lottie-player
          src={globalImages.si_pr_rt}
          background="transparent"
          speed="1"
          style={{
            width: "300px",
          }}
          loop
          autoplay
        />
        <p>{allWords.profile.noRt}</p>
      </div>
    );
  };

  export default NoTables;