
// Predefined customer steps for the slider
export const CUSTOMER_STEPS = [
  ...Array.from({
    length: (200 - 100) / 100 + 1
  }, (_, i) => 200 + i * 100), 
  ...Array.from({
    length: (1500 - 200) / 100 + 1
  }, (_, i) => 200 + (i + 1) * 100), 
  ...Array.from({
    length: (3000 - 1500) / 500 + 1
  }, (_, i) => 1500 + (i + 1) * 500), 
  ...Array.from({
    length: (5000 - 3000) / 1000 + 1
  }, (_, i) => 3000 + (i + 1) * 1000),
  7500, 10000, 15000, 20000, 30000, 50000
];

/**
 * Snaps a customer count value to the nearest predefined step
 */
export function snapToNearestCustomerStep(value: number): number {
  let closest = CUSTOMER_STEPS[0];
  let minDiff = Math.abs(value - closest);
  
  for (const step of CUSTOMER_STEPS) {
    const diff = Math.abs(step - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  
  return closest;
}

/**
 * Calculate ProductFruits plan price based on customer count
 */
export function getProductFruitsPlanPrice(customers: number): number {
  if (customers <= 1500) return 139;
  if (customers <= 3000) return 189;
  if (customers <= 5000) return 259;
  if (customers <= 10000) return 339;
  return 439;
}
