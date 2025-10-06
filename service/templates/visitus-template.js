module.exports = function HTML_TEMPLATE(name, email, phone, description) {
  return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Contact Us Received</title>
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
              h1 {
                color: #333333;
              }
              p {
                color: #666666;
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
              <h1>New Inquiry Received</h1>
              <table>
                <tr>
                  <th>Name:</th>
                  <td>${name}</td>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td>${phone}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>${email}</td>
                </tr>
                <tr>
                  <th>Description:</th>
                  <td>${description}</td>
                </tr>
              </table>
              <p>
                We have received your inquiry. Our team will review it and get back to you as soon as possible.
              </p>
              <p>
                If you have any urgent questions or need immediate assistance, please don't hesitate to contact us directly.
              </p>
              <p>Best regards,<br />Your Team</p>
            </div>
          </body>
        </html>
        `;
};
