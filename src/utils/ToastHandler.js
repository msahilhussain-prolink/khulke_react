import { toast } from "react-toastify";

var lastMess = {
  mess: null,
  time: null,
};

const options = {
  position: "top-center",
  theme: "colored",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const checkValidity = (newMess) => {
  let mess = lastMess;
  try {
    if (mess.mess === newMess) {
      let current = new Date();
      if (current.valueOf() < mess.time) {
        return false;
      } else {
        let current = new Date();
        let curr = current.valueOf() + 3000;
        let data = {
          mess: newMess,
          time: curr,
        };
        lastMess = data;
        return true;
      }
    } else {
      let current = new Date();
      let curr = current.valueOf() + 3000;
      let data = {
        mess: newMess,
        time: curr,
      };
      lastMess = data;
      return true;
    }
  } catch (error) {
    return true;
  }
};

export default function ToastHandler(stat, mess) {
  if (checkValidity(mess)) {
    /*capitalizing first letter of each word of the message*/
    // const arr = mess.split(" ");
    // for (var i = 0; i < arr.length; i++) {
    //   arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    // }
    // const message = arr.join(" ");
    //
    if (stat === "warn") {
      toast.warn(mess, options);
    } else if (stat === "sus") {
      toast.success(mess, options);
    } else if (stat === "dan") {
      toast.error(mess, options);
    } else if (stat === "info") {
      toast.info(mess, options);
    } else {
      toast(mess, options);
    }
    return true;
  } else {
    return false;
  }
}
