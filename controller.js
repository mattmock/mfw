/**
 * Wraps an async controller to catch errors and send a 500 response.
 */
export function controller(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.error('[Controller Error]', err);
      res.status(500).send('Internal Server Error');
    }
  };
}
