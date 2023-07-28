import { db } from "../../push_firebase";

var alldata = [];

export const getPostData = (rt_id) => {
  db.collection("roundtable")
    .doc(rt_id)
    .collection("messages")
    .orderBy("created_at", "asc")
    .onSnapshot((snapshot) => {
      alldata = [];
      snapshot.forEach((doc) => {
        // alldata.push({ data: doc.data() });
        return doc.data();
      });
    });
};
