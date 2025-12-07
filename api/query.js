export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

CRITICAL: You must respond with ONLY valid JSON. No markdown, no explanations, no code fences. Just pure JSON.

Provide your response in this exact JSON format:
{
  "validation": "A gentle, empathetic 2-3 sentence validation. Use only plain text with no line breaks or special characters.",
  "scripture": {
    "reference": "Book Chapter:Verse",
    "text": "The scripture text in plain format",
    "link": "https://www.churchofjesuschrist.org/study/scriptures"
  },
  "resources": [
    {
      "title": "Exact title of the talk or speech",
      "author": "Full name of speaker",
      "type": "General Conference or BYU Speech",
      "year": "Year given",
      "link": "https://www.churchofjesuschrist.org/study/general-conference or https://speeches.byu.edu"
    }
  ]
}

Provide 3 relevant resources (mix of General Conference talks and BYU speeches). 
- For General Conference talks: use link "https://www.churchofjesuschrist.org/study/general-conference"
- For BYU Speeches: use link "https://speeches.byu.edu"
- Ensure title, author, and year are accurate so users can search for them

Ensure all text fields are on single lines with no line breaks.`
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

    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(cleanText);
      return res.status(200).json(parsed);
    } catch (firstError) {
      console.log('First parse failed, attempting to fix JSON...');
      
      try {
        cleanText = cleanText
          .replace(/\\n/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'");
        
        const parsed = JSON.parse(cleanText);
        return res.status(200).json(parsed);
      } catch (secondError) {
        console.error('JSON Parse Error:', secondError);
        console.error('Problematic text:', cleanText);
        
        return res.status(500).json({ 
          error: 'Gemini returned invalid JSON. Please try rephrasing your question.',
          details: secondError.message
        });
      }
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'An error occurred processing your request' 
    });
  }
}