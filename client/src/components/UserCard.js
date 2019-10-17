import React from 'react';

const getFullName = ({ firstname, lastname }) => `${firstname} ${lastname}`;

const UserCard = ({ user }) => (
  <div className="flex items-center bg-gray-200 p-5 rounded-t">
    <img className="rounded w-20" alt={getFullName(user)} src={user.profile_medium} />
    <h4 className="ml-5">{getFullName(user)}</h4>
  </div>
);

export default UserCard;
