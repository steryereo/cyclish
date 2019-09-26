import React, {useEffect, useState} from 'react'
import axios from 'axios';

const handleChange = ({e, activity, setIsBusy, updateActivity}) => {
  console.log(e, activity)
  const gear_id = e.target.value;
  axios.patch(`/api/activities/${activity.id}`, {gear_id})
    .then(({data}) => updateActivity(data))
    .catch(err => console.error(err))
}

const BikeSelect = ({activity, bikes, onChange}) => (
  <select onChange={e => onChange(e, activity)} value={activity.gear_id}>
    {bikes.map(bike => (
      <option key={bike.id} value={bike.id}>
        {bike.name}
      </option>
    ))}
  </select>
);

const ActivitiesList = ({activities=[], bikes=[], onChange}) => (
  <ul>
    {activities.map(activity => (
      <li key={activity.id}>{activity.name}
        <BikeSelect activity={activity} bikes={bikes} onChange={onChange}/>
      </li>
    ))}
  </ul>
)

const UserCard = ({user}) => (
  <div>
    <img src={user.profile_medium} />
    <h4>{`${user.firstname} ${user.lastname}`}</h4>
  </div>
)

const Root = () => {
  const [activities, setActivities] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const updateActivity = updatedActivity => setActivities(activities.map(activity => (
    activity.id === updatedActivity.id ? updatedActivity : activity
  )));

  useEffect(() => {
    axios('/api/activities')
      .then(({data}) => {
        const {activities, user} = data;
        setActivities(activities);
        setUser(user);
      })
      .catch(err => setError(err));
  }, []);

  if (!(activities && user)) return 'Loading...';
  if (error) return error;

  return (
    <div>
      <UserCard user={user} />
      <ActivitiesList activities={activities} bikes={user.bikes} onChange={(e, activity) => handleChange({e, activity, updateActivity})}/>
    </div>
  );
};

export default Root;
