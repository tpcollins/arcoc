import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const apiKey = req.method === 'POST' ? req.body.apiKey : req.query.apiKey; // Adjust based on your method

    const endpoint = process.env.AZURE_ENDPOINT;

    if (!apiKey || !endpoint) {
        return res.status(400).json({ message: 'API key or endpoint is not configured properly.' });
    }    
  
    try {
      const voiceListResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      });

    if (!voiceListResponse.ok) {
      throw new Error(`Failed to fetch voices: ${voiceListResponse.status}`);
    }

    const voices = await voiceListResponse.json();
    res.status(200).json(voices);
  } catch (error) {
    console.error('Error fetching voice list:', error);
    const message = (error as { message: string }).message;
    res.status(500).json({ message: 'Failed to fetch voice list', error: message });
  }
};