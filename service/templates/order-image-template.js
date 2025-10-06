module.exports = async function HTML_IMAGE_TEMPLATE(screenshot) {
  const image =
    process.env.WEBSITE_URL + "/images/uploads/order/screenshot.png";
  console.log("screenshot", screenshot);
  return `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .title {
            text-align: center;
            color: #333333;
        }
        .image-container {
            text-align: center;
            margin: 20px 0;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
        }
        .booking-receipt {
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #dddddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Your Booking Receipt</h1>
        <div class="image-container">
            <img src="${image}" alt="Booking Image 1" />
        </div>
    </div>
</body>
</html>
    `;
};
