import React, { useState } from 'react';
import BikeSelect from './BikeSelect';

const getIdsWithFlag = (activityStates, flag) =>
  Object.keys(activityStates).filter(id => activityStates[id][flag]);

const ListActions = ({ activityStates, onUpdateClick, bikes }) => {
  const [currentBikeId, setCurrentBikeId] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const checkedIds = getIdsWithFlag(activityStates, 'isChecked');
  const disabled = isBusy || !!getIdsWithFlag(activityStates, 'isBusy').length; // disable updates if any individual rides are currently updating

  return (
    <div className="sticky top-0 w-full p-2 bg-white">
      {`${checkedIds.length} rides selected`}
      <BikeSelect
        bikes={bikes}
        currentBikeId={currentBikeId}
        disabled={disabled}
        onChange={e => setCurrentBikeId(e.target.value)}
      />
      <button
        className="rounded bg-strava-gray-light px-1"
        disabled={disabled}
        onClick={e => {
          onUpdateClick({ activityIds: checkedIds, gearId: currentBikeId, setIsBusy });
        }}
        type="button"
      >
        update
      </button>
    </div>
  );
};

export default ListActions;
