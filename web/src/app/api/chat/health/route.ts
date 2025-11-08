import { NextRequest, NextResponse } from 'next/server'

// API接続状態を確認するエンドポイント
export async function GET(req: NextRequest) {
  const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'
  
  // 環境変数の設定状況を確認
  const providers = {
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) + '...' || 'not set',
    },
    deepseek: {
      configured: !!process.env.DEEPSEEK_API_KEY,
      keyPrefix: process.env.DEEPSEEK_API_KEY?.substring(0, 7) + '...' || 'not set',
    },
    claude: {
      configured: !!process.env.ANTHROPIC_API_KEY,
      keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7) + '...' || 'not set',
    },
    gemini: {
      configured: !!process.env.GOOGLE_API_KEY,
      keyPrefix: process.env.GOOGLE_API_KEY?.substring(0, 7) + '...' || 'not set',
    },
  }

  const selectedProvider = AI_PROVIDER.toLowerCase()
  const isConfigured = providers[selectedProvider as keyof typeof providers]?.configured || false

  return NextResponse.json({
    status: isConfigured ? 'configured' : 'not_configured',
    selectedProvider,
    providers: process.env.NODE_ENV === 'development' ? providers : undefined,
    message: isConfigured
      ? `API is configured for ${selectedProvider}`
      : `API is not configured. Please set ${selectedProvider.toUpperCase()}_API_KEY in .env`,
  })
}
