// api/analyze.js
export default async function handler(req, res) {
  try {
    const { image } = JSON.parse(req.body);

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert personal color analyst. Respond ONLY in JSON."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze the face image." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ]
      })
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
