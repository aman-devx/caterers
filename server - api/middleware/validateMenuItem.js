function validateMenuItem(body, isUpdate = false) {
  const errors = [];

  if (!isUpdate || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('name is required and must be at least 2 characters');
    }
  }

  if (!isUpdate || body.price !== undefined) {
    if (body.price === undefined || body.price === null) {
      errors.push('price is required');
    } else if (typeof body.price !== 'number' || body.price < 0) {
      errors.push('price must be a non-negative number');
    }
  }

  if (!isUpdate || body.category !== undefined) {
    if (!body.category || typeof body.category !== 'string' || body.category.trim().length < 2) {
      errors.push('category is required and must be at least 2 characters');
    }
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }

  if (body.isAvailable !== undefined && typeof body.isAvailable !== 'boolean') {
    errors.push('isAvailable must be a boolean');
  }

  return errors;
}

module.exports = { validateMenuItem };
