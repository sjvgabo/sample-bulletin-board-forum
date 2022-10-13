import { observer } from "mobx-react-lite";
import React from "react";
import User from "../models/User";

type Props = {
  user: User;
}

const ProfileDetails:React.FC<Props> = ({user}) => {
  return (
    <div className="flex flex-col">
      <div>
        <span className="text-lg font-semibold">Profile Details</span>
      </div>
      <div>
        <span>About myself: {user.about_myself}</span>
      </div>
      <div>
        <span>Birthdate: {user.date_of_birth.toString()}</span>
      </div>
      <div>
        <span>Hometown: {user.hometown}</span>
      </div>
      <div>
        <span>Present Location: {user.present_location}</span>
      </div>
      <div>
        <span>Gender: {user.gender}</span>
      </div>
      <div>
        <span>Interests: {user.interests}</span>
      </div>
      <div>
        <span>Website: {user.website}</span>
      </div>
    </div>
  );
}

export default observer(ProfileDetails);