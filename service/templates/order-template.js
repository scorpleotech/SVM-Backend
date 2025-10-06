// const moment = require("moment");
// const url = "https://api.svm.apps.org.in/";
// module.exports = function HTML_TEMPLATE(order, dealerhub) {
//   return `<html lang="en">

//   <head>
//      <meta charset="UTF-8">
//      <meta name="viewport" content="width=device-width, initial-scale=1.0">
//      <title>Document</title>
//      <style>
//         .myOrders {
//            box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
//            padding: 30px 35px !important;
//            margin: 25px auto !important;
//            border-radius: 8px !important;
//            position: relative;
//            width: 80%;
//         }

//         .order_summary {
//            font-family: "Orbitron" !important;
//            font-weight: 600 !important;
//            font-size: 31px !important;
//            margin-bottom: 24px !important;
//         }

//         .sub_order_summary {
//            font-family: "NothanSans" !important;
//            font-weight: 600 !important;
//            font-size: 23px !important;
//            margin-bottom: 4px !important;
//         }

//         .SubContainer {
//            display: grid;
//            grid-template-columns: 60% 3% 37%;
//         }

//         .leftContainer {
//            padding: 0 !important;
//            margin: 0 !important;
//         }

//         .ColumnFlexContainer {
//            display: flex;
//            flex-direction: column;
//            gap: 10px;
//            margin: 20px 0 !important;
//         }

//         .imageContainer {
//            display: flex;
//            justify-content: flex-start;
//            gap: 20px;
//         }

//         .bookedBikeimage {
//            width: 125px;
//            height: 90px;
//         }

//         .OrderNoteText {
//            text-align: justify !important;
//            font-size: 14px !important;
//         }

//         .btnContainer {
//            position: absolute;
//            top: 30px;
//            right: 35px;
//         }

//         .anotherBookingbtn {
//            text-transform: none !important;
//            background-color: #0072ff;
//            color: white;
//            font-size: 16px;
//            padding: 7px 15px;
//            border-radius: 5px;
//            border: 1px solid #0072ff;
//            cursor: pointer;
//         }

//         p {
//            margin: 0;
//         }

//         .fields {
//            margin-top: 10px;
//         }

//         .vertical {
//            margin: 0 15px;
//         }

//         .horizontal {
//            margin: 25px 0;
//         }
//      </style>
//   </head>

//   <body>
//      <div class="myOrders">
//         <p class="order_summary">
//            Order Summary
//         </p>
//         <div class="SubContainer">
//            <div>
//               <p class="sub_order_summary">
//                  Order Details
//               </p>
//               <p class="fields">
//               OrderNo : ${order.ordernumber}
//               </p>
//               <p class="fields">
//               ${moment(order.createdAt).format("MMM DD, YYYY")} , ${moment(
//     order.createdAt
//   ).format("hh:mm:ss A")} <br>
//             ${order.address.city},<br> ${order.address.state}
//             </p>
//            </div>
//            <hr class="vertical">
//            <div px={2} class="leftContainer">
//               <p class="sub_order_summary">
//                  Customer Details
//               </p>
//               <div class="ColumnFlexContainer">
//                  <p>
//                     <b>Name:</b> ${order.customer_name}
//                  </p>
//                  <br>
//                  <p>
//                     <b>Mobile:</b> ${order.phone}
//                  </p>
//                  <br>
//                  <p>
//                     <b>Email:</b> ${order.email}
//                  </p>
//                  <br>
//                  <p>
//                     <b>Hub:</b>  ${dealerhub.name}
//                  </p>
//               </div>
//            </div>
//         </div>
//         <hr class="horizontal">
//         <div class="SubContainer">
//            <div>
//               <p class="sub_order_summary">
//                  Vehicle Details
//               </p>
//               <div class="imageContainer">
//                  <img src=https://api.svm.apps.org.in//images/uploads/varient/1712553186189.png class="bookedBikeimage" />
//                  <div class="ColumnFlexContainer">
//                     <p>
//                        <b>Model:</b> ${order.model_name}
//                     </p>
//                     <br>
//                     <p>
//                        <b>Color:</b> ${order.model_booked_color}
//                     </p>
//                     <br>
//                     <p>
//                        <b>Unit Price:</b>
//                        ₹ ${order.price}
//                     </p>
//                     <br>
//                     <p>
//                        <b>Accessories:</b>
//                        ${
//                          order.coupon_code
//                            ? "₹ 1000 Worth of accessories has been added to your booking"
//                            : "N/A"
//                        }

