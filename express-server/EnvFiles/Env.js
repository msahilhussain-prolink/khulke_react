import env from "./EnvCreds.json" assert { type: "json" };
//!DEV
export const REACT_APP_BASE_URL = env.REACT_APP_BASE_URL;
const REACT_APP_USER_ONBOARDING_URL = env.REACT_APP_USER_ONBOARDING_URL;

//roundtable url
export const REACT_APP_BASE_URL_FOR_ROUNDTABLE =
  env.REACT_APP_BASE_URL_FOR_ROUNDTABLE;
export const REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 =
  env.REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1;
//user onboarding url
export const REACT_APP_BASE_URL_FOR_USER = `${REACT_APP_USER_ONBOARDING_URL}/user`;
export const STATIC_TOKEN = env.STATIC_TOKEN;

export const REACT_APP_BASE_URL_CLOUDFRONT = env.REACT_APP_BASE_URL_CLOUDFRONT;

export const POST_API_BASE_URL = env.POST_API_BASE_URL;

export let ANONYMOUS_USER_DATA = "";

export const UpdateAnonymousData = (val) => {
  ANONYMOUS_USER_DATA = val;
};

export const DEFAULT_META_TAGS = {
  title: "Khul Ke | Social Media Platform | Social Media App in India ",
  description:
    "Open up and speak freely on Khul Ke.Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
  image: "https://khulke.com/static/media/KhulKe_logo.196f7d82.svg",
  keywords:
    "social media platforms, networking platform, india social media app, ",
  "og:title": "Khul Ke | Social Media Platform | Social Media App in India ",
  "og:description":
    "Open up and speak freely on Khul Ke.Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
  "twitter:title":
    "Khul Ke | Social Media Platform | Social Media App in India ",
  "twitter:description":
    "Open up and speak freely on Khul Ke.Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
};

