const moment = require("moment-timezone");
module.exports = function INCENTIVE_PROCESSED_TEMPLATE(incentive) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Incentive Processed</title>
        <style>
          .card-container {
            box-shadow: 0 0 14px rgba(0, 0, 0, 0.3);
            border-radius: 6px;
            max-width: 600px;
            margin: 0 auto;
            padding: 22px 32px;
            color: black;
          }
          .card-detail {
            opacity: 0.7;
            margin: 0;
          }
          .details {
            display: grid;
            grid-template-columns: 1fr;
            row-gap: 30px;
          }
          .single-detail {
            margin-bottom: 20px;
          }
          .single-detail span {
            opacity: 0.7;
            display: block;
          }
          .single-detail p {
            margin: 0;
            margin-top: 5px;
            font-size: 16px;
          }
          h1 {
            text-align: center;
            margin: 0;
          }
          @media screen and (min-width: 768px) {
            .details {
              grid-template-columns: repeat(2, 1fr);
              column-gap: 30px;
            }
          }
        </style>
      </head>
      <body>
        <div class="card-container">
          <h1>Incentive Processed</h1>
          <br />
          <p class="card-detail">
            We are pleased to inform you that your incentive has been processed
            successfully
          </p>
          <br />
    
          <h2>Incentive Details</h2>
          <div class="details">
            <div class="single-detail">
              <span>Booking Id</span>
              <p>${incentive.ordernumber}</p>
            </div>
            <div class="single-detail">
              <span>Incentive Amount</span>
              <p>${incentive.incentive_amount}</p>
            </div>
            <div class="single-detail">
              <span>Incentive Status</span>
              <p>${incentive.incentive_status}</p>
            </div>
            <div class="single-detail">
              <span>Transaction ID</span>
              <p>${incentive.trn_id}</p>
            </div>
            <div class="single-detail">
              <span>Transaction UTR number</span>
              <p>${incentive.trn_utr_number}</p>
            </div>
            <div class="single-detail">
              <span>Transaction Date</span>
              <p>${moment(incentive.trndate)
                .tz("Asia/Kolkata")
                .format("MMM DD, YYYY , hh:mm:ss A")}
              </p>
            </div>
            <div class="single-detail">
              <span>Transaction Details</span>
              <p>${incentive.txn_details}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
              `;
};
