import React from 'react';

import { format } from 'date-fns';
import BikeSelect from './BikeSelect';
import Loader from './Loader';

const getMapImgSrc = polyline =>
  `https://maps.googleapis.com/maps/api/staticmap?size=100x100&maptype=terrain&path=enc:${polyline}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

const ActivityListItem = ({
  activity,
  bikes,
  itemState = { isBusy: false, isChecked: false },
  onChange,
  onCheck
}) => (
  <li className="p-4 my-4 flex items-center justify-between w-full rounded-lg shadow-md bg-white">
    <div className="text-lg flex items-center">
      {itemState.isBusy ? (
        <Loader className="icon-baseline-fix text-strava-orange " />
      ) : (
        <input
          className="outline-none focus:shadow-outline"
          type="checkbox"
          value={activity.id}
          checked={itemState.isChecked}
          disabled={itemState.isBusy}
          onChange={e => onCheck(e, activity)}
        />
      )}
      <div className="ml-3">
        <div className="flex-auto text-gray-900 text-lg">{activity.name}</div>
        <div className="text-gray-600 font-bold text-xs">
          {format(new Date(activity.start_date_local), 'Pp')}
        </div>
      </div>
    </div>
    <div>
      <BikeSelect
        currentBikeId={activity.gear_id}
        disabled={itemState.isBusy}
        bikes={bikes}
        onChange={e => onChange(e, activity)}
      />
    </div>
    <img
      className="hidden sm:block"
      alt={`Map of activity: ${activity.name}`}
      src={getMapImgSrc(activity.map.summary_polyline)}
    />
  </li>
);

export default ActivityListItem;
