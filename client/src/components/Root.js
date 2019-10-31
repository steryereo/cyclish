import React, { useEffect, useState } from 'react';
import axios from 'axios';

// import poweredByStravaHorizontal from 'api_logo_pwrdBy_strava_horiz_gray.svg';
import ActivityList from './ActivityList';
import ListActions from './ListActions';
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

const batchUpdateBikes = ({ e, activityIds, gearId, setIsBusy, updateActivities }) => {
  setIsBusy(activityIds, true);

  axios
    .patch('/api/activities/batch', { gear_id: gearId, activity_ids: activityIds })
    .then(({ data }) => {
      // updateActivity(data);
      console.log(data);
      setIsBusy(activityIds, false);
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

  const setActivityStateFlags = (activityIds, flag, value) => {
    const updatedActivityStates = activityIds.reduce((acc, id) => {
      const activityState = activityStates[id] || {};
      return { ...acc, [id]: { ...activityState, [flag]: value } };
    }, activityStates);

    setActivityStates(updatedActivityStates);
  };

  const setIsBusy = (activity, isBusy) =>
    Array.isArray(activity)
      ? setActivityStateFlags(activity, 'isBusy', isBusy)
      : setActivityStateFlag(activity, 'isBusy', isBusy);
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
    <div className="container mx-auto flex flex-row justify-center p-10">
      <div>
        <UserCard user={user} />
        <ListActions activityStates={activityStates} />
        <button
          className="rounded bg-strava-gray-light px-1"
          onClick={e => {
            const activityIds = Object.keys(activityStates).filter(
              id => activityStates[id] && activityStates[id].isChecked
            );
            batchUpdateBikes({ e, activityIds, gearId: user.bikes[0].id, setIsBusy });
          }}
          type="button"
        >
          test update checked
        </button>
        <ActivityList
          activities={activities}
          activityStates={activityStates}
          bikes={user.bikes}
          onCheck={(e, activity) => setIsChecked(activity, e.target.checked)}
          onChange={(e, activity) => handleBikeChange({ e, activity, setIsBusy, updateActivity })}
        />
      </div>
    </div>
  );
};

export default Root;
