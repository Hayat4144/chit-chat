import moment from 'moment';
const formatLastSeen = (lastSeen: Date) => {
  const currentTime = moment();
  const lastSeenTime = moment(lastSeen);

  const minutesDiff = currentTime.diff(lastSeenTime, 'minutes');
if (minutesDiff < 60 && minutesDiff >= 1) {
    return `${minutesDiff} minutes ago`;
  } else if (minutesDiff < 60) {
    return 'few minutes ago';
  } else if (minutesDiff < 1440) {
    return lastSeenTime.format('HH:mm'); // Format as 10:34
  } else if (lastSeenTime.isSame(currentTime, 'day')) {
    return 'Today at ' + lastSeenTime.format('HH:mm'); // Format as Today at 10:34
  } else if (lastSeenTime.isSame(currentTime.clone().subtract(1, 'day'), 'day')) {
    return 'Yesterday at ' + lastSeenTime.format('HH:mm'); // Format as Yesterday at 10:34
  } else {
    return lastSeenTime.calendar(); // Format as specific date and time
  }
};

export default formatLastSeen;
