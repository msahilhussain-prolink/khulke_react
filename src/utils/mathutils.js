export const percentToNum = (percent, total) => {
  return Math.round((percent * total) / 100);
};

export const numToPercent = (num, total) => {
  return (num * 100) / total;
};

export const ReturnEndTime = (val, parentType) => {
  if (["K3","BKK"].includes(parentType)) {
     if (val < 180) {
       return val;
     } else {
       return 180;
     }
    
  } else {
     if (val < 150) {
       return val;
     } else {
       return 150;
     }
  }
   
};
