import React from 'react';

const getFullName = ({ firstname, lastname }) => `${firstname} ${lastname}`;

const UserCard = ({ user }) => (
  <div>
    <img alt={getFullName(user)} src={user.profile_medium} />
    <h4>{getFullName(user)}</h4>
  </div>
);

export default UserCard;
