exports.handler = async (event) => {
  const fileId = event.queryStringParameters?.id;

  if (!fileId) {
    return {
      statusCode: 400,
      body: 'Missing file ID',
    };
  }

  const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
