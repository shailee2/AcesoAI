// app/api/ask/route.ts

export async function POST(req: Request) {
  console.log("Request received")
  const { prompt } = await req.json()
  console.log("Prompt:", prompt)
  // DEEPINFRA
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


  // //GEMINI
  // const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     contents: [{ parts: [{ text: prompt }] }]
  //   }),
  // })

  // const data = await response.json()
  // console.log("Gemini response:", JSON.stringify(data, null, 2))

  // const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"

  // return new Response(JSON.stringify({ result: resultText }), {
  //   status: 200,
  //   headers: { "Content-Type": "application/json" },
  // })

}
