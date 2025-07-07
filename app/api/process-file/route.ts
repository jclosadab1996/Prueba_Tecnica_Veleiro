import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, fileName, fileType } = body;

    if (!content) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this file and provide metadata in JSON format:
    
    File Name: ${fileName}
    File Type: ${fileType}
    Content: ${content}
    
    Please provide:
    1. Detected programming language or content type
    2. Line count
    3. Named entities (people, places, organizations, important terms)
    4. Key themes or topics
    5. Content summary (max 100 words)
    
    Return as JSON with keys: language, lineCount, entities (array), themes (array), summary
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let metadata;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
        text.match(/```\n([\s\S]*?)\n```/) || [null, text];
      const jsonStr = jsonMatch[1] || text;
      metadata = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      // If JSON parsing fails, create a basic metadata object
      metadata = {
        language: fileType === "text" ? "Plain Text" : "Unknown",
        lineCount: content.split("\n").length,
        entities: [],
        themes: [],
        summary: "Could not analyze content automatically",
      };
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
