
// Development server for running the backend API
const app = require('./src/backend/server');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API server is running on port ${PORT}`);
});
