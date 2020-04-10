FROM node:12.16.1

LABEL maintainer="xlrj0716@gmail.com"

# 앱 디렉터리 생성
# RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN rm -rf package-lock.json
COPY package*.json ./

VOLUME [ "/usr/src/app" ]

# 프로덕션을 위한 코드를 빌드하는 경우

ENV PORT=3000

# RUN npm install


EXPOSE 3000

#RUN npm start

CMD ["./node_modules/.bin/babel-node", "./dist/bin/www" ]

