import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function EventsView() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const calendarId = params.calendarId;
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const day = searchParams.get('day');
  console.log(searchParams);

  return (
    <div>
      {calendarId}/{year}/{month}/{day}
    </div>
  );
}

export default EventsView;
