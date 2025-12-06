export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a compassionate resource for members of The Church of Jesus Christ of Latter-day Saints who have questions about their faith. Please respond to the following question with empathy and understanding.

Question: "${question}"

Please provide your response in the following JSON format only, with no additional text:
{
  "validation": "A gentle, empathetic 2-3 sentence validation acknowledging their question and feelings",
  "scripture": {
    "reference": "Book Chapter:Verse (e.g., 'Moroni 10:4-5')",
    "text": "The actual scripture text",
    "link": "https://www.churchofjesuschrist.org/study/scriptures/[path]"
  },
  "resources": [
    {
      "title": "Title of talk or speech",
      "author": "Speaker name",
      "type": "General Conference" or "BYU Speech",
      "year": "Year",
      "link": "https://www.churchofjesuschrist.org/study/[path]"
    }
  ]
}

Provide 3 relevant resources (mix of General Conference talks and BYU speeches). Ensure all links follow the churchofjesuschrist.org URL structure.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.status(200).json(parsed);
    } else {
      throw new Error('Could not parse response from Gemini');
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'An error occurred processing your request' 
    });
  }
}
