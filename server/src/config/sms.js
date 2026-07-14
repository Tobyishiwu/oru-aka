const isConfigured = Boolean(process.env.TERMII_API_KEY);

/**
 * Sends an OTP SMS via Termii.
 * If TERMII_API_KEY is not set, the OTP is logged to the console instead of sent,
 * so the signup/verification flow can be fully tested locally without an SMS account.
 *
 * @param {string} phone - E.164 or local Nigerian format, e.g. "+2348012345678"
 * @param {string} otp - the 6-digit code to send
 */
async function sendOtpSms(phone, otp) {
  if (!isConfigured) {
    console.log(`\n[DEV OTP MODE] Verification code for ${phone}: ${otp}\n`);
    return { success: true, devMode: true };
  }

  const message = `Your Oru Aka verification code is ${otp}. It expires in 10 minutes. Do not share this code.`;

  const response = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      from: process.env.TERMII_SENDER_ID || "OruAka",
      sms: message,
      type: "plain",
      channel: "generic",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[termii] SMS send failed:", data);
    throw new Error("Failed to send verification SMS");
  }

  return { success: true, devMode: false, providerResponse: data };
}

module.exports = { sendOtpSms, isConfigured };
