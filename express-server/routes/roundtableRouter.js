import express from "express";
import {
  getRoundtable,
  getRecordedRt,
} from "../controllers/roundtableController.js";
import { DEFAULT_META_TAGS, metaData } from "../EnvFiles/Env.js";

const roundtableRouter = express.Router();

roundtableRouter.get("/", getRoundtable);
roundtableRouter.get("/recorded/:id", getRecordedRt);

//for static pages
roundtableRouter.get("*", (req, res) => {
  const completePath = req.originalUrl.substring(1);
  const pathMetaData = metaData[completePath];

  if (!pathMetaData) {
    return res.render("index_main", DEFAULT_META_TAGS);
  }
  const { title, description, keywords } = pathMetaData;
  let image = DEFAULT_META_TAGS.image;
  res.render("index_main", { title, description, keywords, image });
});

export default roundtableRouter;
