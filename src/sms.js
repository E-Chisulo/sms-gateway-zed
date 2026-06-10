export async function handleSendSMS(body, env) {
  const { to, message } = body;

  if (!to || !message) {
    throw new Error('Missing required fields: to, message');
  }

  // Normalize to array — API accepts multiple recipients
  const recipients = Array.isArray(to) ? to : [to];

  // Generate a unique correlator ID for this request
  const clientCorrelatorId = crypto.randomUUID();

  const token = await getMTNToken(env);

  const response = await fetch(`${env.MTN_BASE_URL}/v3/sms/messages/sms/outbound`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      senderAddress: env.MTN_SENDER_ID || 'Femhold',  // Alphanumeric sender name
      receiverAddress: recipients,                      // Array of MSISDNs (E.164 format)
      message: message,
      serviceCode: env.MTN_SERVICE_CODE,               // Short code approved by MTN opco
      clientCorrelatorId: clientCorrelatorId,          // Required unique request ID (max 36 chars)
      requestDeliveryReceipt: false,                   // Set true if you subscribe for delivery reports
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `MTN API error ${response.status}: ${result.statusMessage || JSON.stringify(result)}`
    );
  }

  // Response shape: { statusCode, statusMessage, transactionId, data: { status } }
  return {
    status: 'success',
    message_id: result.transactionId || clientCorrelatorId,
    delivery_status: result.data?.status || 'PENDING',
  };
}

async function getMTNToken(env) {
  // Correct token URL per MTN docs
  const tokenUrl = `${env.MTN_BASE_URL}/v1/oauth/access_token/accesstoken?grant_type=client_credentials`;

  const credentials = btoa(`${env.MTN_CONSUMER_KEY}:${env.MTN_CONSUMER_SECRET}`);

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    throw new Error(`Failed to get MTN access token: ${err}`);
  }

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    throw new Error('MTN token response missing access_token');
  }

  return tokenData.access_token;
}
