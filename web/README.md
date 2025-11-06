# 世界安全情報プラットフォーム - Web フロントエンド

このディレクトリにはNext.js 14ベースのWebフロントエンドが含まれています。

## 🚀 セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# 本番サーバーの起動
pnpm start
```

## 📁 ディレクトリ構造

```
src/
├── app/                 # Next.js App Router ページ
│   ├── layout.tsx       # ルートレイアウト
│   ├── page.tsx         # ホームページ
│   ├── organizations/   # 組織ページ
│   ├── events/          # 事件タイムライン
│   └── countries/       # 国別情報
│
├── features/            # 機能モジュール
│   ├── difficulty/      # 難易度切り替え
│   ├── chat/            # AIチャット
│   ├── organizations/   # 組織機能
│   ├── events/          # イベント機能
│   └── countries/       # 国別機能
│
├── components/          # 共通コンポーネント
│   └── ui/              # shadcn/ui
│
├── hooks/               # カスタムフック
├── lib/                 # ユーティリティ
└── config/              # 設定ファイル
```

## 🎨 主要機能

### 1. 難易度切り替え（未来議会ベース）
```tsx
import { DifficultyToggle } from '@/features/difficulty/DifficultyToggle'

<DifficultyToggle
  simpleText="わかりやすい説明"
  detailedText="詳細な専門的説明"
/>
```

### 2. AIチャット
```tsx
import { ChatPanel } from '@/features/chat/ChatPanel'

<ChatPanel organizationName="組織名" />
```

## 🛠️ 技術スタック

- **Next.js 14**: App Router, Server Components
- **TypeScript**: 型安全
- **Tailwind CSS**: スタイリング
- **Radix UI**: UIプリミティブ
- **Lucide React**: アイコン

## 📊 データ統合

JSONデータは `/data` ディレクトリから読み込まれます：

```typescript
import organizationsData from '../../data/organizations.json'
import eventsData from '../../data/events.json'
import countriesData from '../../data/countries.json'
```

## 🎯 開発ガイドライン

### ページ追加

```bash
# 新しいページを追加
mkdir -p src/app/your-page
touch src/app/your-page/page.tsx
```

### 機能モジュール追加

```bash
# 新しい機能を追加
mkdir -p src/features/your-feature
touch src/features/your-feature/YourFeature.tsx
```

## 🚧 TODO

- [ ] AI API統合（OpenAI / Claude）
- [ ] ふりがな機能実装
- [ ] テキスト選択機能
- [ ] 地図表示（Leaflet / Mapbox）
- [ ] タイムライン可視化
- [ ] ダークモード対応
- [ ] 多言語対応（i18n）

## 📝 コーディング規約

- コンポーネントはPascalCase
- ファイル名はコンポーネント名と一致
- 'use client'は必要な場合のみ
- Server Componentsを優先

## 🧪 テスト

```bash
pnpm test
```

## 🔧 トラブルシューティング

### ポート3000が使用中
```bash
# ポート変更
pnpm dev -p 3001
```

### ビルドエラー
```bash
# キャッシュクリア
rm -rf .next
pnpm build
```

---

**Status**: 🚧 Active Development
