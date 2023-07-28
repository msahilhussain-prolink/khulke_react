import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { copyFileSync } from "fs";
import { fetchAnonymousUser } from "./ExternalApiCalls/LoginAnonymousUser.js";
import { DEFAULT_META_TAGS, metaData } from "./EnvFiles/Env.js";

import roundtableRouter from "./routes/roundtableRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
/*Define path for express*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __publicdir = path.join(__dirname, "../build");
const viewpath = path.join(__dirname, "../build");

/*initialize app*/
const app = express();
const port = process.env.PORT || 3000;

app.get("", (req, res) => {
  res.render("index_main", DEFAULT_META_TAGS);
});

/*set public static directory to serve*/
app.use(express.static(__publicdir));

/*set handlebar templating language and views engine*/
app.set("view engine", "hbs");
app.set("views", [viewpath]);

//for roundtable and past roundtable links\

app.use("/roundtable", roundtableRouter);

//for profile
app.use("/profile", userRouter);

//for postid
app.use("/post", postRouter);

//for static pages
app.get("*", (req, res) => {
  const completePath = req.originalUrl.substring(1);
  const pathMetaData = metaData[completePath];

  if (!pathMetaData) {
    return res.render("index_main", DEFAULT_META_TAGS);
  }
  const { title, description, keywords } = pathMetaData;
  let image = DEFAULT_META_TAGS.image;
  res.render("index_main", { title, description, keywords, image });
});

/*start app*/

async function startApp() {
  //copying html file as a hbs file
  try {
    copyFileSync(
      path.join(__dirname, "../build/index.html"),
      path.join(__dirname, "../build/index_main.hbs")
    );
  } catch (e) {
    console.log(e);
  }

  try {
    const res = await fetchAnonymousUser();
    if (!res) console.log("could not log in anonymous user");
  } catch (e) {
    console.log(e);
  }

  return app.listen(port, () => {
    //starting the app
    console.log("App running at port " + port);
  });
}

try {
  await startApp();
} catch (e) {
  console.log(e);
}
