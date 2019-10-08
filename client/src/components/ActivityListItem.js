import React from 'react';

import { format } from 'date-fns';
import BikeSelect from './BikeSelect';

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

export default ActivityListItem;
