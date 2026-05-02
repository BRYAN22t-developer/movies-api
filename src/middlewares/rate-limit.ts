import rateLimit from "express-rate-limit";

export function defaultRateLimit() {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "too many requests",
    },
  });

  return limiter;
}
