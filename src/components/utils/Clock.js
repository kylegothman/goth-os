import React, { useState, useEffect } from 'react';

const Clock = ({ onlyTime, onlyDay }) => {
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [hour12, setHour12] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = setInterval(() => {
      setCurrentTime(new Date());
    }, 10 * 1000);

    return () => {
      clearInterval(updateTime);
    };
  }, []);

  const day = dayList[currentTime.getDay()];
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  const month = monthList[currentTime.getMonth()];
  const date = currentTime.getDate().toLocaleString();
  const meridiem = hour < 12 ? 'AM' : 'PM';

  if (minute.toLocaleString().length === 1) {
    minute = '0' + minute;
  }

  if (hour12 && hour > 12) {
    hour -= 12;
  }

  let displayTime;
  if (onlyTime) {
    displayTime = `${hour}:${minute} ${meridiem}`;
  } else if (onlyDay) {
    displayTime = `${day} ${month} ${date}`;
  } else {
    displayTime = `${day} ${month} ${date} ${hour}:${minute} ${meridiem}`;
  }

  return <span className='font-vt323 text-xl'>{displayTime}</span>;
};

export default Clock;