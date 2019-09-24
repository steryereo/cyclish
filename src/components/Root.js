import React, {useEffect, useState} from 'react'
import axios from 'axios';


const ActivitiesList = ({activities=[]}) => (
  <ul>
    {activities.map(activity => (
      <li key={activity.id}>{activity.name}</li>
    ))}
  </ul>
)

const Root = () => {
  const [activities, setActivities] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios('/api/activities').then(({data}) => {
      const {activities, user} = data;
      setActivities(activities);
      setUser(user);
    });
  }, []);

  return (
    <div>
      {user && user.bikes.map(bike => <p>{'Bike: '}{bike.name}</p>)}
      {activities ? <ActivitiesList activities={activities} /> : "loading..."}
    </div>
  );
};

export default Root;
