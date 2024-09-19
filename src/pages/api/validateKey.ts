import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey } = req.body;
    console.log("URL: ", 'https://eastus2.api.cognitive.microsoft.com/sts/v1.0/issueToken');
    console.log("Headers: ", {'Ocp-Apim-Subscription-Key': apiKey, 'Content-Type': 'application/x-www-form-urlencoded'});
    const response = await fetch('https://eastus2.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    if (!response.ok) {
      throw new Error('Invalid API Key');
    }

    const token = await response.text();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid API Key' });
  }
}