import React from "react";
import UserProfile from "../UserProfile";

export default function CommonPerson({ person }) {
  return (
    <div
      className="container-fluid d-flex justify-content-start pb-3"
      id="person_button"
    >
      <UserProfile username={person.username} className="avatar" />
      &emsp;
      <div className="cmnPer">
        <strong className="cmnPerName">{person.name}</strong>
        <strong className="cmnPerName">@{person.username}</strong>
      </div>
    </div>
  );
}
