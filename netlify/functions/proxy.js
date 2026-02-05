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

    if (!response.ok) {
      throw new Error(`Google Drive returned ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'max-age=3600',
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
