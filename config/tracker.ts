export const TRACKER_API_URL = process.env.TRACKER_API_URL!

export const BODY_TRACKER = process.env.BODY_TRACKER!

if (!TRACKER_API_URL || !BODY_TRACKER) {
  throw new Error("TRACKER_API_URL and BODY_TRACKER must be defined in the environment variables");
}