function validateAdminCaterer(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }

  if (!body.location || typeof body.location !== 'string' || body.location.trim().length < 2) {
    errors.push('location is required and must be at least 2 characters');
  }

  if (body.pricePerPlate === undefined || typeof body.pricePerPlate !== 'number' || body.pricePerPlate <= 0) {
    errors.push('pricePerPlate must be a positive number');
  }

  if (!Array.isArray(body.cuisines) || body.cuisines.length === 0) {
    errors.push('cuisines must be a non-empty array');
  }

  if (body.rating === undefined || typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5) {
    errors.push('rating must be a number between 0 and 5');
  }

  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push('a valid email is required for caterer login');
  }

  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }

  return errors;
}

module.exports = { validateAdminCaterer };
