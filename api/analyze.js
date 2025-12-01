export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { image } = await request.json();

        if (!image) {
            return new Response(JSON.stringify({ error: 'No image provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server configuration error: API Key missing' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Remove header if present to get base64 string
        const base64Image = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        const promptText = `
    Analyze this image and return a JSON object with:
    {
      "season": "봄웜" | "여름쿨" | "가을웜" | "겨울쿨",
      "englishSeasonName": string,
      "undertone": "warm" | "cool" | "neutral",
      "brightness": "light" | "medium" | "deep",
      "saturation": "soft" | "medium" | "vivid",
      "summary": string, // 1 short sentence describing skin tone & vibe
      "paletteColors": string[], // 6-12 hex color strings like "#F8D5C5"
      "makeupRecommendations": string[], // bullet-like text phrases
      "hairRecommendations": string[],
      "avoidColors": string[],
      "faceBox": { "x": number, "y": number, "width": number, "height": number } | null // normalized 0-1
    }
    Focus on the cheek skin tone to infer undertone and overall brightness/saturation.
    Return ONLY valid JSON.
    `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptText },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const textContent = data.candidates[0].content.parts[0].text;
        const result = JSON.parse(textContent);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
