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

// リクエストバリデーション
interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  organizationName: string
  contextType?: 'organization' | 'event'
}

function validateRequest(body: any): { valid: boolean; error?: string; data?: ChatRequest } {
  if (!body) {
    return { valid: false, error: 'リクエストボディが空です' }
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return { valid: false, error: 'messagesは必須で、配列形式である必要があります' }
  }

  if (!body.organizationName || typeof body.organizationName !== 'string' || body.organizationName.trim().length === 0) {
    return { valid: false, error: 'organizationNameは必須の文字列です' }
  }

  // メッセージの形式を検証
  for (const msg of body.messages) {
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      return { valid: false, error: 'メッセージのroleは"user"または"assistant"である必要があります' }
    }
    if (!msg.content || typeof msg.content !== 'string') {
      return { valid: false, error: 'メッセージのcontentは必須の文字列です' }
    }
  }

  return { valid: true, data: body as ChatRequest }
}

// 環境変数の検証
function getAvailableProvider(): { provider: string; hasKey: boolean } {
  const provider = AI_PROVIDER.toLowerCase()
  
  switch (provider) {
    case 'openai':
      return { provider: 'openai', hasKey: !!process.env.OPENAI_API_KEY }
    case 'deepseek':
      return { provider: 'deepseek', hasKey: !!process.env.DEEPSEEK_API_KEY }
    case 'claude':
    case 'anthropic':
      return { provider: 'claude', hasKey: !!process.env.ANTHROPIC_API_KEY }
    case 'gemini':
    case 'google':
      return { provider: 'gemini', hasKey: !!process.env.GOOGLE_API_KEY }
    default:
      return { provider: 'openai', hasKey: !!process.env.OPENAI_API_KEY }
  }
}

