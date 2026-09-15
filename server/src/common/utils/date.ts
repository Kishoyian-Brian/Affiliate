export function addHours(from: Date, hours: number) {
  return new Date(from.getTime() + hours * 60 * 60 * 1000);
}

export function isPast(value: Date) {
  return value.getTime() <= Date.now();
}
