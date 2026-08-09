export async function sendRecoverySms(params: {
  phone: string;
  otpCode: string;
}): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const apiUrl = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("SMS gateway config is missing");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: params.phone,
      sender: process.env.SMS_SENDER ?? "JUMPFIRST",
      message: `Your JUMPFIRST recovery OTP is ${params.otpCode}`,
    }),
  });

  if (!response.ok) {
    throw new Error("SMS gateway request failed");
  }
}
