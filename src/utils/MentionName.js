function getHashTags(inputText, symbol) {
    const hash_regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    const at_regex = /(?:^|\s)(?:@)([a-zA-Z._-\d]+)/gm;
    let use_reg = null;
    if (symbol === "@") {
      use_reg = at_regex;
    } else {
      use_reg = hash_regex;
    }
    const matches = [];
    let match;
    while ((match = use_reg.exec(inputText))) {
      matches.push(match[1]);
    }

    return matches;
  }

const hash_driver = (text, isPostText= false) => {
    let text_temp = text;
    const tags = getHashTags(text, "@");
    tags.forEach((item) => {
      text_temp = text_temp?.replace(
        "@" + item,
        `<a style="color: #009AD3;text-decoration: none;" href="/profile/${item}/posts"
        rel="noopener noreferrer">@${item}</a>`
      );
    });
    return !isPostText ?`<b>${text_temp}</b>`: text_temp;
  };

  export const MentionName = (mentionNameArray, text, isPostText ) => {
    let arrayofText = text.split(" ");
    let stringData = ""
    mentionNameArray?.forEach((user) => {
      if (arrayofText.find((text) => `F1e5&DG{${user.user_id}}` === text)) {
        arrayofText = arrayofText?.map((text) => {
          if (text === `F1e5&DG{${user.user_id}}`) {
            return `@${user.username}`
          }
          return text;
        })
      }
    })
    stringData = arrayofText?.map((ele) => ele).join(" ");
    return hash_driver(stringData, isPostText);
  }