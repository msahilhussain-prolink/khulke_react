import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";

export const localImages = {
  logo: "/assets/icons/logo.svg",
  loading: "/assets/json/loading.json",
  si_th_menu: "/assets/icons/si_th_menu.svg",
  si_th_menu_a: "/assets/icons/si_th_menu_a.svg",
  si_rt_menu: "/assets/icons/si_rt_menu.svg",
  si_rt_menu_a: "/assets/icons/si_rt_menu_a.svg",
  si_yapp_menu: "/assets/icons/si_yapp_menu.svg",
  si_yapp_menu_a: "/assets/icons/si_yapp_menu_a.svg",
  si_snip_menu: "/assets/icons/si_snip_menu.svg",
  si_th_empty: "/assets/icons/si_th_empty.svg",
  si_rt_empty: "/assets/icons/si_rt_empty.svg",
  si_yapp_empty: "/assets/images/si_yapp_empty.svg",
  si_notif_empty: "/assets/icons/si_notif_empty.svg",
  si_pr_post: "/assets/json/si_pr_post.json",
  si_pr_rt: "/assets/json/si_pr_rt.json",
  si_pr_snip: "/assets/json/si_pr_snip.json",
  si_pr_save: "/assets/json/si_pr_save.json",
  si_pr_incomplete: "/assets/json/si_pr_incomplete.json",
  si_search_post: "/assets/icons/si_search.svg",
  si_search_people: "/assets/icons/si_search.svg",
  si_search_rt: "/assets/icons/si_search.svg",
  // si_verif_celeb: "static/updated/images/si_verif_celeb.svg",
  // si_verif_company: "static/updated/images/si_verif_company.svg",
  // si_verif_normal: "static/updated/images/si_verif_normal.svg",
  // si_verif_respected: "static/updated/images/si_verif_respected.svg",
  // si_verif_top: "static/updated/images/si_verif_top.svg",
  // si_verif_vip: "static/updated/images/si_verif_vip.svg",
  // si_forget_pass: "/assets/images/forgot_password.png",
  // si_login: "/assets/gif/logingif2.gif", // json
  // si_otp: "/assets/gif/login2.gif", // json
  // si_pass: "/assets/gif/login2.gif", // json
  // si_signup: "static/updated/images/si_signup.json", // json
};

export const convertToObj = (arr) => {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[
      arr[i].image_name
    ] = `${REACT_APP_BASE_URL_CLOUDFRONT}/${arr[i].image_url}`;
  }
  return obj;
};

let globalImages = {};
export { globalImages };

export let updatedImagesToShow = (val) => {
  let tempGlobalImages = localImages;
  Object.keys(val).forEach((el) => (tempGlobalImages[el] = val[el]));

  globalImages = tempGlobalImages;
};
