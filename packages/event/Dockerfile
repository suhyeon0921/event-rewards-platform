FROM node:18

WORKDIR /app

# 루트 파일 복사
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
# 모든 패키지 복사
COPY packages ./packages

# 작업 디렉토리 변경
WORKDIR /app/packages/event

# 루트 디렉토리에서 pnpm install 실행
RUN npm install -g pnpm && cd /app && pnpm install

RUN pnpm build

EXPOSE 3002

CMD ["node", "dist/main"]

