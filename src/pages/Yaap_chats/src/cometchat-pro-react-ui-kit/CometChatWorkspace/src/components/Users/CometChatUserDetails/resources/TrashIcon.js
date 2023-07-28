import React from "react";

const TrashIcon = ({
    width = "12.528",
    height = "14.094",
    color= "#bc0000",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12.528 14.094"
    >
      <path
        id="delete_FILL0_wght400_GRAD0_opsz48"
        d="M161.977,230.094a1.178,1.178,0,0,1-1.174-1.174V217.762H160v-1.174h3.68V216h5.168v.587h3.68v1.174h-.8v11.158a1.2,1.2,0,0,1-1.174,1.174Zm8.574-12.332h-8.574v11.158h8.574Zm-6.5,9.474h1.174v-7.81h-1.174Zm3.249,0h1.174v-7.81H167.3Zm-5.324-9.474v0Z"
        transform="translate(-160 -216)"
        fill={color}
      />
    </svg>
  );
};

export default TrashIcon;
