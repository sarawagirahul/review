import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { businessName, rating, language = "english" } = await req.json();

    if (!businessName || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create prompts based on language and rating
    const prompts = {
      english: {
        positive: `You are a helpful assistant creating authentic Google review text for businesses. 
        A satisfied customer wants to leave a ${rating}-star review for "${businessName}".
        Generate exactly 3 distinct, authentic, and concise Google reviews (each 1-2 sentences) that sound natural and real.
        Focus on specific positive experiences. Do NOT use emojis or asterisks.
        Return ONLY the reviews, separated by "---" on new lines. Each review should be different in tone and details.`,

        negative: `You are a helpful assistant. A customer had a negative experience (${rating} stars) at "${businessName}".
        Generate 3 different, specific pieces of constructive feedback about their experience (each 1-2 sentences).
        Make them sound genuine and specific, not generic. No emojis or asterisks.
        Return ONLY the feedback, separated by "---" on new lines.`,
      },
      hindi: {
        positive: `आप एक सहायक सहायक हैं जो व्यवसायों के लिए Google समीक्षा पाठ बनाते हैं।
        एक संतुष्ट ग्राहक "${businessName}" के लिए एक ${rating}-स्टार समीक्षा छोड़ना चाहता है।
        बिल्कुल 3 अलग-अलग, प्रामाणिक, और संक्षिप्त Google समीक्षाएं बनाएं (प्रत्येक 1-2 वाक्य) जो प्राकृतिक और वास्तविक लगें।
        विशिष्ट सकारात्मक अनुभवों पर ध्यान दें। emoji या तारकों का उपयोग न करें।
        केवल समीक्षाएं लौटाएं, नई पंक्तियों पर "---" द्वारा अलग की गई हों।`,

        negative: `आप एक सहायक हैं। एक ग्राहक को "${businessName}" में नकारात्मक अनुभव हुआ (${rating} सितारे)।
        उनके अनुभव के बारे में 3 अलग-अलग, विशिष्ट रचनात्मक प्रतिक्रिया बनाएं (प्रत्येक 1-2 वाक्य)।
        उन्हें प्रामाणिक और विशिष्ट बनाएं, सामान्य नहीं। emoji या तारकों नहीं।
        केवल प्रतिक्रिया लौटाएं, नई पंक्तियों पर "---" द्वारा अलग की गई हों।`,
      },
      hinglish: {
        positive: `You are a helpful assistant jo reviews banate ho Google ke liye.
        Ek satisfied customer "${businessName}" ke liye ${rating}-star review leave karna chahta hai.
        Bilkul 3 alag-alag, authentic aur concise Google reviews banao (har ek 1-2 sentences) jo natural aur real lagein.
        Specific positive experiences par focus karo. Emojis ya asterisks use mat karo.
        Sirf reviews return karo, "---" se alag kiye gaye naye lines par.`,

        negative: `You are a helpful assistant. Ek customer ko "${businessName}" mein negative experience tha (${rating} stars).
        Unke experience ke baare mein 3 alag-alag, specific constructive feedback banao (har ek 1-2 sentences).
        Unhe genuine aur specific banao, generic nahi. Emojis ya asterisks nahi.
        Sirf feedback return karo, "---" se alag kiye gaye naye lines par.`,
      },
    };

    const promptKey = rating >= 3 ? "positive" : "negative";
    const languagePrompts =
      prompts[language as keyof typeof prompts] || prompts.english;
    const prompt = languagePrompts[promptKey as keyof typeof languagePrompts];

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse reviews from response (separated by ---)
    const reviews = responseText
      .split("---")
      .map((review) => review.trim())
      .filter((review) => review.length > 0)
      .slice(0, 3); // Take only first 3

    // If we don't have 3 reviews, generate more
    if (reviews.length < 3) {
      return NextResponse.json({
        reviews:
          reviews.length > 0
            ? reviews
            : ["Review generation failed. Please try again."],
      });
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate reviews" },
      { status: 500 },
    );
  }
}
