# 6. Testing in NestJS

이번 수업에서는 NestJS에서의 Testing에 대해 다룹니다. 

👉 [NestJS: Testing](https://docs.nestjs.com/fundamentals/testing)

세미나 시작 전에 제가 미리 세팅한 코드를 다운받아 주세요.

👉 [Go to code](./start_testing/)

코드를 다운 받고 `npm install` 후에 API가 잘 동작하는지 확인해주세요!!

## Introduction to Testing

먼저 가장 간단한 형태의 Testing을 진행해보겠습니다.

`src/` 폴더에 `app.controller.spec.ts` 파일을 생성하고, 아래의 내용을 복-붙 해주세요!

``` ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
```

사실 별 내용은 아니고 NestJS App을 만들때 자동으로 생성되는 `app.controller.spec.ts` 파일의 내용을 다시 작성한 것에 불과합니다 🤪

먼저 이 코드를 기준으로 코드에서 사용된 함수들을 좀 살펴보겠습니다.

1\. `describe('AppController', () => {...})`

`describe()`의 인자로 들어가는 String은 단순히 하나의 테스트 케이스를 정의하는 이름에 불과합니다. 테스트 로직에는 아무 관계가 없습니다!

2\. `it('some testing description', () => {...})`

`describe()`가 테스트 케이스의 이름을 정의했다면, `it()`은 테스트 케이스에 대한 설명을 정의합니다.

3\. `beforeEach()`

`beforeEach()`는 각 테스트 케이스를 실행하기 이전에 선행할 코드가 작성됩니다. 이 코드에서는 `AppController`와 `AppService`를 사용하는 어떤 모듈을 정의한 상황입니다.

4\. `expect('value-you-get').toBe('want-to-get')`

`expect()`와 `.toBe()`에는 테스트 하고자 하는 값과 정답 값이 들어갑니다. 단순히 `assert`나 `if()`문을 쓰지 않는 이유는 이 두 함수로 값을 테스트하면 Test Report가 알아서 작성되기 때문입니다!! (뒤에 나올 예시와 함께 이해하자!)

일단 위의 코드를 실행시켜 봅시다. `app.controller.spec.ts`에서 바로 실행시킬 수도 있고, 또는 `npm run test`를 통해 Test를 수행할 수도 있습니다!!


이번에는 `toBe()`의 값을 임의로 변경해 Test에 실패하는 경우도 발생시켜 봅시다!

이번에는 `package.json` 파일에서 Test와 관련해서 어떤 명령어들이 있는지 한번 살펴봅시다! 한번 아래의 명령어를 실행해서 Code Coverage를 확인해봅시다 😁

``` bash
npm run test:cov
```

그러면, 현재 Test한 코드가 NestJS App의 어느 정도의 코드를 테스트 하고 있는지 그 "커버리지; Coverage"를 리포트 합니다! 코드 커버리지는 Testing을 통해 App의 신뢰도를 평가하는 좋은 기준이 됩니다. 모든 Testing을 통과했고, 코드 커버리지 역시 높다면, 그 App은 에러가 날 확률이 적다고 평가할 수 있습니다 😁

ps) 코드 커버리지를 측정하는 방식으로는 여러 가지 방법이 있습니다. 코드 커버리지에 대해 더 알고 싶다면, 아래의 포스트를 참고해주세요!