//                     </p>
//                  </div>
//               </div>
//            </div>
//            <hr class="vertical">
//            <div px={2} class="leftContainer">
//               <p class="sub_order_summary">
//                  Other Price details
//               </p>
//               <div class="ColumnFlexContainer">
//                  <p>
//                     <b>Coupon Code:</b> ${
//                       order.coupon_code ? order.coupon_code : "N/A"
//                     }
//                  </p>
//                  <p>
//                     <b>Advance Paid Amount:</b>
//                     ₹ ${order.booking_amount}
//                  </p>
//                  <p>
//                     <b>Payment Method:</b>
//                     paytm
//                  </p>
//               </div>
//               <p mt={2} class="OrderNoteText">
//                  Note: Our focus lies primarily on complete customer
//                  satisfaction. So, we understand that sometimes in an
//                  unforeseen instance, you can have second thoughts
//                  regarding owning a PRANA motorcycle after having made a
//                  deposit for your booking. In such an instance as well, you
//                  can cancel the booking anytime before invoicing the
//                  vehicle and request the refund. We will refund 100% of
//                  your money paid towards the booking. for more details
//                  please check our <a href="#">T&C</a> and
//                  <a href="#">Refund Policy</a>.
//               </p>
//            </div>
//         </div>
//      </div>
//   </body>

