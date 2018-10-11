import React from 'react';

import BigCalendar from 'react-big-calendar';
import './Weeks.css';

const WeeksView = props => {
  const resourceMap = [
    { resourceId: 1, resourceTitle: 'Conference Room #1' },
    { resourceId: 2, resourceTitle: 'Conference Room #2' },
  ];
  return (
    <div className="weeks-container">
      <BigCalendar
        selectable
        events={props.events[0]}
        views={['work_week']}
        step={props.step}
        defaultView={BigCalendar.Views.WORK_WEEK}
        min={props.minDate} // 9 a.m.
        max={props.maxDate} // 6 p.m.
        localizer={props.localizer}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={props.handleSelect('week')}
        timeslots={props.timeSlots}
        resources={resourceMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
      />
    </div>
  );
};

export default WeeksView;
