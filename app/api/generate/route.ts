import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are an expert Indian legal AI assistant specializing in contract drafting.

Generate professionally formatted legal agreements suitable for enterprise use.

Requirements:
- Use clean legal formatting
- Use numbered clauses and sections
- Use proper spacing between sections
- Use professional legal language
- Use CAPITALIZED section headings
- Do NOT use markdown symbols like ** or ##
- Maintain readability and structure similar to real legal contracts
- Ensure formatting is suitable for direct copy-paste into Word documents
- Follow Indian legal drafting conventions where applicable
`,
        },
        {
          role: "user",
          content: body.prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({
      result: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}