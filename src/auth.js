export async function validateApiKey(apiKey, kvStore) {
  try {
    const keyData = await kvStore.get(apiKey);
    return keyData !== null;
  } catch (error) {
    return false;
  }
}
