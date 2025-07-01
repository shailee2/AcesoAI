// app/api/ask/route.ts

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await response.json()

  return new Response(JSON.stringify({ result: data.choices?.[0]?.message?.content || "No response" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
