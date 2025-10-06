module.exports = function PASSWORD_RESET_HTML_TEMPLATE(username, password) {
  return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to Our Team!</title>
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
            .button {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Your Password Has been Reset</h1>
            <p>
              You've successfully reset your password.
            </p>
            <p>Here are your new account details:</p>
            <ul>
              <li><strong>Username:</strong> ${username}</li>
              <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please click the button below to log in</p>
            <a href="https://svm.apps.org.in/signin" class="button">Log In</a>
            <p>
              If you have any questions or need assistance, feel free to contact us
              anytime.
            </p>
            <p>Best regards,<br />SVM Team</p>
          </div>
        </body>
      </html>
      `;
};
