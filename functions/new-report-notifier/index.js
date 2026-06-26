const express = require('express');
const app = express();

app.use(express.json());

// Cloud Run function handler for new report notifications
app.post('/', (req, res) => {
  const { report } = req.body;

  if (!report) {
    return res.status(400).send('Bad Request: Missing report data');
  }

  console.log(`[Notification] New report received: ${report.type} at location: ${report.location}`);
  
  // Here you can integrate with email providers (SendGrid/Mailgun) or push notification APIs.
  // Example integration:
  // sendEmail(report.assignedOperatorEmail, `New Issue: ${report.type}`, `A new issue has been logged at ${report.location}. Details: ${report.details}`);

  res.status(200).send({
    success: true,
    message: 'Notification processed successfully'
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`new-report-notifier listening on port ${port}`);
});
