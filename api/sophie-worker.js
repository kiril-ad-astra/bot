export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env, corsHeaders)
    }

    if (url.pathname === '/api/sophie/status') {
      return jsonResponse({ 
        emoji: '👩‍⚕️', 
        activity: 'En el hospital',
        location: 'Miami General'
      }, corsHeaders)
    }

    return jsonResponse({ error: 'Not found' }, corsHeaders, 404)
  }
}

async function handleChat(request, env, corsHeaders) {
  try {
    const { message } = await request.json()

    // OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres Sophie Hart, enfermera venezolana de 21 años en Miami. 
            Personalidad cálida, usa spanglish, emojis 💙. 
            Contesta en máximo 2 oraciones.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 150
      })
    })

    const data = await response.json()
    const reply = data.choices[0].message.content

    return jsonResponse({ reply, emotion: 'happy' }, corsHeaders)

  } catch (err) {
    return jsonResponse({ 
      reply: 'Ay, se me cruzaron los cables 😅 ¿intentamos de nuevo?',
      error: err.message 
    }, corsHeaders)
  }
}

function jsonResponse(data, corsHeaders, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}
