import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-pro-image-preview';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  referenceImageUrl?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9';
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return res.status(500).json({ 
      error: 'Gemini API 키가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.' 
    });
  }

  try {
    const { prompt, style, referenceImageUrl, aspectRatio = '1:1' }: ImageGenerationRequest = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '프롬프트가 필요합니다.' });
    }

    // 프롬프트 구성
    const fullPrompt = `Create a detailed graphic novel illustration. ${prompt}${style ? `, ${style} style` : ''}, ${aspectRatio} aspect ratio, square format, high quality, detailed illustration, graphic novel style, cinematic lighting, vibrant colors.`;

    const requestBody: any = {
      contents: [
        {
          parts: [
            { text: fullPrompt },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    };

    // 참조 이미지가 있는 경우 추가 (캐릭터 일관성 유지)
    if (referenceImageUrl) {
      try {
        let base64Image: string;
        let mimeType: string = 'image/png';

        if (referenceImageUrl.startsWith('data:')) {
          // data URL인 경우
          const parts = referenceImageUrl.split(',');
          base64Image = parts[1];
          mimeType = parts[0].split(';')[0].split(':')[1];
        } else {
          // URL인 경우
          const imageResponse = await axios.get(referenceImageUrl, { 
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
          });
          
          const bytes = new Uint8Array(imageResponse.data);
          const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          base64Image = btoa(binary);
          
          const contentType = imageResponse.headers['content-type'];
          if (contentType) {
            mimeType = contentType;
          }
        }
        
        requestBody.contents[0].parts.push({
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        });
        
        // 프롬프트에 참조 지시 추가
        requestBody.contents[0].parts[0].text = `${fullPrompt}. Keep the character consistent with the reference image.`;
      } catch (refError) {
        console.warn('Failed to load reference image, continuing without it:', refError);
      }
    }

    console.log('Sending request to Gemini API:', { 
      model: GEMINI_MODEL, 
      prompt: fullPrompt.substring(0, 100),
      hasReference: !!referenceImageUrl,
      aspectRatio,
    });

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 120초 타임아웃
        responseType: 'json',
      }
    );

    console.log('Gemini API response received:', {
      status: response.status,
      hasCandidates: !!response.data.candidates,
      candidatesLength: response.data.candidates?.length,
    });

    const candidates = response.data.candidates;
    if (!candidates || candidates.length === 0) {
      console.error('No candidates in response:', response.data);
      return res.status(500).json({ error: '이미지 생성 응답에 후보가 없습니다.' });
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      console.error('Invalid content structure:', content);
      return res.status(500).json({ error: '응답 형식이 올바르지 않습니다.' });
    }

    // 이미지 데이터 추출
    const imagePart = content.parts.find((part: any) => 
      part.inlineData || part.url || (part.text && (part.text.includes('http') || part.text.includes('data:')))
    );
    
    if (!imagePart) {
      console.error('No image part found. Available parts:', content.parts);
      const textPart = content.parts.find((part: any) => part.text);
      if (textPart) {
        const text = textPart.text.trim();
        console.error('⚠️ Gemini API가 이미지 대신 텍스트를 반환했습니다:', text.substring(0, 300));
        return res.status(500).json({ 
          error: `이미지가 생성되지 않았습니다. API가 텍스트를 반환했습니다: ${text.substring(0, 200)}` 
        });
      }
      return res.status(500).json({ error: '응답에서 이미지 데이터를 찾을 수 없습니다.' });
    }

    let imageUrl: string;
    let imageId: string = Date.now().toString();

    if (imagePart.inlineData) {
      // base64 인코딩된 이미지인 경우
      const base64Data = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      if (!base64Data) {
        return res.status(500).json({ error: 'base64 이미지 데이터가 비어있습니다.' });
      }
      imageUrl = `data:${mimeType};base64,${base64Data}`;
    } else if (imagePart.url) {
      // URL인 경우
      imageUrl = imagePart.url;
      imageId = imagePart.url.split('/').pop() || imageId;
    } else if (imagePart.text) {
      // 텍스트로 이미지 URL이 반환되는 경우
      const text = imagePart.text.trim();
      
      if (text.startsWith('http://') || text.startsWith('https://')) {
        imageUrl = text;
      } else if (text.startsWith('data:')) {
        imageUrl = text;
      } else if (text.length > 100 && /^[A-Za-z0-9+/=]+$/.test(text)) {
        // base64 데이터만 있는 경우
        imageUrl = `data:image/png;base64,${text}`;
      } else {
        return res.status(500).json({ 
          error: `이미지 생성에 실패했습니다. API 응답: ${text.substring(0, 200)}` 
        });
      }
    } else {
      return res.status(500).json({ error: '지원하지 않는 이미지 형식입니다.' });
    }

    if (!imageUrl || imageUrl.length < 10) {
      return res.status(500).json({ error: '유효하지 않은 이미지 URL입니다.' });
    }

    console.log('Image URL generated successfully, length:', imageUrl.length);

    return res.status(200).json({
      imageUrl,
      imageId,
    });
  } catch (error) {
    console.error('Gemini API error details:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        return res.status(401).json({ error: 'Gemini API 키가 유효하지 않습니다. API 키를 확인해주세요.' });
      } else if (statusCode === 403) {
        return res.status(403).json({ error: 'Gemini API 접근이 거부되었습니다. API 키 권한을 확인해주세요.' });
      } else if (statusCode === 429) {
        return res.status(429).json({ error: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' });
      } else if (statusCode === 400) {
        return res.status(400).json({ error: `잘못된 요청입니다: ${errorMessage}` });
      } else if (statusCode === 500) {
        return res.status(500).json({ error: 'Gemini 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
      } else if (statusCode === 503) {
        return res.status(503).json({ error: 'Gemini 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' });
      }
      
      return res.status(statusCode || 500).json({ error: `Gemini API 오류: ${errorMessage}` });
    }
    
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : '이미지 생성 중 알 수 없는 오류가 발생했습니다.' 
    });
  }
}

