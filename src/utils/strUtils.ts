export const toThousandthDigit = (val?: string) => {
  if (!val) {
    return val;
  }

  return String(Number(val)).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&, ');
};
