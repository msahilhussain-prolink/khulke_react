import { POST_API_BASE_URL } from "../../../constants/env";
import { PostMedia } from "../../../utils/Constant/postMetia";
import DocumentIcon from "./thumbnails/DocumentIcon";
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import HeadsetOutlinedIcon from '@mui/icons-material/HeadsetOutlined';
import Waves from "../../../assets/images/Waves.png";
import Poll from "../../../assets/images/Poll.png";
import IconPoll from "../../../assets/icons/IconPoll.svg";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { ThumbnailIcon } from "./thumbnails/style/thumbnailIcons";

const PostMediaType = ({postMediaType, uploadFilename, onClickHandle}) => {
    switch(postMediaType){
        case PostMedia.IMAGE:{
          const url = `${POST_API_BASE_URL}/post-media/image/${uploadFilename}`;

            return <div onClick={onClickHandle}>
            <DocumentIcon
            thumbnail={
              url
            }
          />
          </div>
        }
        case PostMedia.POLL: {
          const url = Poll;
          return <div onClick={onClickHandle}>
          <DocumentIcon
          thumbnail={
            url
          }
        >
          <img src={IconPoll}/>
          </DocumentIcon>
          </div>
        }
        case PostMedia.VIDEO: {
          const url = `${POST_API_BASE_URL}/post-media/frame/${uploadFilename}`;
          return <div onClick={onClickHandle}>
          <DocumentIcon
          thumbnail={
            url
          }
        >
          <PlayCircleIcon/>
          </DocumentIcon>
          </div>
        }
        case PostMedia.AUDIO: {
          const url = Waves;
          return <div onClick={onClickHandle}>
           <DocumentIcon
          thumbnail={
            url
          }
        >
          <HeadsetOutlinedIcon style={ThumbnailIcon().audioIcon}/>
          </DocumentIcon>
          </div>
        }
        case PostMedia.PDF:
         case PostMedia.XLX:
         case PostMedia.DOC:
          case PostMedia.PPT:
         case PostMedia.XLSX:
         case PostMedia.DOCX:
         case PostMedia.PPTX: {
            return  <div onClick={onClickHandle}>
            <DocumentIcon
            thumbnail={
              `${POST_API_BASE_URL}/post-media/frame/${uploadFilename}`
            }
          >
          <FeedRoundedIcon/>
         </DocumentIcon>
         </div>
         }
        default:
            return <></>

    }
}

export default PostMediaType;