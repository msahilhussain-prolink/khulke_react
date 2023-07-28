import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { POST_API_BASE_URL } from "../../constants/env";

function MyApp() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={`${POST_API_BASE_URL}/post-media/media/616feced13b4159106c9c95e`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
