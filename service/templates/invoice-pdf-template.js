const moment = require("moment");

module.exports = function HTML_TEMPLATE(
  invoice,
  dealerhub,
  agent,
  bikeVarient,
  Categories,
  obj
) {
  // console.log("Agent username", agent);
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
                    <p style="margin: 0;line-height: normal;">${
                      invoice.customer_name
                    }</p>
                    <p style="margin: 0;line-height: normal;">${
                      invoice.email
                    }</p>
                    <p style="margin: 0;line-height: normal;">${
                      invoice.phone
                    }</p>
                    <p style="margin: 0;line-height: normal;">${
                      invoice.address.city
                    }</p>
                    <p style="margin: 0;line-height: normal;">${
                      invoice.address.state
                    }</p>
                </div>
                
                <div style="display: flex;flex-direction: column; row-gap: 8px;">
                    <p style="margin: 0;line-height: normal;">Receipt Number:</p>
                    <p style="margin: 0;line-height: normal;">Receipt Date:</p>
                    <p style="margin: 0;line-height: normal;">Booking Id:</p>
                    <p style="margin: 0;line-height: normal;">Booking Date:</p>
                    <p style="margin: 0;line-height: normal;">Payment Method:</p>
                </div>
                <div style="display: flex;flex-direction: column; row-gap: 8px;">
                    <p style="margin: 0;line-height: normal;">${
                      invoice.invoice_number
                    }</p>
                    <p style="margin: 0;line-height: normal;">${moment(
                      invoice.createdAt
                    ).format("DD-MM-YYYY")}</p>
                    <p style="margin: 0;line-height: normal;">${
                      invoice.ordernumber
                    }</p>
                    <p style="margin: 0;line-height: normal;">${moment(
                      invoice.createdAt
                    ).format("DD-MM-YYYY")}</p>
                    <p style="margin: 0;line-height: normal;">${
                      obj?.payment_mode
                    }</p>
                </div>
            </div>
            <table style="margin-top: 30px; width: 100%; border-collapse: collapse;">
                <tr style="text-align: left; border-bottom: 1px solid #000000; background-color: #000000;  height: 40px;">
                    <th style="width: 65%; color: #000000; padding-left : 10px  ;">Product</th>
                    <th style="width: 15%; color: #000000; padding-left: 10px  ;">Quantity</th>
                    <th style="width: 20%; color: #000000; padding-left: 10px  ;">Price</th>
                </tr>
                <tr style="border-bottom: 1px solid #000000;">
                    <td style="min-height: 40px; padding: 5px 10px; vertical-align: top; font-size: 17px;">
                        SVM PRANA ${Categories.title}
                        <div
                            style="padding-left: 10px; margin: 10px 0 15px; display: flex; flex-direction: column; row-gap: 5px;">
                            <p style="margin: 0;line-height: normal;font-size: 13px;"><b>Color:</b> ${
                              invoice.model_booked_color
                            }</p>
                            <p style="margin: 0;line-height: normal;font-size: 13px;"><b>DealerName:</b> ${
                              dealerhub.name ? dealerhub.name : "N/A"
                            }
                            </p>
                            <p style="margin: 0;line-height: normal;font-size: 13px;"><b>AgentId:</b> ${
                              agent && agent.username ? agent.username : "N/A"
                            }</p>
                            <!-- <p style="margin: 0;line-height: normal;font-size: 13px;"><b>Order Type:</b>Regular </p> -->
                        </div>
                    </td>
                    <td style="min-height: 40px; padding: 5px 10px; vertical-align: top; font-size: 17px;">1</td>
                    <td style="min-height: 40px; padding: 5px 10px; vertical-align: top; font-size: 17px;">₹
                    ${invoice.booking_amount}
                    </td>
                </tr>
               
                <tr style=" height: 40px;">
                    <td> </td>
                    <td style="border-bottom: 2px solid #000000; font-size: 16px; font-weight: 600;">
                        Subtotal
                    </td>
                    <td style="border-bottom: 2px solid #000000;">
                    ₹ ${invoice.booking_amount}
                    </td>
                </tr>
                <tr style=" height: 40px;">
                    <td> </td>
                    <td style="border-bottom: 2px solid #000000; font-size: 16px; font-weight: 600;">
                        Total
                    </td>
                    <td style="border-bottom: 2px solid #000000;">
                        ₹ ${invoice.booking_amount}
                    </td>
                </tr>
            </table>
        </div>
        <div style="margin-top: 2px; border-top: 1px solid #000000;">
            <p style="text-align: center; margin-top: 15px;">*** This is computer generated signature is not required
                ***
            </p>
            <p style="text-align: center; margin-top: 15px;">*** Subject To Booking Terms & Conditions
                ***
            </p>
        </div>
    </div>
</body>

</html>
  `;
};
