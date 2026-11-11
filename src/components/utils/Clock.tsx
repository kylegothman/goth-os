import { useState, useEffect } from 'react';

interface ClockProps {
  onlyTime?: boolean;
  onlyDay?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Clock({ onlyTime, onlyDay }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10 * 1000);
    return () => clearInterval(id);
  }, []);

  const day = DAYS[now.getDay()];
  const month = MONTHS[now.getMonth()];
  const date = now.getDate();
  const hours24 = now.getHours();
  const hour = hours24 % 12 || 12; // 0 and 12 both display as 12
  const minute = now.getMinutes().toString().padStart(2, '0');
  const meridiem = hours24 < 12 ? 'AM' : 'PM';

  const time = `${hour}:${minute} ${meridiem}`;
  const dayText = `${day} ${month} ${date}`;
  const displayTime = onlyTime ? time : onlyDay ? dayText : `${dayText} ${time}`;

  return <span className="font-vt323 text-xl">{displayTime}</span>;
}
