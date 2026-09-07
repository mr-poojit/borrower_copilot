export function formatINR(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Math.round(value));
}

export function formatINRCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(2)} L`;
  }
  return formatINR(value);
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function roundTo(value: number, step: number): number {
  if (step <= 0) return Math.round(value);
  return Number((Math.round(value / step) * step).toFixed(6));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
