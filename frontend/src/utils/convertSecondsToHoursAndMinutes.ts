export function convertSecondsToHoursAndMinutes(seconds: number) {
  const totalMinutes = Math.round(seconds / 60);

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  return `${totalMinutes}m`;
}
