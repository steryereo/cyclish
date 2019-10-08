import React from 'react';
import ActivityListItem from './ActivityListItem';

const ActivityList = ({ activities = [], bikes = [], onChange, onCheck, activityStates }) => (
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

export default ActivityList;
