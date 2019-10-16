import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ActivityList from './ActivityList';
import UserCard from './UserCard';

import '../styles/base.css';

const handleBikeChange = ({ e, activity, setIsBusy, updateActivity }) => {
  setIsBusy(activity, true);

  axios
    .patch(`/api/activities/${activity.id}`, { gear_id: e.target.value })
    .then(({ data }) => {
      updateActivity(data);
      setIsBusy(activity, false);
    })
    .catch(err => console.error(err));
};

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
    <div className="container mx-auto">
      <UserCard user={user} />
      <ActivityList
        activities={activities}
        activityStates={activityStates}
        bikes={user.bikes}
        onCheck={(e, activity) => setIsChecked(activity, e.target.checked)}
        onChange={(e, activity) => handleBikeChange({ e, activity, setIsBusy, updateActivity })}
      />
    </div>
  );
};

export default Root;
