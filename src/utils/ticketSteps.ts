
export function getProductFruitsPlanPrice(ticketsPerMonth: number) {
  if (ticketsPerMonth <= 1500) return 139;
  if (ticketsPerMonth <= 3000) return 189;
  if (ticketsPerMonth <= 5000) return 259;
  if (ticketsPerMonth <= 10000) return 339;
  if (ticketsPerMonth <= 50000) return 439;
  return 599;
}

export const TICKET_STEPS = [...Array.from({
  length: (1500 - 100) / 100 + 1
}, (_, i) => 100 + i * 100), ...Array.from({
  length: (3000 - 1500) / 500
}, (_, i) => 1500 + (i + 1) * 500), ...Array.from({
  length: (5000 - 3000) / 1000
}, (_, i) => 3000 + (i + 1) * 1000), 7500, 10000, 15000, 20000, 30000, 50000];

export function snapToNearestStep(value: number) {
  let closest = TICKET_STEPS[0];
  let minDiff = Math.abs(value - closest);
  for (const step of TICKET_STEPS) {
    const diff = Math.abs(step - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  return closest;
}
