# Next.jsアプリケーション用のDockerfile
FROM node:18-alpine AS base

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@latest --activate

# 依存関係のインストールステージ
FROM base AS deps
WORKDIR /app

# package.jsonとpnpm-lock.yamlをコピー
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ビルドステージ
FROM base AS builder
WORKDIR /app

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 環境変数を設定（ビルド時に必要）
ENV NEXT_TELEMETRY_DISABLED 1

# アプリケーションをビルド
RUN pnpm build

# 本番実行ステージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 必要なファイルをコピー
# publicディレクトリが存在しない場合は空のディレクトリを作成
RUN mkdir -p ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env* ./

# ポートを公開
EXPOSE 3005

ENV PORT 3005
ENV HOSTNAME "0.0.0.0"

# アプリケーションを起動
CMD ["pnpm", "start"]
