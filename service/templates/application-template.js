module.exports = function CAREER_APPLICATION_HTML_TEMPLATE(
  application,
  career
) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Career Application Summary</title>
      <style>
        /* Inline CSS styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #dddddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>New Career Application Summary</h1>
        <p>This is a summary of the new career application for ${
          career.title
        }:</p>
        <table>
          <tr>
            <th>Name</th>
            <td>${application.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>${application.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>${application.phone}</td>
          </tr>
          <tr>
            <th>Current Job Title</th>
            <td>${application.currentJobTitle || "N/A"}</td>
          </tr>
          <tr>
            <th>Years of Experience</th>
            <td>${application.yearsOfExperience || "N/A"}</td>
          </tr>
          <tr>
            <th>LinkedIn URL</th>
            <td>${application.linkedInUrl || "N/A"}</td>
          </tr>
         
        </table>
      </div>
    </body>
    </html>`;
};
