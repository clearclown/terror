import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenAIクライアントの初期化
// 環境変数 OPENAI_API_KEY が必要です
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { messages, organizationName } = await req.json()

    // APIキーが設定されていない場合のフォールバック
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          fallbackResponse: `申し訳ございません。現在AIサービスが利用できません。${organizationName}についての詳細は、組織詳細ページをご覧ください。`,
        },
        { status: 200 }
      )
    }

    // システムプロンプト: テロ組織情報の専門家として振る舞う
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // コスト効率の良いモデルを使用
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const assistantMessage = completion.choices[0]?.message?.content || '回答を生成できませんでした。'

    return NextResponse.json({
      message: assistantMessage,
      usage: completion.usage,
    })
  } catch (error: any) {
    console.error('OpenAI API Error:', error)

    // エラーの種類に応じたメッセージ
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
