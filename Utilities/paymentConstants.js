export const initialize = () => {
  let orderId = "Order_" + new Date().getTime();

  // Sandbox Credentials
  let mid = "DIY12386817555501617"; // Merchant ID
  let mkey = "bKMfNxPPf_QdZppa"; // Merchant Key
  var paytmParams = {};

  paytmParams.body = {
    requestType: "Payment",
    mid: mid,
    websiteName: "Srivaru Motors",
    orderId: orderId,
    callbackUrl: "https://srivarumotors.com",
    txnAmount: {
      value: 1,
      currency: "INR",
    },
    userInfo: {
      custId: "1001",
      cusName: "Raghavan",
      cusCity: "Salem",
      cusState: "Tamilnadu",
    },
  };

  PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), mkey).then(
    function (checksum) {
      console.log(checksum);
      paytmParams.head = {
        signature: checksum,
      };

      var post_data = JSON.stringify(paytmParams);

      var options = {
        /* for Staging */
        // hostname: "securegw-stage.paytm.in" /* for Production */,

        hostname: "securegw.paytm.in",

        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });
        post_res.on("end", function () {
          console.log("Response: ", response);
          // res.json({data: JSON.parse(response), orderId: orderId, mid: mid, amount: amount});
          const data = {
            ...paymentData,
            token: JSON.parse(response).body.txnToken,
            order: orderId,
            mid: mid,
            amount: 1,
          };
          console.log(data);
          sessionStorage.setItem("paymentData", JSON.stringify(data));
        });
      });

      post_req.write(post_data);
      post_req.end();
    }
  );
};