//   </html>
// `;
// };
const moment = require("moment-timezone");
const url = "https://api.svm.apps.org.in/";
module.exports = function HTML_TEMPLATE(order, dealerhub, bikeVarient, obj) {
  const bikeimageurl = process.env.WEBSITE_URL + bikeVarient.image;
  console.log("bike url", bikeimageurl);
  return `<html lang="en">

  <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Document</title>
     <style>
        .myOrders {
           box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
           padding: 30px 35px !important;
           margin: 25px 0 !important;
           border-radius: 8px !important;
           position: relative;
        }
  
        .order_summary {
           font-weight: 600 !important;
           font-size: 31px !important;
           padding: 15px !important;
           text-align: left;
        }
  
        .sub_order_summary {
           font-weight: 600 !important;
           font-size: 23px !important;
           margin-bottom: 4px !important;
        }
  
        .SubContainer {
           display: grid;
           grid-template-columns: 60% 2% 38%;
        }
  
        .leftContainer {
           padding: 0 !important;
           margin: 4% 0 !important;
        }
  
        .ColumnFlexContainer {
           display: flex;
           flex-direction: column;
           gap: 10px;
           margin: 20px 0 !important;
        }
  
        .imageContainer {
           display: grid;
           gap: 20px;
        }
  
        .bookedBikeimage {
           width: 125px;
           height: 90px;
        }
  
        .OrderNoteText {
           text-align: justify !important;
           font-size: 14px !important;
        }
  
        .btnContainer {
           position: absolute;
           top: 30px;
           right: 35px;
        }
  
        .anotherBookingbtn {
           text-transform: none !important;
           background-color: #0072ff;
           color: white;
           font-size: 16px;
           padding: 7px 15px;
           border-radius: 5px;
           border: 1px solid #0072ff;
           cursor: pointer;
        }
  
        p {
           margin: 0;
        }
  
        .fields {
           margin-top: 10px;
        }
  
        hr {
           margin: 0;
        }
     </style>
  </head>
  
  <body>
     <table style="border-collapse: collapse;width: 100%;">
        <tr>
           <td colspan="2">
              <p class="order_summary">
                 Booking Summary
              </p>
           </td>
        </tr>
        <tr style="border-bottom: 1px solid #c7c7c7;">
           <td style="vertical-align:top; width: 60%; border-right: #c7c7c7 1px solid;">
              <div style="padding: 15px 24px; ">
                 <p class="sub_order_summary">
                    Booking Details
                 </p>
                 <p class="fields">
                    <b>Booking ID:</b> ${order.ordernumber}
                 </p>
                 <p class="fields">
                 ${moment(order.createdAt)
                   .tz("Asia/Kolkata")
                   .format("MMM DD, YYYY , hh:mm:ss A")}
                            
                 </p>
                 <p class="fields">
                 ${order.address.city}, ${order.address.state}  
                 </p>
              </div>
           </td>
           <td style="">
              <div style="padding: 15px 24px;">
                 <p class="sub_order_summary">
                    Customer Details
                 </p>
                 <div>
                    <p class="fields">
                       <b>Name:</b> ${order.customer_name}
                    </p>
                    <p class="fields">
                       <b>Mobile:</b> ${order.phone}
                    </p>
                    <p class="fields">
                       <b>Email:</b> ${order.email}
                    </p>
                    <p class="fields">
                       <b>Hub:</b>   ${dealerhub.name ? dealerhub.name : "N/A"}
                    </p>
                 </div>
              </div>
           </td>
        </tr>
        <tr>
           <td style="vertical-align:top;border-right: #c7c7c7 1px solid;">
              <div style="padding: 15px 24px;">
                 <p class="sub_order_summary">
                    Vehicle Details
                 </p>
                 <div class="imageContainer">
  
                    <img src=${bikeimageurl} class="bookedBikeimage" />
                    <div>
                       <p class="fields">
                          <b>Model:</b> SVM PRANA ${order.model_category}
                       </p>
                       <p class="fields">
                          <b>Color:</b> ${order.model_booked_color}
                       </p>
                       <p class="fields">
                          <b>Unit Price:</b>
                          ₹ ${order.price}
                       </p>
                       <p class="fields">
                          <b>Accessories:</b>
                          ${
                            order.coupon_code
                              ? "₹ 1000 Worth of accessories has been added to your booking"
                              : "N/A"
                          }
                       </p>
                    </div>
                 </div>
              </div>
           </td>
           <td style=" vertical-align:top">
              <div style="padding: 15px 24px;">
                 <p class="sub_order_summary">
                    Other Price details
                 </p>
                 <div>
                    <p class="fields">
                       <b>Coupon Code:</b> ${
                         order.coupon_code ? order.coupon_code : "N/A"
                       }
                    </p>
                    <p class="fields">
                       <b>Advance Paid Amount:</b>
                       ₹ ${order.booking_amount}
                    </p>
                    <p class="fields">
                       <b>Payment Method:</b>
                       ${obj?.payment_mode ? obj?.payment_mode : "N/A"}
                    </p>
                 </div>
                 <br/>                 
                 <p mt={2} class="OrderNoteText">
                    Note: Our focus lies primarily on complete customer
                    satisfaction. So, we understand that sometimes in an
                    unforeseen instance, you can have second thoughts
                    regarding owning a PRANA motorcycle after having made a
                    deposit for your booking. In such an instance as well, you
                    can cancel the booking anytime before invoicing the
                    vehicle and request the refund. We will refund 100% of
                    your money paid towards the booking. for more details
                    please check our <a href="https://srivarumotors.com/terms-condition">T&C</a> and
                    <a href="https://srivarumotors.com/refund-policy">Refund Policy</a>.
                 </p>
              </div>
           </td>
        </tr>
     </table>
  
  </body>
  
  </html>
`;
};
