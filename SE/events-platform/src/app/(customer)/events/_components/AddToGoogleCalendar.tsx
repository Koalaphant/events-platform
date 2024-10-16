interface Event {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
}

export default function AddToGoogleCalendar({ event }: { event: Event }) {
  const { title, description, location, startTime, endTime } = event;

  const googleCalendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
    title
  )}
      &details=${encodeURIComponent(description)}
      &location=${encodeURIComponent(location)}
      &dates=${formatDateForGoogle(startTime)}/${formatDateForGoogle(endTime)}`;

  function formatDateForGoogle(date: Date) {
    return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  }

  return (
    <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
      Add to Google Calendar
    </a>
  );
}
