const express = require('express');
const app = express();

app.use(express.json());

// Cloud Run function handler for compiled monthly analytics
app.post('/', (req, res) => {
  const { parkId, month } = req.body;

  if (!parkId) {
    return res.status(400).send('Bad Request: Missing parkId');
  }

  console.log(`[Analytics] Compiling report for park ${parkId} and month ${month || 'current'}`);
  
  // Connect to Supabase DB directly to fetch issues stats
  // For instance: query all issues in parkId where created_at is within the month
  
  res.status(200).send({
    success: true,
    data: {
      parkId,
      month: month || new Date().toLocaleString('default', { month: 'long' }),
      totalIssuesLogged: 12,
      resolvedIssues: 10,
      averageResolutionTimeHours: 4.5
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`monthly-analytics listening on port ${port}`);
});
