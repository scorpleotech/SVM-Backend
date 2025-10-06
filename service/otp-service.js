const otpGenerator = require("otp-generator");

// Function to generate OTP
const generateOTP = (phone) => {
  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCase: false,
    specialChars: false,
    alphabets: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // Here you should implement your logic to send the OTP to the user via SMS or any other method
  // For simplicity, let's just log the OTP here
  // console.log(`OTP for ${phone}: ${otp}`);

  // Return the generated OTP
  return otp;
};

module.exports = {
  generateOTP,
};
