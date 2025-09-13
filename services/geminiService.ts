
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { OutfitItem } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType
    },
  };
};

export const generateTryOnImage = async (userImage: string, outfitItems: OutfitItem[]): Promise<string | null> => {
  const userMimeType = userImage.substring(userImage.indexOf(":") + 1, userImage.indexOf(";"));
  
  const userImagePart = fileToGenerativePart(userImage, userMimeType);
  const outfitParts = outfitItems.map(item => {
      const mimeType = item.data.substring(item.data.indexOf(":") + 1, item.data.indexOf(";"));
      return fileToGenerativePart(item.data, mimeType);
  });
  
  const prompt = `
    You are a virtual stylist expert. Your task is to realistically dress the person in the first image with the provided clothing items. 
    The first image is the reference model. The subsequent images are clothing items, likely on a plain background.
    1.  Identify the person in the first image.
    2.  For each subsequent clothing item image, remove its background.
    3.  Place the clothing items onto the person, layering them correctly and replacing any existing clothes they are wearing in the corresponding areas.
    4.  Ensure the fit, drape, lighting, and shadows of the new clothes are realistic and match the person's pose and body shape.
    5.  Preserve the original background from the person's photo. The final image should have the newly dressed person in their original environment.
    6.  Output only the final image. Do not output any text.
  `;

  const contents = {
    parts: [userImagePart, ...outfitParts, { text: prompt }],
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents,
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
