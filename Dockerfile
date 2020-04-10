FROM node:12.16.1

LABEL maintainer="xlrj0716@gmail.com"

# 앱 디렉터리 생성
# RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
RUN rm -rf package-lock.json
COPY package*.json ./


VOLUME [ "/usr/src/app" ]

# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --only=production

ENV PORT=3000

# ENV MONGODB_URI=mongodb+srv://test:1234@moon-zpapa.mongodb.net/test?retryWrites=true&w=majority

# ENV PASSWORD_HASH_KEY='PASSWORD_HASH_KEY_1$1$234'

# ENV JWT_SECRET=PROTOTYPE_JWT_SECRET_KEY_1$1$234

# ENV JWT_SECRET2=PROTOTYPE_REFREASH_JWT_SECRET_KEY_1$1$234


# 앱 소스 추가
# COPY . .

# COPY . /usr/src/app

RUN npm install





EXPOSE 3000

#RUN npm start

CMD ["./node_modules/.bin/babel-node", "--presets=latest", "./dist/bin/www" ]

