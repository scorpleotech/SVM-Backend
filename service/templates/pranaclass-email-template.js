// /backend/service/templates/pranaclass-email-template.js
module.exports = function(pranaClassOrder, paymentData) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PranaClass Booking Confirmed</title>
    <style>
        /* Inline CSS styles - matching original pattern */
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
        <h1>PranaClass Electric Motorcycle Booking Confirmed</h1>
        <p>Dear ${pranaClassOrder.name},</p>
        <p>Your booking has been confirmed successfully. Here are the details:</p>
        
        <h2>Booking Details</h2>
        <table>
            <tr>
                <th>Booking ID:</th>
                <td>${pranaClassOrder.reservation_number}</td>
            </tr>
            <tr>
                <th>Name:</th>
                <td>${pranaClassOrder.name}</td>
            </tr>
            <tr>
                <th>Email:</th>
                <td>${pranaClassOrder.email}</td>
            </tr>
            <tr>
                <th>Mobile:</th>
                <td>${pranaClassOrder.mobile}</td>
            </tr>
            <tr>
                <th>Model:</th>
                <td>PranaClass</td>
            </tr>
            <tr>
                <th>Color:</th>
                <td>${pranaClassOrder.colorName}</td>
            </tr>
            <tr>
                <th>Price:</th>
                <td>₹ ${pranaClassOrder.price}</td>
            </tr>
            <tr>
                <th>Payment Status:</th>
                <td>${pranaClassOrder.payment_status}</td>
            </tr>
            <tr>
                <th>Payment Method:</th>
                <td>${paymentData.payment_mode || 'Online Payment'}</td>
            </tr>
        </table>
        
        <p>Thank you for choosing Srivaru Motors. We will contact you soon with further details.</p>
        
        <p>Best regards,<br>
        Srivaru Motors Team<br>
        Building world class Innovative Auto Mobiles</p>
    </div>
</body>
</html>`;
};