export const metaData = {
  "": {
    title: "Khul Ke | Social Media Platform | Social Media App in India ",
    description:
      "Open up and speak freely on Khul Ke.Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
    keywords:
      "social media platforms, networking platform, india social media app, ",
    "og:title": "Khul Ke | Social Media Platform | Social Media App in India ",
    "og:description":
      "Open up and speak freely on Khul Ke.Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
    "twitter:title":
      "Khul Ke | Social Media Platform | Social Media App in India ",
    "twitter:description":
      "Open up and speak freely on Khul Ke.Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
  },

  home: {
    title: "Khul Ke | TownHall | Social Media App in India ",
    description:
      "Open up and speak freely on Khul Ke. Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
    keywords:
      "social media platforms, networking platform, india social media app, townhall ",
    "og:title": "Khul Ke | TownHall | Social Media App in India ",
    "og:description":
      "Open up and speak freely on Khul Ke. Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
    "twitter:title": "Khul Ke | TownHall | Social Media App in India ",
    "twitter:description":
      "Open up and speak freely on Khul Ke. Embed yourself in a culture of positivity with purposeful conversations. A free for all social media platform.",
  },

  "roundtable/all": {
    title: "Online RoundTable Discussions | Video | Khul Ke",
    description:
      "Host and view online RoundTable Discussions. Make your very own audio-visual content. Conduct a conversation. Host private meetings, lectures and more. Explore and contribute to a variety of topics.",
    keywords:
      "roundtable discussions, online roundtable discussion, roundtable meeting, roundtable, khul ke",
    "og:title": "Online RoundTable Discussions | Video | Khul Ke",
    "og:description":
      "Host and view online RoundTable Discussions. Make your very own audio-visual content. Conduct a conversation. Host private meetings, lectures and more. Explore and contribute to a variety of topics.",
    "twitter:title": "Online RoundTable Discussions | Video | Khul Ke",
    "twitter:description":
      "Host and view online RoundTable Discussions. Make your very own audio-visual content. Conduct a conversation. Host private meetings, lectures and more. Explore and contribute to a variety of topics.",
  },

  "roundtable/live": {
    title: "Live RoundTable Discussions | Khul Ke",
    description:
      "Participate in live RoundTable Discussions, share your thoughts and ask questions. Join the conversation and express yourself Khul Ke.",
    keywords:
      "roundtable, live roundtable discussion, live RoundTable Discussions, live online roundtable",
    "og:title": "Live RoundTable Discussions | Khul Ke",
    "og:description":
      "Participate in live RoundTable Discussions, share your thoughts and ask questions. Join the conversation and express yourself Khul Ke.",
    "twitter:title": "Live RoundTable Discussions | Khul Ke",
    "twitter:description":
      "Participate in live RoundTable Discussions, share your thoughts and ask questions. Join the conversation and express yourself Khul Ke.",
  },

  "roundtable/mine": {
    title: "RoundTable Discussions | Khul Ke",
    description:
      "Find all your RoundTable Discussions in one place, share your thoughts and ask questions. Join the conversation and express yourself Khul Ke.",
    keywords:
      "roundtable, roundtable discussion, RoundTable Discussions, online roundtable",
    "og:title": "RoundTable Discussions | Khul Ke",
    "og:description":
      "Find all your RoundTable Discussions in one place, share your thoughts and ask questions. Join the conversation and express yourself Khul Ke.",
    "twitter:title": "RoundTable Discussions | Khul Ke",
    "twitter:description":
      "Find all your RoundTable Discussions in one place, share your thoughts and ask questions. Join the conversation and express yourself Khul Ke.",
  },

  "roundtable/upcoming": {
    title: "Upcoming | RoundTable Discussions | Khul Ke",
    description:
      "Stay updated on Upcoming RoundTable Discussions on Khul Ke. Share thoughts, opinions, observations and ask questions to moderators and panelists. ",
    keywords:
      "roundtable, roundtable discussion, upcoming RoundTable Discussions, online upcoming roundtable",
    "og:title": "Upcoming | RoundTable Discussions | Khul Ke",
    "og:description":
      "Stay updated on Upcoming RoundTable Discussions on Khul Ke. Share thoughts, opinions, observations and ask questions to moderators and panelists. ",
    "twitter:title": "Upcoming | RoundTable Discussions | Khul Ke",
    "twitter:description":
      "Stay updated on Upcoming RoundTable Discussions on Khul Ke. Share thoughts, opinions, observations and ask questions to moderators and panelists.",
  },

  "notifications/interaction": {
    title: "Interaction on Khul Ke | Social Networking Platform in India",
    description:
      "View your Khul Ke interaction history and keep a track of all your activity.",
    keywords: "interaction, khul ke, comments, messaging, post, khul ke post",
    "og:title": "Interaction on Khul Ke - Social Networking Platform in India",
    "og:description":
      "View your Khul Ke interaction history and keep a track of all your activity.",
    "twitter:title":
      "Interaction on Khul Ke - Social Networking Platform in India",
    "twitter:description":
      "View your Khul Ke interaction history and keep a track of all your activity.",
  },

  "notifications/network": {
    title: "Create Our Own Networks on Khul Ke",
    description:
      "Get notified when someone follows you and keep track of all the followers.",
    keywords: "profiles, networks, notification",
    "og:title": "Create Our Own Networks on Khul Ke",
    "og:description":
      "Get notified when someone follows you and keep track of all the followers.",
    "twitter:title": "Create Our Own Networks on Khul Ke",
    "twitter:description":
      "Get notified when someone follows you and keep track of all the followers.",
  },

  "roundtable/notifications": {
    title: "RoundTable Notification | Khul Ke",
    description:
      "Get all your RoundTable notifications and keep track of your invites. ",
    keywords: "notification",
    "og:title": "Roundtable Notification | Khul Ke",
    "og:description":
      "Get all your RoundTable notifications and keep track of your invites. ",
    "twitter:title": "Roundtable Notification | Khul Ke",
    "twitter:description":
      "Get all your RoundTable notifications and keep track of your invites.",
  },

  settings: {
    title: "Settings | Khul Ke",
    description:
      "Customize your personal details. Update / Change your password and other settings.",
    keywords: "",
    "og:title": "Settings | Khul Ke",
    "og:description":
      "Customize your personal details. Update / Change your password and other settings.",
    "twitter:title": "Settings | Khul Ke",
    "twitter:description":
      "Customize your personal details. Update / Change your password and other settings.",
  },

  invite_friends: {
    title: "Invite Friends on Khul Ke | Social Media Platform",
    description:
      "Build your very own Khul Ke community by inviting your friends and family.",
    keywords: "",
    "og:title": "Invite Friends on Khul Ke | Social Media Platform",
    "og:description":
      "Build your very own Khul Ke community by inviting your friends and family.",
    "twitter:title": "Invite Friends on Khul Ke | Social Media Platform",
    "twitter:description":
      "Build your very own Khul Ke community by inviting your friends and family.",
  },

  privacy_settings: {
    title: "Privacy Settings | Khul Ke",
    description:
      "Choose to reveal or protect information of your choice. Khul Ke values your privacy.",
    keywords: "",
    "og:title": "Privacy Settings | Khul Ke",
    "og:description":
      "Choose to reveal or protect information of your choice. Khul Ke values your privacy.",
    "twitter:title": "Privacy Settings | Khul Ke",
    "twitter:description":
      "Choose to reveal or protect information of your choice. Khul Ke values your privacy.",
  },

  muted_words: {
    title: "Muted Words | Khul Ke",
    description:
      "Khul Ke protects users from profanity and abusive language by sensoring it.",
    keywords: "",
    "og:title": "Muted Words| Khul Ke",
    "og:description":
      "Khul Ke protects users from profanity and abusive language by sensoring it.",
    "twitter:title": "Muted Words | Khul Ke",
    "twitter:description":
      "Khul Ke protects users from profanity and abusive language by sensoring it.",
  },

  muted_accounts: {
    title: "Muted Accounts | Khul Ke",
    description:
      "Khul Ke protects you from malicious content by allowing you to mute abusers and trolls.",
    keywords: "",
    "og:title": "Muted Accounts | Khul Ke",
    "og:description":
      "Khul Ke protects you from malicious content by allowing you to mute abusers and trolls.",
    "twitter:title": "Muted Accounts | Khul Ke",
    "twitter:description":
      "Khul Ke protects you from malicious content by allowing you to mute abusers and trolls.",
  },

  blocked_accounts: {
    title: "Blocked Accounts | Khul Ke",
    description:
      "Khul Ke protects you from malicious content by blocking abusers and trolls for a seamless experience.",
    keywords: "blocked accounts",
    "og:title": "Blocked Accounts | Khul Ke",
    "og:description":
      "Khul Ke protects you from malicious content by blocking abusers and trolls for a seamless experience.",
    "twitter:title": "Blocked Accounts | Khul Ke",
    "twitter:description":
      "Khul Ke protects you from malicious content by blocking abusers and trolls for a seamless experience.",
  },

  faqs: {
    title: "Frequently Asked Questions | Khul Ke",
    description:
      "Refer to Khul Ke FAQs for answers to any questions you may have.",
    keywords: "",
    "og:title": "Frequently Asked Questions | Khul Ke",
    "og:description":
      "Refer to Khul Ke FAQs for answers to any questions you may have.",
    "twitter:title": "Frequently Asked Questions | Khul Ke",
    "twitter:description":
      "Refer to Khul Ke FAQs for answers to any questions you may have.",
  },

  "community-guidelines": {
    title: "Community Guidelines | Khul Ke",
    description:
      "Khul Ke community guidelines communicates various rules and regulations eshtablished by the platform to keep user experience as seamless as possible.",
    keywords: "",
    "og:title": "Community Guidelines | Khul Ke",
    "og:description":
      "Khul Ke community guidelines communicates various rules and regulations eshtablished by the platform to keep user experience as seamless as possible.",
    "twitter:title": "Community Guidelines | Khul Ke",
    "twitter:description":
      "Khul Ke community guidelines communicates various rules and regulations eshtablished by the platform to keep user experience as seamless as possible.",
  },

  disclaimers: {
    title: "Disclaimer | Khul Ke",
    description:
      "Disclaimer - We reserve all rights to remove any content that violates the terms and conditions of Khul Ke",
    keywords: "disclaimer",
    "og:title": "Disclaimer | Khul Ke",
    "og:description":
      "Disclaimer - We reserve all rights to remove any content that violates the terms and conditions of Khul Ke",
    "twitter:title": "Disclaimer | Khul Ke",
    "twitter:description":
      "Disclaimer - We reserve all rights to remove any content that violates the terms and conditions of Khul Ke",
  },

  support: {
    title: "Support | Khul Ke",
    description:
      "For any query / help / support related to Khul Ke, contact support@khulke.com.",
    keywords: "",
    "og:title": "Support | Khul Ke",
    "og:description":
      "For any query / help / support related to Khul Ke, contact support@khulke.com.",
    "twitter:title": "Support | Khul Ke",
    "twitter:description":
      "For any query / help / support related to Khul Ke, contact support@khulke.com.",
  },

  "terms-conditions": {
    title: "Terms and Conditions | Khul Ke",
    description:
      "Refer to the Khul Ke terms and conditions for more informations. ",
    keywords: "terms-conditions",
    "og:title": "Terms and Conditions | Khul Ke",
    "og:description":
      "Refer to the Khul Ke terms and conditions for more informations. ",
    "twitter:title": "Terms and Conditions | Khul Ke",
    "twitter:description":
      "Refer to the Khul Ke terms and conditions for more informations. ",
  },

  "privacy-policy": {
    title: "Privacy Policy | Khul Ke",
    description: "Privacy Policy of Khul Ke",
    keywords: "privacy policy",
    "og:title": "Privacy Policy | Khul Ke",
    "og:description": "Privacy Policy of Khul Ke",
    "twitter:title": "Privacy Policy | Khul Ke",
    "twitter:description": "Privacy Policy of Khul Ke",
  },
};
