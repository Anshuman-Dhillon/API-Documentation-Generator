/**
 * @swagger
 * {
 *   "paths": {
 *     "/api/example": {
 *       "get": {
 *         "summary": "Example API Endpoint",
 *         "description": "Returns a sample message.",
 *         "responses": {
 *           "200": {
 *             "description": "Success"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
app.get('/api/example', (req, res) => {
  res.json({ message: 'This is an example API endpoint' });
});
