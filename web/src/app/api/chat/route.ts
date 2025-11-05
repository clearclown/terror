import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// 環境変数から使用するAIプロバイダーを取得
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'

// OpenAI / DeepSeek (OpenAI互換API)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
})

// Anthropic Claude の動的インポート
let Anthropic: any
if (typeof window === 'undefined') {
  import('@anthropic-ai/sdk').then((module) => {
    Anthropic = module.default
  }).catch(() => {
    console.warn('Anthropic SDK not available')
  })
}

// Google Gemini の動的インポート
let GoogleGenerativeAI: any
if (typeof window === 'undefined') {
  import('@google/generative-ai').then((module) => {
    GoogleGenerativeAI = module.GoogleGenerativeAI
  }).catch(() => {
    console.warn('Google Generative AI SDK not available')
  })
}

export async function POST(req: NextRequest) {
  try {
    const { messages, organizationName } = await req.json()

    // システムプロンプト
    const systemPrompt = `あなたはテロ組織や武装グループに関する情報を提供する専門的なAIアシスタントです。

【役割】
- ${organizationName}に関する質問に、正確でわかりやすく回答する
- 中立的かつ客観的な立場を保つ
- 情報源の信頼性を考慮し、不確実な情報は明示する
- 難しい用語は説明を加える

【回答スタイル】
- 簡潔かつ明確に
- 「子供にもわかるように」等の指定があれば、そのレベルに合わせる
- 複雑な概念は例えを使って説明
- 必要に応じて箇条書きを使用

【注意事項】
- テロ行為を賛美したり、過激思想を助長しない
- 被害者への配慮を忘れない
- 教育・研究目的であることを念頭に置く
- 不正確な情報を提供しない（わからない場合は正直に言う）`

    let assistantMessage: string
    let provider: string

    // プロバイダー別の処理
    switch (AI_PROVIDER.toLowerCase()) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          return fallbackResponse(organizationName)
        }
        assistantMessage = await callOpenAI(messages, systemPrompt)
        provider = 'OpenAI (GPT-4o-mini)'
        break

      case 'deepseek':
        if (!process.env.DEEPSEEK_API_KEY) {
          return fallbackResponse(organizationName)
        }
        assistantMessage = await callDeepSeek(messages, systemPrompt)
        provider = 'DeepSeek'
        break

      case 'claude':
      case 'anthropic':
        if (!process.env.ANTHROPIC_API_KEY) {
          return fallbackResponse(organizationName)
        }
        assistantMessage = await callClaude(messages, systemPrompt)
        provider = 'Claude (Anthropic)'
        break

      case 'gemini':
      case 'google':
        if (!process.env.GOOGLE_API_KEY) {
          return fallbackResponse(organizationName)
        }
        assistantMessage = await callGemini(messages, systemPrompt)
        provider = 'Gemini (Google)'
        break

      default:
        // デフォルトはOpenAI
        if (!process.env.OPENAI_API_KEY) {
          return fallbackResponse(organizationName)
        }
        assistantMessage = await callOpenAI(messages, systemPrompt)
        provider = 'OpenAI (default)'
    }

    return NextResponse.json({
      message: assistantMessage,
      provider,
    })
  } catch (error: any) {
    console.error('AI API Error:', error)

    let errorMessage = 'AIサービスでエラーが発生しました。'
    if (error.status === 429) {
      errorMessage = '現在、利用が集中しています。しばらく待ってから再度お試しください。'
    } else if (error.status === 401) {
      errorMessage = 'API認証エラーが発生しました。'
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

// フォールバック応答
function fallbackResponse(organizationName: string) {
  return NextResponse.json(
    {
      error: 'AI service not configured',
      fallbackResponse: `申し訳ございません。現在AIサービスが利用できません。${organizationName}についての詳細は、組織詳細ページをご覧ください。`,
    },
    { status: 200 }
  )
}

// OpenAI API 呼び出し
async function callOpenAI(messages: any[], systemPrompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })
  return completion.choices[0]?.message?.content || '回答を生成できませんでした。'
}

// DeepSeek API 呼び出し (OpenAI互換)
async function callDeepSeek(messages: any[], systemPrompt: string): Promise<string> {
  const completion = await deepseek.chat.completions.create({
    model: 'deepseek-chat', // DeepSeek V3
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })
  return completion.choices[0]?.message?.content || '回答を生成できませんでした。'
}

// Claude API 呼び出し
async function callClaude(messages: any[], systemPrompt: string): Promise<string> {
  if (!Anthropic) {
    const module = await import('@anthropic-ai/sdk')
    Anthropic = module.default
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  })

  // Claudeの形式に変換（systemは別パラメータ）
  const claudeMessages = messages.map((msg: any) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content,
  }))

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022', // コスト効率の良いモデル
    max_tokens: 1000,
    system: systemPrompt,
    messages: claudeMessages,
  })

  return response.content[0]?.type === 'text' ? response.content[0].text : '回答を生成できませんでした。'
}

// Gemini API 呼び出し
async function callGemini(messages: any[], systemPrompt: string): Promise<string> {
  if (!GoogleGenerativeAI) {
    const module = await import('@google/generative-ai')
    GoogleGenerativeAI = module.GoogleGenerativeAI
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash', // コスト効率の良いモデル
    systemInstruction: systemPrompt,
  })

  // Geminiの形式に変換
  const chat = model.startChat({
    history: messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })),
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.content)
  return result.response.text() || '回答を生成できませんでした。'
}
