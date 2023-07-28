import React from "react";
import { Helmet } from "react-helmet";
const toHoursAndMinutes = (totalSeconds) => {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { h: hours, m: minutes, s: seconds };
};
export const VideoSchema = ({
  name,
  description,
  thumbnailURL,
  uploadDate,
  duration,
  contentUrl,
}) => {
  const timeDue = toHoursAndMinutes(duration);
  const hour = timeDue?.h !== 0 ? `${timeDue.h}H` : "";
  const minute = timeDue?.m !== 0 ? `${timeDue.m}M` : "";
  const sec = timeDue?.s !== 0 ? parseInt(timeDue?.s): 0
  return (
    <Helmet>
      <script type="application/ld+json">
    {`"@context":"http://schema.org",
      "@type":"VideoObject",
      "name": ${name},
      "description":${description},
      "thumbnailURL":${thumbnailURL},
      "uploadDate": ${uploadDate},
      "duration": "PT${hour}${minute}${sec}S",
      "contentUrl":${contentUrl} 
    `}
      </script>
    </Helmet>
  );
};
