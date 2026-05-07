function isPositiveInteger(value) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

function isValidCategoryId(value) {
  if (value === undefined) return true;
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  if (email.length === 0 || email.length > 150) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  isPositiveInteger,
  isValidCategoryId,
  isValidEmail
};
