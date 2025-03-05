import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const transKey = process.env.TRANS_KEY; // Securely stored in .env.local

    if (!transKey) {
        return res.status(500).json({ error: "Translation API key is missing" });
    }

    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: "Missing text or target language" });
    }

    try {
        const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${targetLang}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": transKey,
                "Ocp-Apim-Subscription-Region": "eastus2",
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{ text }]),
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Translation Error:", error);
        return res.status(500).json({ error: "Translation request failed" });
    }
}
