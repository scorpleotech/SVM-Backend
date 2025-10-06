module.exports = function HTML_TEMPLATE(agent) {
  return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Agent Registration</title>
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
              <h1>New Agent Registration</h1>
              <table>
                <tr>
                  <th>Name:</th>
                  <td>${agent.name}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>${agent.email}</td>
                </tr>
                <tr>
                  <th>Mobile:</th>
                  <td>${agent.mobile}</td>
                </tr>
                <tr>
                  <th>State:</th>
                  <td>${agent.state}</td>
                </tr>
                <tr>
                  <th>City:</th>
                  <td>${agent.city}</td>
                </tr>
                <tr>
                  <th>Street Name:</th>
                  <td>${agent.street_name}</td>
                </tr>
                <tr>
                  <th>Pincode:</th>
                  <td>${agent.pincode}</td>
                </tr>
                <tr>
                  <th>Aadhar Number:</th>
                  <td>${agent.aadhar_number}</td>
                </tr>
                <tr>
                  <th>PAN Number:</th>
                  <td>${agent.pan_number}</td>
                </tr>
                <tr>
                  <th>Services:</th>
                  <td>${agent.select_service}</td>
                </tr>
                <tr>
                  <th>Shop Name:</th>
                  <td>${agent.shop_details.shop_name}</td>
                </tr>
                <tr>
                  <th>Shop Street Name:</th>
                  <td>${agent.shop_details.street_name}</td>
                </tr>
                <tr>
                  <th>Shop City:</th>
                  <td>${agent.shop_details.city}</td>
                </tr>
                <tr>
                  <th>Shop State:</th>
                  <td>${agent.shop_details.state}</td>
                </tr>
                <tr>
                  <th>Shop Pincode:</th>
                  <td>${agent.shop_details.pincode}</td>
                </tr>
                <tr>
                  <th>Shop Registration Number:</th>
                  <td>${agent.shop_details.shop_registration_number}</td>
                </tr>
                <tr>
                  <th>Add Location Coordinates:</th>
                  <td>${agent.shop_details.add_location_coordinates}</td>
                </tr>
                <tr>
                  <th>Select Bank:</th>
                  <td>${agent.shop_details.select_bank}</td>
                </tr>
                <tr>
                  <th>IFSC Code:</th>
                  <td>${agent.shop_details.ifsc_code}</td>
                </tr>
                <tr>
                  <th>Bank Account Number:</th>
                  <td>${agent.shop_details.bank_account_number}</td>
                </tr>
                <tr>
                  <th>Branch:</th>
                  <td>${agent.shop_details.branch}</td>
                </tr>
              </table>
              <p>
                Thank you for registering as an agent. We will review your application and get back to you soon.
              </p>
              <p>
                If you have any questions or need immediate assistance, please don't hesitate to contact us directly.
              </p>
              <p>Best regards,<br />Your Team</p>
            </div>
          </body>
        </html>
        `;
};
