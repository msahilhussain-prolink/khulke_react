import { Grid } from "@mui/material";
import DocsContainer from "../../../Post/AddPostDialog/DocsContainer";

export default function RaiseHandDocumentContainer(props) {
  //props destructuring here
  const { doc, setDoc } = props;

  return (
    <>
      <Grid item xs={12}>
        <DocsContainer
          excelDoc={doc.type === "xls" && doc.name}
          docsFile={doc.type === "pdf" && doc.name}
          docsFilePath={doc.url}
          handle={true}
          pptDoc={doc.type === "ppt" && doc.name}
          wordDoc={doc.type === "doc" && doc.name}
        />
      </Grid>
    </>
  );
}
