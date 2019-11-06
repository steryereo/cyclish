import React from 'react';

import { format } from 'date-fns';
import BikeSelect from './BikeSelect';

const getMapImgSrc = polyline =>
  `https://maps.googleapis.com/maps/api/staticmap?size=100x100&maptype=terrain&path=enc:${polyline}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

const ActivityListItem = ({
  activity,
  bikes,
  itemState = { isBusy: false, isChecked: false },
  onChange,
  onCheck
}) => (
  <li className="py-2">
    <input
      type="checkbox"
      value={activity.id}
      checked={itemState.isChecked}
      disabled={itemState.isBusy}
      onChange={e => onCheck(e, activity)}
    />
    <span className="bg-gray-500 text-white rounded-full px-2 py-1 flex-auto ml-2 text-xs">
      {format(new Date(activity.start_date_local), 'Pp')}
    </span>
    <span className="flex-auto mx-2 text-gray-900">{activity.name}</span>
    <span className="flex-auto">
      <BikeSelect
        currentBikeId={activity.gear_id}
        disabled={itemState.isBusy}
        bikes={bikes}
        onChange={e => onChange(e, activity)}
      />
    </span>
    <img
      alt={`Map of activity: ${activity.name}`}
      src={getMapImgSrc(activity.map.summary_polyline)}
    />
  </li>
);

export default ActivityListItem;
