export function leftUntil(timestamp) {
  const secondsLeft = timestamp - Math.floor(Date.now() / 1000);
  if (secondsLeft <= 0) return 'finished';

  let minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;

  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;
  return `${minutes}:${seconds}`;
}