export async function POST(req: NextRequest) {
  let organizationName = '組織' // デフォルト値
  let contextType: 'organization' | 'event' = 'organization' // デフォルト値
  
  try {
    // JSONパースのエラーハンドリング
    let body: any
    try {
      body = await req.json()
    } catch (error) {
      console.error('JSON parse error:', error)
      return NextResponse.json(
        {
          error: 'リクエストのJSON形式が不正です',
          fallbackResponse: '申し訳ございません。リクエストの形式が正しくありません。',
        },
        { status: 400 }
      )
    }

    // リクエストバリデーション
    const validation = validateRequest(body)
    if (!validation.valid) {
      console.error('Validation error:', validation.error)
      return NextResponse.json(
        {
          error: validation.error,
          fallbackResponse: '申し訳ございません。リクエストの内容が正しくありません。',
        },
        { status: 400 }
      )
    }

    const { messages, organizationName: orgName, contextType: ctxType = 'organization' } = validation.data!
    organizationName = orgName // スコープ外でも使用できるように設定
    contextType = ctxType // スコープ外でも使用できるように設定

    // システムプロンプト（コンテキストタイプに応じて変更）
    const isEvent = contextType === 'event'
    const contextLabel = isEvent ? 'テロ事件' : 'テロ組織や武装グループ'
    const subjectLabel = isEvent ? 'この事件' : 'この組織'
    
    const systemPrompt = `あなたは${contextLabel}に関する情報を提供する専門的なAIアシスタントです。

【役割】
- ${organizationName}${isEvent ? 'について' : 'に関する'}質問に、正確でわかりやすく回答する
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

    // 環境変数の検証
    const { provider: selectedProvider, hasKey } = getAvailableProvider()
    
    if (!hasKey) {
      console.warn(`API key not configured for provider: ${selectedProvider}`)
      return fallbackResponse(organizationName, selectedProvider, contextType)
    }

    let assistantMessage: string
    let provider: string

    // プロバイダー別の処理（タイムアウト付き）
    try {
      switch (selectedProvider) {
        case 'openai':
          assistantMessage = await Promise.race([
            callOpenAI(messages, systemPrompt),
            timeoutPromise(30000, 'OpenAI API呼び出しがタイムアウトしました')
          ])
          provider = 'OpenAI (GPT-4o-mini)'
          break

        case 'deepseek':
          assistantMessage = await Promise.race([
            callDeepSeek(messages, systemPrompt),
            timeoutPromise(30000, 'DeepSeek API呼び出しがタイムアウトしました')
          ])
          provider = 'DeepSeek'
          break

        case 'claude':
          assistantMessage = await Promise.race([
            callClaude(messages, systemPrompt),
            timeoutPromise(30000, 'Claude API呼び出しがタイムアウトしました')
          ])
          provider = 'Claude (Anthropic)'
          break

        case 'gemini':
          assistantMessage = await Promise.race([
            callGemini(messages, systemPrompt),
            timeoutPromise(30000, 'Gemini API呼び出しがタイムアウトしました')
          ])
          provider = 'Gemini (Google)'
          break

        default:
          assistantMessage = await Promise.race([
            callOpenAI(messages, systemPrompt),
            timeoutPromise(30000, 'API呼び出しがタイムアウトしました')
          ])
          provider = 'OpenAI (default)'
      }
    } catch (apiError: any) {
      // API呼び出しエラーを再スローして、外側のcatchで処理
      throw apiError
    }

    return NextResponse.json({
      message: assistantMessage,
      provider,
    })
  } catch (error: any) {
    console.error('AI API Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      provider: getAvailableProvider().provider,
    })

    let errorMessage = 'AIサービスでエラーが発生しました。'
    let statusCode = 500

    // エラータイプ別の処理
    if (error.message?.includes('タイムアウト')) {
      errorMessage = 'リクエストがタイムアウトしました。しばらく待ってから再度お試しください。'
      statusCode = 504
    } else if (error.status === 429 || error.code === 'rate_limit_exceeded') {
      errorMessage = '現在、利用が集中しています。しばらく待ってから再度お試しください。'
      statusCode = 429
    } else if (error.status === 401 || error.code === 'invalid_api_key') {
      errorMessage = 'API認証エラーが発生しました。設定を確認してください。'
      statusCode = 401
    } else if (error.status === 400 || error.code === 'invalid_request_error') {
      errorMessage = 'リクエストが不正です。'
      statusCode = 400
    } else if (error.status === 503 || error.code === 'service_unavailable') {
      errorMessage = 'AIサービスが一時的に利用できません。しばらく待ってから再度お試しください。'
      statusCode = 503
    }

    const pageType = contextType === 'event' ? 'イベント詳細ページ' : '組織詳細ページ'
    return NextResponse.json(
      {
        error: errorMessage,
        fallbackResponse: `${errorMessage} ${organizationName}についての詳細は、${pageType}をご覧ください。`,
        ...(process.env.NODE_ENV === 'development' && {
          details: {
            message: error.message,
            status: error.status,
            code: error.code,
          },
        }),
      },
      { status: statusCode }
    )
  }
}

// タイムアウト用のPromise
function timeoutPromise(ms: number, message: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms)
  })
}

// フォールバック応答
function fallbackResponse(organizationName: string, provider?: string, contextType: 'organization' | 'event' = 'organization') {
  const providerName = provider || AI_PROVIDER
  console.warn(`Fallback response: API key not configured for ${providerName}`)
  const pageType = contextType === 'event' ? 'イベント詳細ページ' : '組織詳細ページ'
  
  return NextResponse.json(
    {
      error: 'AI service not configured',
      fallbackResponse: `申し訳ございません。現在AIサービスが利用できません。${organizationName}についての詳細は、${pageType}をご覧ください。`,
      ...(process.env.NODE_ENV === 'development' && {
        details: {
          provider: providerName,
          message: `環境変数が設定されていません。.envファイルで${providerName.toUpperCase()}_API_KEYを設定してください。`,
        },
      }),
    },
    { status: 200 }
  )
}

// OpenAI API 呼び出し
async function callOpenAI(messages: any[], systemPrompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('OpenAI API returned empty response')
    }
    return content
  } catch (error: any) {
    // OpenAI SDKのエラーを適切に処理
    if (error.status) {
      error.status = error.status
    }
    if (error.code) {
      error.code = error.code
    }
    throw error
  }
}

// DeepSeek API 呼び出し (OpenAI互換)
async function callDeepSeek(messages: any[], systemPrompt: string): Promise<string> {
  try {
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek V3
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })
    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('DeepSeek API returned empty response')
    }
    return content
  } catch (error: any) {
    if (error.status) {
      error.status = error.status
    }
    if (error.code) {
      error.code = error.code
    }
    throw error
  }
}

// Claude API 呼び出し
async function callClaude(messages: any[], systemPrompt: string): Promise<string> {
  try {
    if (!Anthropic) {
      const anthropicModule = await import('@anthropic-ai/sdk')
      Anthropic = anthropicModule.default
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

    const content = response.content[0]?.type === 'text' ? response.content[0].text : null
    if (!content) {
      throw new Error('Claude API returned empty response')
    }
    return content
  } catch (error: any) {
    if (error.status) {
      error.status = error.status
    }
    if (error.code) {
      error.code = error.code
    }
    throw error
  }
}

// Gemini API 呼び出し
async function callGemini(messages: any[], systemPrompt: string): Promise<string> {
  try {
    if (!GoogleGenerativeAI) {
      const geminiModule = await import('@google/generative-ai')
      GoogleGenerativeAI = geminiModule.GoogleGenerativeAI
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
    const content = result.response.text()
    if (!content) {
      throw new Error('Gemini API returned empty response')
    }
    return content
  } catch (error: any) {
    if (error.status) {
      error.status = error.status
    }
    if (error.code) {
      error.code = error.code
    }
    throw error
  }
}
