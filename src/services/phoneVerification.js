import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: import.meta.env.VITE_VONAGE_API_KEY,
  apiSecret: import.meta.env.VITE_VONAGE_API_SECRET
});

export const sendVerificationCode = async (phoneNumber) => {
  try {
    const response = await vonage.verify.start({
      number: phoneNumber,
      brand: "Your App Name"
    });
    return response;
  } catch (error) {
    console.error('Verification code send error:', error);
    throw new Error('Failed to send verification code');
  }
};

export const verifyCode = async (requestId, code) => {
  try {
    const response = await vonage.verify.check(requestId, code);
    return response;
  } catch (error) {
    console.error('Code verification error:', error);
    throw new Error('Failed to verify code');
  }
}; 