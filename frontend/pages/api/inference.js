export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, answer } = req.body

  if (!question || !answer) {
    return res.status(400).json({ error: 'Missing question or answer' })
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${backendUrl}/api/inference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        answer,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    res.status(200).json({ followUpQuestion: data.followUpQuestion })
  } catch (error) {
    console.error('Error calling inference service:', error)
    res.status(500).json({ error: 'Failed to generate follow-up question' })
  }
}