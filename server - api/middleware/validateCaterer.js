function validateCaterer(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }

  if (!body.location || typeof body.location !== 'string' || body.location.trim().length < 2) {
    errors.push('location is required and must be at least 2 characters');
  }

  if (body.pricePerPlate === undefined || body.pricePerPlate === null) {
    errors.push('pricePerPlate is required');
  } else if (typeof body.pricePerPlate !== 'number' || body.pricePerPlate <= 0) {
    errors.push('pricePerPlate must be a positive number');
  }

  if (!Array.isArray(body.cuisines) || body.cuisines.length === 0) {
    errors.push('cuisines must be a non-empty array');
  } else if (!body.cuisines.every((c) => typeof c === 'string' && c.trim().length > 0)) {
    errors.push('each cuisine must be a non-empty string');
  }

  if (body.rating === undefined || body.rating === null) {
    errors.push('rating is required');
  } else if (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5) {
    errors.push('rating must be a number between 0 and 5');
  }

  return errors;
}

module.exports = { validateCaterer };
