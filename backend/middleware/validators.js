const { z } = require('zod');

// ──────────────────────────────────────────────
// Zod Schemas
// ──────────────────────────────────────────────

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters'),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

// ──────────────────────────────────────────────
// Validation Middleware Factory
// ──────────────────────────────────────────────

/**
 * Returns Express middleware that validates req.body against the given Zod schema.
 * On success, replaces req.body with the parsed (trimmed/transformed) data.
 * On failure, responds with 400 and a list of validation errors.
 *
 * @param {z.ZodSchema} schema - Zod schema to validate against
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: errors.map((e) => e.message).join(', '),
        details: errors,
      },
    });
  }

  // Replace body with parsed & transformed values
  req.body = result.data;
  next();
};

module.exports = { validate, registerSchema, loginSchema };
