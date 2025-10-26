import express from "express";
import fetch from "node-fetch"; // npm install node-fetch
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // à mettre dans .env

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) return res.status(400).json({ error: "Message requis" });

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Tu es un assistant pour le site Andu-Xara." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        res.json({ reply: botMessage });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
