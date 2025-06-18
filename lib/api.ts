export async function askAI(question: string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({ question }),
    })
  
    if (!res.ok) {
      throw new Error("API request failed")
    }
  
    const data = await res.json()
    return data.answer || "No response."
  }
  