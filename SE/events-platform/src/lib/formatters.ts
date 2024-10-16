const CURRENCY_FORMATTER = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  if (amount === 0) {
    return "Free";
  }
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-GB");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
