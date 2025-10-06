const moment = require("moment");

module.exports = function PRANACLASS_INVOICE_HTML_TEMPLATE(
  pranaClassOrder,
  pranaClassStore,
  pranaClassCustomer,
  pranaClassVariant,
  Categories,
  paymentData
) {
  return `
  <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div
        style="width: 70%; margin: 10px auto; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2); padding: 40px 7%; min-height: 800px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
            <div style="display: flex; justify-content: space-between; position: relative;">
                <h2>Booking Receipt</h2>
                <h4>Srivaru Motors — Building world class
                    <br />
                    Innovative Auto Mobiles
                </h4>
                <img src="https://api.svm.apps.org.in//images/uploads/banner/1715599885442.png" alt="Logo"
                    style="position: absolute; right: 55px; top: 5px; z-index: -1; height: 65px;">
            </div>
            <h1 style="margin-top: 50px;">Invoice</h1>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <div style="display: flex;flex-direction: column; row-gap: 8px;">
                    <p style="margin: 0;line-height: normal;">${pranaClassOrder.name}</p>
                    <p style="margin: 0;line-height: normal;">${pranaClassOrder.email}</p>
                    <p style="margin: 0;line-height: normal;">${pranaClassOrder.mobile}</p>
                    <p style="margin: 0;line-height: normal;">${paymentData.billing_city || 'Coimbatore'}</p>
                    <p style="margin: 0;line-height: normal;">${paymentData.billing_state || 'Tamil Nadu'}</p>
                </div>
                
                <div style="display: flex;flex-direction: column; row-gap: 8px;">
                    <p style="margin: 0;line-height: normal;">Receipt Number:</p>
                    <p style="margin: 0;line-height: normal;">Receipt Date:</p>
                    <p style="margin: 0;line-height: normal;">Booking Id:</p>
                    <p style="margin: 0;line-height: normal;">Booking Date:</p>
                    <p style="margin: 0;line-height: normal;">Payment Method:</p>
                </div>
                <div style="display: flex;flex-direction: column; row-gap: 8px;">
                    <p style="margin: 0;line-height: normal;">${pranaClassOrder.reservation_number}</p>
                    <p style="margin: 0;line-height: normal;">${moment(pranaClassOrder.createdAt).format("DD-MM-YYYY")}</p>
                    <p style="margin: 0;line-height: normal;">${pranaClassOrder.reservation_number}</p>
                    <p style="margin: 0;line-height: normal;">${moment(pranaClassOrder.createdAt).format("DD-MM-YYYY")}</p>
                    <p style="margin: 0;line-height: normal;">${paymentData?.payment_mode || 'Online Payment'}</p>
                </div>
            </div>
            <table style="margin-top: 30px; width: 100%; border-collapse: collapse;">
                <tr style="text-align: left; border-bottom: 1px solid #ddd; background-color: #f5f5f5; height: 40px;">
                    <th style="width: 65%; padding-left: 10px;">Product</th>
                    <th style="width: 15%; padding-left: 10px;">Quantity</th>
                    <th style="width: 20%; padding-left: 10px;">Price</th>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="min-height: 40px; padding: 5px 10px; vertical-align: top; font-size: 17px;">
                        PranaClass - High-Performance Electric Motorcycle
                        <div style="padding-left: 10px; margin: 10px 0 15px; display: flex; flex-direction: column; row-gap: 5px;">
                            <p style="margin: 0;line-height: normal;font-size: 13px;"><b>Color:</b> ${pranaClassOrder.colorName}</p>
                            <p style="margin: 0;line-height: normal;font-size: 13px;"><b>Hub:</b> ${pranaClassStore.name || "Srivaru Motors"}</p>
                            <p style="margin: 0;line-height: normal;font-size: 13px;"><b>Vehicle Type:</b> Electric Motorcycle</p>
                        </div>
                    </td>
                    <td style="min-height: 40px; padding: 5px 10px; vertical-align: top; font-size: 17px;">1</td>
                    <td style="min-height: 40px; padding: 5px 10px; vertical-align: top; font-size: 17px;">₹ ${pranaClassOrder.price}</td>
                </tr>
               
                <tr style="border-bottom: 2px solid #333;">
                    <td style="border-bottom: 2px solid #333; text-align: right; padding-right: 10px; font-size: 18px;">
                        <b>Total Amount</b>
                    </td>
                    <td style="border-bottom: 2px solid #333;">
                        <b>₹ ${pranaClassOrder.price}</b>
                    </td>
                </tr>
                
                <tr style="border-bottom: 2px solid #333;">
                    <td style="border-bottom: 2px solid #333; text-align: right; padding-right: 10px; font-size: 18px;">
                        <b>Grand Total</b>
                    </td>
                    <td style="border-bottom: 2px solid #333;">
                        <b>₹ ${pranaClassOrder.price}</b>
                    </td>
                </tr>
            </table>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid #333;">
            <p style="text-align: center; margin-top: 15px;">*** This is computer generated signature is not required ***</p>
        </div>
    </div>
</body>

</html>
  `;
};