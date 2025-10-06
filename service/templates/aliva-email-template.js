// /backend/service/templates/alive-email-template.js
module.exports = function(aliveOrder, paymentData) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>alive Reservation Confirmed</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">alive Reservation Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Srivaru Motors — Building world class Innovative Auto Mobiles</p>
          </div>
          
          <!-- Booking Details Section -->
          <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #4CAF50; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #4CAF50;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 40%;">Booking ID:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${aliveOrder.reservation_number}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">Date:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; font-weight: bold;">Location:</td>
                      <td style="padding: 12px 0;">${paymentData.billing_city || 'Coimbatore'}, ${paymentData.billing_state || 'Tamil Nadu'}</td>
                  </tr>
              </table>
          </div>
  
          <!-- Customer Details Section -->
          <div style="padding: 30px; background-color: #f8f9fa;">
              <h2 style="color: #4CAF50; margin: 0 0 20px 0;">Customer Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 40%;">Name:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${aliveOrder.name}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">Mobile:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${aliveOrder.mobile}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">Email:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${aliveOrder.email}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; font-weight: bold;">Hub:</td>
                      <td style="padding: 12px 0;">Srivaru Motors - alive Division</td>
                  </tr>
              </table>
          </div>
  
          <!-- Vehicle Details Section -->
          <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #4CAF50; margin: 0 0 20px 0;">Vehicle Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 40%;">Model:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">alive ${aliveOrder.model}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">Color:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">${aliveOrder.colorName}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">Unit Price:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">₹ ${aliveOrder.price}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; font-weight: bold;">Accessories:</td>
                      <td style="padding: 12px 0;">N/A</td>
                  </tr>
              </table>
          </div>
  
          <!-- Payment Details Section -->
          <div style="padding: 30px; background-color: #f8f9fa;">
              <h2 style="color: #4CAF50; margin: 0 0 20px 0;">Other Price Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 40%;">Coupon Code:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">N/A</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; font-weight: bold;">Advance Paid Amount:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee;">₹ ${aliveOrder.price}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px 0; font-weight: bold;">Payment Method:</td>
                      <td style="padding: 12px 0;">${paymentData.payment_mode}</td>
                  </tr>
              </table>
          </div>
  
          <!-- Features Section -->
          <div style="padding: 30px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); margin: 0;">
              <h3 style="margin: 0 0 15px 0; color: #1976d2;">Your alive Electric Scooter Features:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #424242; line-height: 1.6;">
                  <li>Zero emission, eco-friendly transportation</li>
                  <li>Advanced lithium-ion battery technology</li>
                  <li>Smart connectivity features</li>
                  <li>Low maintenance costs compared to petrol vehicles</li>
                  <li>Silent operation for noise-free rides</li>
              </ul>
          </div>
  
          <!-- Important Note -->
          <div style="padding: 30px; background-color: #fff3e0; border-left: 4px solid #ff9800;">
              <p style="margin: 0; color: #e65100; font-size: 14px; line-height: 1.6;">
                  <strong>Note:</strong> Our focus lies primarily on complete customer satisfaction. You can cancel the booking anytime before delivery and request a 100% refund. For more details, please check our 
                  <a href="https://srivarumotors.com/terms-condition" style="color: #4CAF50;">Terms & Conditions</a> and 
                  <a href="https://srivarumotors.com/refund-policy" style="color: #4CAF50;">Refund Policy</a>.
              </p>
          </div>
  
          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #333, #555); color: white; text-align: center; padding: 30px;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">Thank you for choosing Srivaru Motors alive!</h3>
              <p style="margin: 0; font-size: 14px; opacity: 0.8;">Leading the Electric Revolution 🌱</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                  📧 <a href="mailto:info@srivarumotors.com" style="color: #4CAF50;">info@srivarumotors.com</a> | 
                  📞 080-22220869
              </p>
          </div>
      </div>
  </body>
  </html>`;
  };
  