👉 [코드 커버리지(Code Coverage)가 뭔가요?](https://woowacourse.github.io/javable/post/2020-10-24-code-coverage/)

## Test with Database

앞에서 살펴본 예제는 단순히 string을 리턴하는 API를 테스트 해본 것에 불과합니다. 우리가 개발하는 API의 대부분은 더 복잡하고 또 Database를 사용합니다. 이번에는 Database를 사용하는 API를 테스트 하는 방법을 살펴봅시다! 😎

먼저 `cat/` 폴더에 `cat.controller.spec.ts` 파일을 생성하고, 아래의 코드를 작성해줍니다.

``` ts
import { Test, TestingModule } from "@nestjs/testing";
import { CatController } from "./cat.controller";
import { CatService } from "./cat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "./cat.entity";

describe("Cat Controller", () => {
  let catController: CatController;
  let catModule: TestingModule;

  const catDto1 = {
    name: "test cat"
  };

  beforeAll(async () => {
    catModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [Cat],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Cat])
      ],
      controllers: [CatController],
      providers: [CatService]
    }).compile();

    catController = catModule.get<CatController>(CatController);
  });

  afterAll(async () => {
    catModule.close();
  });
});
```

`beforeAll()`, `afterAll()` 함수는 이것을 포함하는 `describe()` 함수가 호출될 때, 딱 한번씩 호출되는 함수입니다. 이 코드에서는 테스트 모듈을 생성하고, 닫는 작업을 수행합니다.

이제 테스트 케이스를 작성해봅시다!! 간단하게 아직 아무것도 넣지 않은 상태에서 `GET` 요청을 보냈을 때, 빈 Array `[]`를 얻는지 확인해봅시다.

``` ts
  describe("GET empty", () => {
    it("should return empty arr", async () => {
      expect(await catController.getAll()).toEqual([]);
    });
  });
```

위의 과정을 수행하고, `npm run test:cov`로 코드 커버리지를 확인해봅시다. 이때, 다음 과정과 코드 커버리지를 비교하기 위해 얻은 결과값을 캡쳐해둡니다!

이번에는 `POST` API를 테스트 해봅시다. `POST`의 response를 확인하고, `GET`으로 생성된 Entity를 조회하는 과정을 테스트 합니다.

``` ts
  describe("POST one cat", () => {
    it("should create cat entity", async () => {
      expect(await catController.post(catDto1))
        .toEqual({
          id: 1,
          name: "test cat"
        });
    });

    it("should get a cat entity", async () => {
      expect(await catController.getOne("1"))
        .toEqual({
          id: 1,
          name: "test cat"
        });
    });
  });
```

이번에도 `npm run test:cov`로 코드 커버리지를 확인해 이전의 코드 커버리지와 비교해봅시다!!

🎈 `PUT`, `DELETE` API에 Testing은 HW입니다 ㅎㅎ

### Database Test by Mocking

지금 우리가 수행하고 있는 테스팅 작업을 \<Unit Test\>라고 합니다. Unit Test란 Method가 잘 동작하는지 테스트 하는 것을 의미합니다. 만약 모듈이나 App 자체를 테스트한다면, \<Integration Testing\> 또는 \<System Testing\> 등으로 불립니다.

본래 \<Unit Test\>를 수행할 때는 Database와 같은 외부 API를 사용에 대한 의존성 없이 오로지 \<Unit Test\> 대상 자체에 테스트하는 환경을 만들어야 한다고 합니다. 그 이유는 외부 의존성을 적절히 제거하지 않으면, Test Fail이 발생했을 때, 이것이 테스트 대상에 의해 발생한 Fail인지 외부 API 때문에 발생한 Fail인지 판단할 수 없기 때문입니다.

그래서 \<Unit Test\>에서는 데이터베이스와 같은 외부 API를 \<Mocking\>이라는 기법을 사용해 외부 서비스에 독립적이 되도록 만듭니다. \<Unit Test\>와 \<모킹; Mocking\>에 대해 좀더 알고 싶다면, 제가 예전에 작성한 포스트를 참고해주세요! 👉 [Why Mocking?](https://bluehorn07.github.io/2021/01/13/nestjs-testing.html#mockrepository)

우리가 Database를 쓰는 API를 테스트할 때 외부 API는 `Repository`가 됩니다. 그래서 이번에는 `Repository`를 mocking해 테스트를 진행하는 코드를 소개합니다.

<br/>

이번에는 `Service`에 대한 테스트를 진행해봅시다. `cat.service.spec.ts` 파일을 생성하고, 아래의 코드를 작성합니다.

``` ts
import { CatService } from "./cat.service";
import { Cat } from "./cat.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

class CatMockRepository {

}

describe('Cat Service', () => {
  let catModule: TestingModule;
  let catService: CatService;

  beforeAll(async () => {
    catModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getRepositoryToken(Cat),
          useClass: CatMockRepository,
        },
      ],
    }).compile();
    catService = catModule.get<CatService>(CatService);
  });

  
});
```

우리는 `CatMockRepository`로 기존 `Repository`를 대체하여 테스팅을 진행할 예정입니다. `Repository`에 정의된 `find()`, `save()` 등의 함수를 `CatMockRepository`에 구현해야 합니다.

``` ts
class CatMockRepository {
  private catEntities: Cat[] = [];

  async find() {
    return this.catEntities;
  }
}

describe('Cat Service', () => {
  ...
  describe("find empty", () => {
    it("should get empty arr", async () => {
      expect(await catService.find()).toEqual([]);
    })
  });
});
```

이번에는 `save()`함수를 테스트해봅시다. `CatMockRepository`에 필요한 함수들을 구현하고, 테스트 케이스를 정의합니다.

``` ts
class CatMockRepository {
  ...
  async save(dto) {
    const newCatEntity = Object.assign({
      id: this.catEntities.length + 1
    }, dto);
    this.catEntities.push(newCatEntity);
    return newCatEntity;
  }

  async findOne(query) {
    for (const catEntity of this.catEntities) {
      if (catEntity.id == query.id) {
        return catEntity;
      }
    }
    return null;
  }
}

describe('Cat Service', () => {
  ...
  describe("save one cat", () => {
    it("should create a cat entity", async () => {
      expect(await catService.save(catDto1))
        .toEqual({
          id: 1,
          name: "test cat"
        });
    });

    it("should get a cat entity", async () => {
      expect(await catService.findOne("1"))
        .toEqual({
          id: 1,
          name: "test cat"
        });
    });
  });
});
```

전체 테스트가 잘 동작하는지 `npm run test`로 확인해봅시다! 😁

## 맺음말

Testing은 좋은 코드를 작성하고, App의 신뢰도를 보장하는 중요한 작업입니다. 여러분이 상업적인 목적의 App을 작성하거나, 회사 또는 오픈소스에 대한 코드를 작성한다면, Testing을 통해 안정성을 보장해야 합니다.

\<TDD; Test Driven-Development\>는 개발 패러다임 중 하나로, Test를 먼저 작성해 코드에 대한 pre-condition, post-condition을 미리 설정한 후에, 실제 개발을 진행하는 개발 패러다임 입니다. 실제 개발에서는 위의 이유들 때문에 TDD 프로세를 통해 Test에 의해 개발이 주도됩니다.

// 물론 현실에선 숙제 등등 이것저것 일이 바빠서 TDD를 실천하기는 쉽지 않습니다 ㅠㅠ
