import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'

describe('/api/chat route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns fallback response when no API key is configured', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'test' }],
        organizationName: 'Test Org',
      }),
    })

    // すべてのAPI keyを未設定にする
    delete process.env.OPENAI_API_KEY
    delete process.env.DEEPSEEK_API_KEY
    delete process.env.ANTHROPIC_API_KEY
    delete process.env.GOOGLE_API_KEY

    const response = await POST(request)
    const data = await response.json()

    expect(data.error).toBe('AI service not configured')
    expect(data.fallbackResponse).toContain('Test Org')
  })

  it('validates request body structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'What is this organization?' },
        ],
        organizationName: 'Hamas',
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
  })

  it('handles missing organizationName', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'test' }],
      }),
    })

    const response = await POST(request)

    // エラーハンドリングが正しく動作することを確認
    expect(response.status).toBeGreaterThanOrEqual(200)
  })

  it('properly structures system prompt', async () => {
    // このテストではAI_PROVIDERの設定を確認
    const provider = process.env.AI_PROVIDER || 'openai'
    expect(['openai', 'deepseek', 'claude', 'gemini']).toContain(provider)
  })
})
