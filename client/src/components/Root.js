import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import '../styles/base.css';

const handleChange = ({ e, activity, setIsBusy, updateActivity }) => {
  setIsBusy(activity, true);

  axios
    .patch(`/api/activities/${activity.id}`, { gear_id: e.target.value })
    .then(({ data }) => {
      updateActivity(data);
      setIsBusy(activity, false);
    })
    .catch(err => console.error(err));
};

const BikeSelect = ({ activity, bikes, onChange, disabled }) => (
  <select
    disabled={disabled}
    onChange={e => onChange(e, activity)}
    value={activity.gear_id || 'none'}
  >
    <option value="none">none</option>
    {bikes.map(bike => (
      <option key={bike.id} value={bike.id}>
        {bike.name}
      </option>
    ))}
  </select>
);

const ActivityListItem = ({
  activity,
  bikes,
  itemState = { isBusy: false, isChecked: false },
  onChange,
  onCheck
}) => (
  <li>
    <input
      type="checkbox"
      value={activity.id}
      checked={itemState.isChecked}
      disabled={itemState.isBusy}
      onChange={e => onCheck(e, activity)}
    />
    <span className="date">{format(new Date(activity.start_date_local), 'Pp')}</span>
    {activity.name}
    <BikeSelect activity={activity} disabled={itemState.isBusy} bikes={bikes} onChange={onChange} />
  </li>
);

const ActivitiesList = ({ activities = [], bikes = [], onChange, onCheck, activityStates }) => (
  <ul>
    {activities.map(activity => (
      <ActivityListItem
        key={activity.id}
        activity={activity}
        bikes={bikes}
        itemState={activityStates[activity.id]}
        onChange={onChange}
        onCheck={onCheck}
      />
    ))}
  </ul>
);

const getFullName = ({ firstname, lastname }) => `${firstname} ${lastname}`;

const UserCard = ({ user }) => (
  <div>
    <img alt={getFullName(user)} src={user.profile_medium} />
    <h4>{getFullName(user)}</h4>
  </div>
);

const Root = () => {
  const [activities, setActivities] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activityStates, setActivityStates] = useState(null);

  const initActivityStates = initActivities =>
    setActivityStates(
      initActivities.reduce(
        (acc, activity) => ({
          ...acc,
          [activity.id]: { isBusy: false, isChecked: false }
        }),
        {}
      )
    );

  const setActivityStateFlag = (activity, flag, value) => {
    const activityState = activityStates[activity.id] || {};
    setActivityStates({
      ...activityStates,
      [activity.id]: { ...activityState, [flag]: value }
    });
  };

  const setIsBusy = (activity, isBusy) => setActivityStateFlag(activity, 'isBusy', isBusy);
  const setIsChecked = (activity, isChecked) =>
    setActivityStateFlag(activity, 'isChecked', isChecked);

  const updateActivity = updatedActivity =>
    setActivities(
      activities.map(activity => (activity.id === updatedActivity.id ? updatedActivity : activity))
    );

  useEffect(() => {
    axios('/api/activities')
      .then(({ data }) => {
        const { activities, user } = data;
        setActivities(activities);
        initActivityStates(activities);
        setUser(user);
      })
      .catch(err => setError(err));
  }, []);

  if (!(activities && activityStates && user)) return 'Loading...';
  if (error) return error;

  return (
    <div>
      <UserCard user={user} />
      <ActivitiesList
        activities={activities}
        activityStates={activityStates}
        bikes={user.bikes}
        onCheck={(e, activity) => setIsChecked(activity, e.target.checked)}
        onChange={(e, activity) => handleChange({ e, activity, setIsBusy, updateActivity })}
      />
    </div>
  );
};

export default Root;
