import { ThumbnailIcon } from './style/thumbnailIcons.js';
import Waves from "../../../../assets/images/Waves.png";

const DocumentIcon = ({ thumbnail, isAudio = false, children }) => {
  const thumb = ThumbnailIcon(thumbnail);
  return (
    <div className="docs_container">
      <div
        style={thumb.thumbnailPic}
      >
        {isAudio &&
          <span style={thumb.thumbUpperPic}>
            <img src={Waves} />
          </span>
        }
        <span style={thumb.icon}>
          {children}
        </span>
      </div>
    </div>

  )
}

export default DocumentIcon;
