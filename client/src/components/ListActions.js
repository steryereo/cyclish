import React from 'react';

const getCheckedCount = activityStates =>
  Object.keys(activityStates).filter(key => activityStates[key].isChecked).length;

const ListActions = ({ activityStates }) => (
  <div className="sticky w-full">{getCheckedCount(activityStates)}</div>
);

export default ListActions;
