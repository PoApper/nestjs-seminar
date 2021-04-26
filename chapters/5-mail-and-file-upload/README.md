# 5. Mailing & File Upload

NestJS 서버를 이용해 Mail을 보내봅시다! 그리고 Web에서 업로드한 파일을 NestJS에서 핸들링 해봅시다!

## Mailing

먼저 `src/mail/` 폴더를 생성한 후, `mail.module.ts`와 `mail.service.ts` 파일을 생성합니다.

``` ts
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
```

``` ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  
}
```

우리는 `NestJS`에서 지원하는 `@nestjs-modules/mailer`를 통해 mailing 기능을 쉽게 도입할 수 있습니다! [link](https://github.com/nest-modules/mailer)

먼저 아래의 두 명령어를 통해 모듈을 설치해줍니다.

```
npm install --save @nestjs-modules/mailer nodemailer
npm install --save-dev @types/nodemailer
```

설치 후에는 아래와 같이 `mailer` 모듈을 사용할 수 있도록 세팅해줍니다!


``` ts
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // 만약 Gmail이 아닌 다른 메일 서비스를 사용한다면, 이곳도 바꿔줘야 합니다!
        port: 587,
        auth: {
          user: "USER GOOGLE ID",
          pass: "USER GOOGLE PW"
        }
      }
    })
  ],
  ...
})
export class MailModule {}
```

``` ts
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
  }
  
}
```

이때, `smtp`는 "Simple Mail Transfer Protocol"의 약자로 메일을 보낼 때 쓰는 프로토콜입니다. 별로 중요한 건 아니라서, 그냥 메일 보낼 때는 `smtp`를 쓴다 정도만 알고 넘어가면 충분합니다. 👉 [stmp란?](https://cheershennah.tistory.com/104)

자! 이제 `MailService`에 아래와 같이 메일을 보내는 함수를 작성해봅시다!

``` ts
sendSimpleMail(email: string, from: string) {
    return this.mailerService.sendMail({
      to: email,
      from: from, // 보통 이 부분은 .env의 config module을 사용합니다.
      subject: `Hello My First Mail!`,
      html: `
      <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
          <h1>Hello My First Mail!</h1>
          <p>첫 메일을 축하합니다! 👍✨</p>
        </body>
      </html>
      `
    })
}
```

자 이제! `AppController`에서 `MailService`를 테스트 해봅시다!

``` ts
  @Get("simple-mail")
  sendSimpleMail() {
    return this.mailService.sendSimpleMail("XXXXX@postech.ac.kr", "YYYYYY@gmail.com");
  }
```

이때, 바로 메일을 전송을 테스트하면, Gmail의 보안 규정에 의해 접근이 제한되어 아래와 같은 오류 메시지를 받게 됩니다.

``` bash
Error: Invalid login: 535-5.7.8 Username and Password not accepted. Learn more at
```

그래서 `https://www.google.com/settings/security/lesssecureapps` 이곳에 접속하여 "보안 수준이 낮은 앱의 액세스"를 허용해야 합니다!

성공적으로 메일이 전송되었다면, 아래의 `response`를 얻습니다.

``` json
{
    "accepted":["XXXXXX@postech.ac.kr"],
    "rejected":[],
    "envelopeTime":609,
    "messageTime":496,
    "messageSize":613,
    "response":"250 2.0.0 OK  HELLOHELLO - gsmtp",
    "envelope":{"from":"YYYYYYY@gmail.com",
    "to":["XXXXXX@postech.ac.kr"]},
    "messageId":"<ABCDEFG@gmail.com>"
}
```

💥 만약 본인의 계정으로 계속 메일을 보낼 것이 아니라면, 구글 계정의 보안 수준을 다시 복구해주세요! 👉 `https://www.google.com/settings/security/lesssecureapps`


## File Upload

이번에는 프론트의 `POST` 요청에 의해 들어오는 파일을 서버에서 핸들링하는 기능을 도입해봅시다! 이번 파트는 NestJS Doc의 [File Upload](https://docs.nestjs.com/techniques/file-upload) 부분에 대한 내용입니다 🤩

먼저 업로드한 파일을 모아두기 위한 `/uploads` 폴더를 루트 경로에 생성합니다.

그리고 아래의 코드를 작성하고 Postman API Tester를 이용해 테스트해봅시다!

``` ts
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file);
    fs.writeFile(`uploads/{file.originalname}`, file.buffer, () => {}); // <- 이 부분을 작성해야 파일이 저장 됩니다!
  }
```

만약 여러 개의 파일을 업로드 하는 경우라면, `FilesInterceptor`를 사용하면 됩니다!

``` ts
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files) {
    console.log(files);
    files.map(file => {
      fs.writeFile(`uploads/${file.originalname}`, file.buffer, () => {}); // <- 이 부분을 추가해줘야 파일이 저장 됩니다!
    })
  }
```

`FilesInterceptor`에 `maxCount` 인자를 사용하면, 최대 몇개의 파일을 핸들링 할지도 설정해줄 수 있습니다 😊

만약 복수의 Field를 사용해 파일을 업로드 한다면, 아래와 같은 코드를 사용할 수도 있습니다.

``` ts
  @Post('uploads-multi')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]))
  uploadFilesMulti(@UploadedFiles() files) {
    console.log(files);
    // 이하 동일!
  }
```


## (Optional) File Upload

💥 아래의 방법은 `options` 인자를 사용해 File Upload를 수행하는 방법입니다. 저는 원래 이 방법으로 파일을 핸들링하고 있었는데, NestJS 공식 도큐의 내용이 가볍게 파일 핸들링하기 좋을 것 같아서 아래 내용은 선택 사항으로 맡기겠습닏!! 아래 내용도 그렇게 어렵진 않으니, 궁금하신 분은 한번 천천히 살펴보세요!! 😊

먼저 `AppController`에 `POST` 요청을 받기 위한 미들웨어를 하나 작성합시다. 편의를 위해 이미지 파일을 전송하는 경우를 생각해봅시다.

``` ts
  @Post("upload-image")
  uploadImage() { }
```

다음은 파일을 업로드하기 위해 POST 미들웨어와 아래와 같이 `Intercepter`를 추가해줍니다!

``` ts
import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
...
  @Post("upload-image")
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: "./uploads",
      })
    })
  )
  uploadImage() { }
```

이제, `app.controller.ts` 파일은 잠시 두고, `src/utils` 폴더에 `fileUpload.ts` 파일을 생성해 아래의 내용을 붙여넣어줍니다.

``` ts
// src/utils/fileUpload.ts

import {HttpException, HttpStatus} from "@nestjs/common";
import {extname} from "path";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|JPG|png|PNG|gif)$/i)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const dateBasedName = Date.now();
  callback(null, `${name}-${dateBasedName}${fileExtName}`);
};
```

다시 `app.controller.ts`로 돌아와서 `FileIntercepter`를 아래와 같이 완성해줍니다.

``` ts
  @Post("upload-image")
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: "./uploads",
        filename: editFileName
      }),
      fileFilter: imageFileFilter
    })
  )
  uploadImage() {
    console.log("이미지를 저장했습니다!");
  }
```

이제 Postman API Tester를 이용해 이미지가 잘 저장되는지 확인해보자!! 본인이 가진 파일 중 적당한 파일을 하나 업로드해보자!!

이번에는 시험 삼아 이미지 파일 형식(`JPG`, `PNG`, ...)이 아닌 다른 파일을 한번 업로드 해보자. 이 경우, 이미지 `imageFileFilter`에서 확장자를 확인해 `400` 오류가 뱉게 된다.

만약 업로드한 이미지에 대한 정보를 확인하고 싶다면, `uploadImage()` 함수에 아래의 인자를 추가해주자!

``` ts
  uploadImage(@UploadedFile() file) {
    console.log(file);
    ...
  }
```





