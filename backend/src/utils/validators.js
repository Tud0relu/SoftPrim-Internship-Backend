function isPositiveInteger(value) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

function isValidCategoryId(value) {
  if (value === undefined) return true;
  return isPositiveInteger(value);
}

module.exports = {
  isPositiveInteger,
  isValidCategoryId
};
