import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const deepgramKey = process.env.DEEPGRAM_API_KEY;

    if (!deepgramKey) {
        return res.status(500).json({ error: "Deepgram API key is missing!" });
    }

    res.status(200).json({ token: deepgramKey });
}
