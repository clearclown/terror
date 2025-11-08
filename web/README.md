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

## 🌐 VPNアクセスとポート設定

このアプリケーションは、TailscaleなどのVPN経由でアクセスできるように設定されています。

### デフォルト設定

- **ホスト**: `0.0.0.0`（すべてのネットワークインターフェースでリッスン）
- **ポート**: `3000`

### 環境変数での設定

`.env`ファイルを作成して、以下の環境変数を設定できます：

```bash
# サーバーのホストアドレス
# 0.0.0.0: すべてのネットワークインターフェース（VPN経由アクセス可能）
# localhost: ローカルホストのみ
HOST=0.0.0.0

# サーバーのポート番号
# ポート競合がある場合は変更してください
PORT=3005
```

### 使用方法

1. **環境変数ファイルの作成**:
   ```bash
   cp .env.example .env
   ```

2. **設定の変更**（必要に応じて）:
   `.env`ファイルを編集して、`HOST`と`PORT`を設定します。

3. **サーバーの起動**:
   ```bash
   # 開発サーバー
   pnpm dev
   
   # 本番サーバー
   pnpm start
   ```

4. **VPN経由でのアクセス**:
   - TailscaleなどのVPNが有効な場合、VPNのIPアドレスでアクセスできます
   - 例: `http://100.x.x.x:3005`（TailscaleのIPアドレス）

### ポート競合の解決

ポート3005が既に使用されている場合：

```bash
# 方法1: 環境変数で設定
PORT=3006 pnpm dev

# 方法2: .envファイルで設定
# PORT=3006
```

### セキュリティ注意事項

⚠️ **重要**: `HOST=0.0.0.0`に設定すると、すべてのネットワークインターフェースでリッスンします。
- VPN経由でのアクセスのみを許可したい場合は、ファイアウォール設定を確認してください
- 本番環境では、適切なセキュリティ対策（HTTPS、認証など）を実装してください

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

### ポート3005が使用中
```bash
# 環境変数でポート変更
PORT=3006 pnpm dev

# または .env ファイルで設定
# PORT=3006
```

### VPN経由でアクセスできない
1. `.env`ファイルで`HOST=0.0.0.0`が設定されているか確認
2. ファイアウォール設定を確認（ポートがブロックされていないか）
3. VPNのIPアドレスが正しいか確認

### ビルドエラー
```bash
# キャッシュクリア
rm -rf .next
pnpm build
```

---

**Status**: 🚧 Active Development
