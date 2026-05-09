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
          content:
            "You are an expert Indian legal AI assistant specializing in contract drafting.",
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