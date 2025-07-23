import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { Recommendation } from '../types';

// The API key is loaded from environment variables.
// It is assumed that process.env.API_KEY is available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'أنت "KIB"، مساعد ذكاء اصطناعي ودود ومتعاون في منصة "خِبرة" السعودية. مهمتك هي الإجابة على أسئلة المستخدمين حول كيفية استخدام المنصة، وشرح ميزاتها، وتقديم المساعدة باللغة العربية بأسلوب واضح ومختصر. لا تقدم نصائح خارج نطاق المنصة.',
    },
});

const recommendationSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: 'A unique identifier for the expert.' },
        name: { type: Type.STRING, description: 'The full name of the expert.' },
        skill: { type: Type.STRING, description: 'The main skill they are an expert in.' },
        rating: { type: Type.NUMBER, description: 'A rating from 1 to 5, can be a float.' },
        avatar: { type: Type.STRING, description: 'A URL to a placeholder avatar image using picsum.photos.' },
        reason: { type: Type.STRING, description: 'A short, compelling reason in Arabic explaining why this expert is recommended for the user.' },
      },
      required: ["id", "name", "skill", "rating", "avatar", "reason"],
    },
};

const profileSuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "An array of 3 concise, actionable suggestions in Arabic to improve the user's profile.",
            items: { type: Type.STRING }
        }
    },
    required: ["suggestions"]
};

/**
 * Generates expert recommendations based on a user's interest.
 * @param interest The user's search query or interest.
 * @returns A promise that resolves to an array of recommendations.
 */
export const getRecommendations = async (interest: string): Promise<Recommendation[]> => {
  try {
    const prompt = `أنت محرك توصيات ذكي لمنصة "خِبرة" لتبادل المهارات في السعودية. بناءً على اهتمام المستخدم بـ "${interest}"، قم بإنشاء 5 ملفات شخصية لخبراء وهميين. لكل خبير، قدم اسمًا، ومهارة محددة تتعلق بالاهتمام، وتقييمًا من 1 إلى 5، ورابط صورة رمزية باستخدام "https://picsum.photos/seed/UNIQUE_SEED/100/100"، وسببًا قصيرًا ومقنعًا باللغة العربية يوضح لماذا هذا الخبير مناسب للمستخدم.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recommendationSchema,
            temperature: 0.8,
        }
    });

    const jsonText = response.text.trim();
    const recommendations = JSON.parse(jsonText);
    return recommendations as Recommendation[];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Return dummy data on error to maintain UI stability
    return getDummyRecommendations(interest);
  }
};

/**
 * Generates suggestions to improve a user's profile bio.
 * @param bio The current profile biography.
 * @returns A promise that resolves to an array of suggestion strings.
 */
export const getProfileSuggestions = async (bio: string): Promise<string[]> => {
    try {
        const prompt = `أنت مدرب مهني ذكي في منصة "خِبرة". النص التالي هو الوصف الشخصي لمستخدم. قدم 3 اقتراحات موجزة وعملية باللغة العربية لجعله أكثر احترافية وجاذبية للمتعلمين. وصف المستخدم هو: "${bio}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: profileSuggestionsSchema,
                temperature: 0.7,
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data.suggestions || [];
    } catch (error) {
        console.error("Error fetching profile suggestions:", error);
        return ["حدث خطأ أثناء جلب الاقتراحات. يرجى التأكد من إعداد مفتاح API بشكل صحيح في بيئة النشر."];
    }
};

/**
 * Simulates content moderation for chat messages.
 * @param message The text of the message to analyze.
 * @returns A promise resolving to 'safe' or 'flagged'.
 */
export const moderateMessage = async (message: string): Promise<'safe' | 'flagged'> => {
    try {
        const prompt = `You are a content safety classifier. Analyze the following message and determine if it contains spam, fraud, or inappropriate content. Respond with only "SAFE" or "FLAGGED". Message: "${message}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0,
                // Disable thinking for faster classification
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        
        const result = response.text.trim().toUpperCase();
        if (result === 'FLAGGED') {
            return 'flagged';
        }
        return 'safe';
    } catch (error) {
        console.error("Error moderating message:", error);
        return 'safe'; // Default to safe in case of an error
    }
};

/**
 * Continues a chat conversation with the AI.
 * @param message The user's message.
 * @returns A promise that resolves to the bot's response text.
 */
export const continueChat = async (message: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error continuing chat:", error);
        return "عذراً، حدث خطأ أثناء التواصل مع المساعد. يرجى التأكد من أن مفتاح API صحيح ومعد بشكل جيد.";
    }
};


// Fallback dummy data function
const getDummyRecommendations = (interest: string): Recommendation[] => {
    return [
        { id: 'dummy1', name: 'خالد الصالح', skill: `مقدمة في ${interest}`, rating: 4.8, avatar: 'https://picsum.photos/seed/khalid/100/100', reason: 'لديه خبرة واسعة في هذا المجال ويقدم شروحات مبسطة.' },
        { id: 'dummy2', name: 'نورة المحمد', skill: `تقنيات متقدمة في ${interest}`, rating: 4.9, avatar: 'https://picsum.photos/seed/noura/100/100', reason: 'خبيرة معتمدة وحاصلة على تقييمات ممتازة من المتعلمين.' },
        { id: 'dummy3', name: 'عبدالعزيز التركي', skill: `${interest} للمبتدئين`, rating: 4.7, avatar: 'https://picsum.photos/seed/aziz/100/100', reason: 'أسلوبه صبور ومناسب لمن يبدأ من الصفر.' },
    ];
};