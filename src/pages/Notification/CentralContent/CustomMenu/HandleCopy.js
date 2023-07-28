import { allWords } from "../../../../App";
import ToastHandler from "../../../../utils/ToastHandler";

const HandleCopy = (id) => {
        navigator.clipboard
          .writeText(`${window.location.origin}/post/${id}`)
          .then(
            function () {
              ToastHandler("sus", allWords.misc.succcopied);
            },
            function () {
              ToastHandler("dan", "Failed. try again!");
            }
          );    
}

export default HandleCopy;