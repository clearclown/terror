# 環境変数ファイルの設定ガイド

## 📍 ファイルの場所

環境変数ファイルは以下の場所にあります：

```
/home/ablaze/research/terror/web/.env
```

または、プロジェクトルートから：

```
web/.env
```

## 📝 設定方法

### 1. ファイルの作成

`.env.example`ファイルをコピーして`.env`ファイルを作成してください：

```bash
cd web
cp .env.example .env
```

### 2. APIキーの設定

`.env`ファイルを開いて、使用するAIプロバイダーのAPIキーを設定してください。

#### OpenAIを使用する場合
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

#### DeepSeekを使用する場合（最もコスト効率が良い）
```bash
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-actual-deepseek-api-key-here
```

#### Claudeを使用する場合
```bash
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-api-key-here
```

#### Geminiを使用する場合
```bash
AI_PROVIDER=gemini
GOOGLE_API_KEY=your-actual-google-api-key-here
```

## 🔑 APIキーの取得方法

### OpenAI
1. https://platform.openai.com/api-keys にアクセス
2. アカウントを作成またはログイン
3. "Create new secret key"をクリック
4. 生成されたキーをコピー

### DeepSeek（推奨：コスト効率が良い）
1. https://platform.deepseek.com/api-keys にアクセス
2. アカウントを作成またはログイン
3. APIキーを生成
4. 生成されたキーをコピー

### Anthropic Claude
1. https://console.anthropic.com/settings/keys にアクセス
2. アカウントを作成またはログイン
3. "Create Key"をクリック
4. 生成されたキーをコピー

### Google Gemini
1. https://aistudio.google.com/apikey にアクセス
2. Googleアカウントでログイン
3. "Create API Key"をクリック
4. 生成されたキーをコピー

## ⚠️ 重要な注意事項

1. **`.env`ファイルはGitにコミットされません**
   - `.gitignore`に含まれているため、安全です
   - APIキーが漏洩する心配はありません

2. **使用するプロバイダーのAPIキーのみ設定すればOK**
   - すべてのAPIキーを設定する必要はありません
   - `AI_PROVIDER`で指定したプロバイダーのキーのみ必要です

3. **ファイルの権限**
   - `.env`ファイルは読み取り専用に設定することを推奨します：
   ```bash
   chmod 600 .env
   ```

4. **機密情報の取り扱い**
   - APIキーなどの機密情報は`.env`ファイルにのみ記述してください
   - その他のファイル（コード、設定ファイル、ドキュメント）には機密情報を書き込まないでください

## 🔍 設定の確認

APIキーが正しく設定されているか確認するには：

```bash
# 開発サーバー起動後、以下のエンドポイントにアクセス
curl http://localhost:3005/api/chat/health
```

または、ブラウザで：
```
http://localhost:3005/api/chat/health
```

## 📋 現在の設定状況

`.env`ファイルを編集して、実際のAPIキーを設定してください。

**ファイルパス**: `/home/ablaze/research/terror/web/.env`
