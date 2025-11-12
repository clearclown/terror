# 未実装・未接続箇所の一覧

## 📄 存在しないページ

### 1. ✅ `/events/[id]` - イベント詳細ページ（実装済み）
**状況**: ✅ 実装完了
**実装箇所**:
- `web/src/app/events/[id]/page.tsx` - サーバーコンポーネント（SSG対応）
- `web/src/app/events/[id]/EventDetailClient.tsx` - クライアントコンポーネント
- `web/src/app/events/[id]/EventDetailClient.test.tsx` - テストファイル

**実装内容**:
- generateStaticParams による静的ページ生成
- イベントIDでの詳細情報表示（日付、場所、被害者数、影響、関連組織など）
- データソース: `web/src/data/events.json`
- notFound() による404ハンドリング
- チャット機能統合（FixedChatButton, ModalChatWindow）
- 難易度切替機能（EnhancedDifficultyToggle）

### 2. `/countries/[id]` - 国詳細ページ
**状況**: ページが存在しない  
**参照箇所**:
- `web/src/app/countries/page.tsx` (58行目) - リンクが存在
- `web/src/app/layout.tsx` (33行目) - ナビゲーションに含まれている

**必要な実装**:
```
web/src/app/countries/[id]/page.tsx
```
- 国IDを受け取り、詳細情報を表示
- データソース: `web/src/data/countries.json`
- 表示内容: 脅威レベル、活動組織、主要事件、対テロ対策など

## 🔌 API接続の問題

### 1. `/api/chat` - AIチャットAPI ✅ **解決済み**
**状況**: 環境設定が完了し、正常に動作可能

**ファイル**: `web/src/app/api/chat/route.ts`

**実装内容**:
- ✅ `web/.env.example` を `web/.env` にコピー
- ✅ 環境変数設定のドキュメントを `web/README.md` に追記
- ✅ エラーハンドリングが適切に実装されている（タイムアウト、レート制限、認証エラーなど）
- ✅ 4つのAIプロバイダーに対応:
  - OpenAI (GPT-4o-mini)
  - DeepSeek (DeepSeek V3)
  - Anthropic Claude (Claude 3.5 Haiku)
  - Google Gemini (Gemini 1.5 Flash)

**使用方法**:
1. `web/.env` ファイルを開く
2. 使用したいAIプロバイダーを `AI_PROVIDER` に設定（例: `openai`）
3. 対応するAPIキーを設定（例: `OPENAI_API_KEY=sk-...`）
4. 開発サーバーを起動: `pnpm dev`

詳細は `web/README.md` の「AIチャット機能の設定」セクションを参照してください。

**参照箇所**:
- `web/src/features/chat/ModalChatWindow.tsx` (47行目)
- `web/src/features/chat/ChatPanel.tsx` (31行目)

## 🔗 リンクエラーの可能性

### 1. 組織詳細ページへのリンク
**状況**: 動的ルートが正しく動作しているか要確認

**参照箇所**:
- `web/src/app/organizations/page.tsx` (30, 61, 93行目)
- `web/src/app/organizations/[id]/OrganizationDetailClient.tsx` (219行目)
- `web/src/features/organizations/OrganizationMap.tsx` (210行目)
- `web/src/features/organizations/OrganizationRelationshipCard.tsx` (91, 132行目)

**確認事項**:
- `web/src/app/organizations/[id]/page.tsx`は存在する ✅
- `generateStaticParams`が正しく実装されている ✅

### 2. 関係図ページへのリンク
**状況**: ページは存在する ✅

**参照箇所**:
- `web/src/app/organizations/[id]/OrganizationDetailClient.tsx` (232行目)
- `web/src/features/organizations/OrganizationRelationshipCard.tsx` (163行目)

## 📊 データファイルの確認

### 存在するデータファイル
- ✅ `web/src/data/organizations.json`
- ✅ `web/src/data/events.json`
- ✅ `web/src/data/countries.json`
- ✅ `web/src/data/relationships.json`

### データ構造の確認
- ✅ events.jsonには個別イベントの詳細データが含まれている
- ✅ countries.jsonには個別国の詳細データが含まれている
- ✅ データは詳細ページの実装に使用可能な構造になっている

## 🎯 優先度別の実装推奨順序

### 高優先度
1. ✅ **`/events/[id]`ページの実装** - 実装完了（2025-11-12）
2. **`/countries/[id]`ページの実装** - ユーザーがクリックすると404エラーになる
3. ~~**API環境変数の設定確認** - AIチャット機能が動作しない~~ ✅ **解決済み**

### 中優先度
4. エラーハンドリングの強化（404ページなど）
5. ローディング状態の改善

### 低優先度
6. ページネーションの実装（イベント一覧が多くなった場合）
7. 検索機能の追加

## 🔍 確認コマンド

```bash
# 存在しないページの確認
ls -la web/src/app/events/[id]/ 2>&1
ls -la web/src/app/countries/[id]/ 2>&1

# 環境変数の確認（開発サーバー起動時）
cd web
cat .env 2>/dev/null || echo ".envファイルが存在しません"

# APIエンドポイントの確認
curl http://localhost:3005/api/chat -X POST -H "Content-Type: application/json" -d '{"messages":[],"organizationName":"test"}'
```
