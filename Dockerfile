FROM node:12.16.1

LABEL maintainer="xlrj0716@gmail.com"

# 앱 디렉터리 생성
# RUN mkdir /usr/src/app
WORKDIR /usr/src/api

RUN rm -rf package.json
RUN rm -rf package-lock.json

COPY . .


# 프로덕션을 위한 코드를 빌드하는 경우

ENV PORT=4000

RUN npm install

#RUN npm run build

EXPOSE 4000

#RUN npm start

CMD ["npm", "start"]

