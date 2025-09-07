export async function handleSendSMS(body, env) {
  const { to, message } = body;
  
  if (!to || !message) {
    throw new Error('Missing required fields: to, message');
  }

  // Get OAuth token from MTN
  const token = await getMTNToken(env);
  
  // Send SMS via MTN API
  const response = await fetch(`${env.MTN_BASE_URL}/v3/sms/messages/sms/outbound`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      outboundSMSMessageRequest: {
        address: [to],
        senderAddress: 'Femhold',
        outboundSMSTextMessage: {
          message: message
        }
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MTN API error: ${error}`);
  }

  const result = await response.json();
  
  return {
    status: 'success',
    message_id: result.resourceReference?.resourceURL?.split('/').pop() || 'unknown'
  };
}

async function getMTNToken(env) {
  const tokenResponse = await fetch(`${env.MTN_BASE_URL}/v1/oauth/access_token/accesstoken?grant_type=client_credentials`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${env.MTN_CONSUMER_KEY}:${env.MTN_CONSUMER_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to get MTN access token');
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}
