# 3. Database

데이터베이스는 백엔드 개발을 함에 있어 기초이자 핵심이 되는 부분입니다. 이번 챕터에서는 `NestJS` 프레임워크에서 어떻게 데이터베이스를 사용할 수 있는지 살펴보겠습니다.

👉오늘 다루는 내용은 NestJS의 [Database](https://docs.nestjs.com/techniques/database) 부분을 실습하게 됩니다!

## Set-up

먼저 Database를 운용하기 위한 라이브러리들을 설치합니다. NestJS 공식 문서에서는 `mysql`을 사용하는 방식으로 나와있는데, 이번 세미나에서는 좀더 가벼운 `sqlite3`을 사용해 진행하도록 하겠습니다!

``` bash
$ npm install --save @nestjs/typeorm typeorm sqlite3
```

이후에 데이터베이스를 쓰기 위한 설정을 `AppModule`에 아래와 같이 등록합니다.

``` ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: "db-dev.sqlite",
      entities: ["dist/**/*.entity{.ts,.js}"]
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

그리고 루트 경로에 우리가 사용할 `db-dev.sqlite` 파일을 생성합니다. `SQLite`의 경우 `MySQL`과 달리 로컬 파일이 데이터베이스의 기능을 수행합니다. `**.sqlite`와 같은 파일 하나가 MySQL의 `database` 개념에 대응된다고 보시면 됩니다! 🤩

## CRUD API

다음은 `Entity`를 만들어 보겠습니다. 이번 세미나에서는 간단하게 공지사항을 수행할 수 있는 "**게시판 DB**"를 만들어 보도록 하겠습니다.

### Set-up

먼저 게시판 API를 위한 `Module`을 만들어 줍니다. 저번 세미나에서 진행한 내용이니 설명은 생략하겠습니다. `NestJS CLI`를 활용하시면 좀더 편하게 모듈을 만들 수 있습니다 😎

- `board.module.ts` 생성
- `board.controller.ts` 생성
- `board.service.ts` 생성
- 이때, DTO는 만들지 만들지 말아주세요! DTO는 곧 등장할 `Entity` 이후에 만들 예정입니다!

### Create Entitiy File

이제 본격적으로 Entity를 만들어봅시다! `src/board/` 폴더에 `board.entity.ts` 파일을 생성하고, 아래와 같이 `Entity`의 틀을 만들어 줍니다.

``` ts
import { Entity } from 'typeorm';

@Entity()
export class Board {

}
```

이제 게시판에 들어가야 하는 내용들을 살펴봅시다. 

- `board_id`: PrimaryGeneratedColumn / string
- `title`: Column / string
- `content`: Column / text
- `views`: Column / nubmer
- `CreatedAt`: CreateDateColumn / Date
- `UpdatedAt`: UpdateDateColumn / Date

와 같습니다. 위의 설계도를 바탕으로 직접 Entity를 채워봅시다.

``` ts
@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column()
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

이런 `Entity`는 데이터베이스에서 `Table`에 대응되는 개념입니다. 우리는 Entity를 정의하고, App에 연결함으로써 SQL 문으로 테이블을 만들지 않고도 손쉽게 테이블을 만들고, 수정할 수 있습니다. 이런 기능은 `TypeORM`의 큰 장점으로 꼽힙니다! 😆

### Connect Entity to Module

이제 Board Entity를 Board 모듈에 연결해봅시다. 먼저 `board.module.ts`에서 우리가 이 모듈에서 Board Entity를 사용함을 명시해야 합니다.

``` ts
@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
```

이번에는 `board.service.ts`에서 `Board`에 대한 `Repository`를 만들어 줍시다. 이때, \<Repository\>에 대해 간단히 설명하자면, 우리는 Repository에서 제공하는 함수들을 이용해 DB 테이블에 Query를 날릴 수 있습니다. 원래는 이것 역시 직접 SQL 쿼리문을 작성해야 했지만, \<Repository\>를 사용하면, 함수를 호출함으로써 SQL Query를 대체할 수 있습니다!

``` ts
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>
  ) {}

}
```

### Implement CRUD API

이제 본격적으로 CRUD API를 만들어봅시다. 지금부터는 `board.serivce.ts`와 `board.controller.ts`를 번갈아가며 작업을 하게 됩니다.

#### GET API

먼저 CRUD에서 `GET` API를 먼저 생성해봅시다. `board.serivce.ts`에서 아래의 두 함수를 작성합니다.

``` ts
  find() {
    return this.boardRepo.find();
  }

  findOne(id: string) {
    return this.boardRepo.findOne({id: id});
  }
```

이번에는 `board.controller.ts`에서 작성한 `find()`, `findOne()` 함수를 사용하는 GET API를 만들어 봅시다.

``` ts
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {
  }
  
  @Get()
  getAllBoard() {
    return this.boardService.find();
  }

  @Get(':id')
  getOneBoard(@Param('id') id: string){
    return this.boardService.findOne(id);
  }
}
```

이제 GET API가 잘 동작하는지 확인해봅시다. `localhost:3000/board`에 GET query를 날려줍시다!!

```
[]
```

그러면 빈 array를 얻게 됩니다! 우리가 DB에 아무런 정보도 넣지 않았으니 당연한 결과입니다 😊

#### POST API

이번에는 `POST` API를 구현해봅시다. 그런데 POST API를 구현하기 위해서는 `Body`를 사용해야 하는데 이를 위해 먼저 `board.dto.ts`를 구현해줍시다.

``` ts
export class BoardDto {
  readonly title: string;
  readonly content: string;
}
```

다시 `board.service.ts`로 돌아와서 아래의 코드를 작성해줍니다. 

``` ts
save(dto: BoardDto) {
  return this.boardRepo.save({
    title: dto.title,
    content: dto.content,
    views: 0
  })
}
```

🎈 첨언하자면, 우리가 정의한 `Board` Entity에서 일부인 `title`, `content`, `views`에 대해서만 인자로 넘겼습니다. `id`, `createdAt`, `updatedAt` 컬럼은 모두 Entity가 생성되면서 자동으로 설정되기 때문에 인자로 넘겨주지 않아도 됩니다!

이제 `board.controller.ts`로 돌아와서 POST API를 작성합니다.

``` ts
@Post()
postBoard(@Body() dto :BoardDto) {
  return this.boardService.save(dto);
}
```

이제 우리가 작성한 POST API가 잘 동작하는지 확인해봅시다. 아래와 같이 body를 구성해 query를 날려줍니다. → `POST localhost:3000/board`

``` json
{
  "title": "Hello NestJS!",
  "content": "My first POST API!"
}
```

아래와 같은 response를 얻습니다.

``` json
{
  "title": "Hello NestJS!",
  "content": "My first POST API!",
  "views": 0,
  "id": 1,
  "createdAt": "2021-04-05T11:40:49.000Z",
  "updatedAt": "2021-04-05T11:40:49.000Z"
}
```

앞서 작성한 GET API로도 확인해봅시다. → `GET localhost:3000/board`

#### PUT / DELETE API

`GET`과 `POST`만 알면, `PUT`과 `DELETE`는 금방하기 때문에 별도로 설명하지는 않고, 코드만 제시하고 넘어가도록 하겠습니다. 

``` ts
// board.service.ts

...
update(id: string, dto: BoardDto) {
  return this.boardRepo.update({ id: id }, {
    title: dto.title,
    content: dto.content
  });
}

delete(id: string) {
  return this.boardRepo.delete({ id: id });
}
```

``` ts
// board.controller.ts

...
@Put(":id")
putBoard(@Param("id") id: string, @Body() dto: BoardDto) {
  return this.boardService.update(id, dto);
}

@Delete(":id")
deleteBoard(@Param("id") id: string) {
  return this.boardService.delete(id);
}
```

<hr/>

넵!!! 이것으로 우리는 `NestJS`와 `TypeORM`으로 CRUD API를 만드는 방법을 살펴보았습니다 😆

## Database Relationship

현실에서 각 객체들은 서로 완전히 격리되어 있는 상태로 존재하는 것이 아니라 어느 정도 "relationship"을 맺으며 존재한다. 데이터베이스에서도 마찬가지다! 어떤 Entity는 다른 Entity와 "relaionship"을 맺으며 사용된다. 이번 파트에서는 세 가지 DB Relationship을 다루게 된다.

1. OneToOne
2. OneToMany / ManyToOne
3. ManyToMany

🎈 여기서부터는 복사-붙여넣기를 적극적으로 활용합시다!!

### OneToOne

실제 코딩에 들어가기 전에 Entitiy만 먼저 살펴보자. `User`와 `Profile`에 대한 Entitiy다.

``` ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
}
```

``` ts
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  gender: string;

  @Column()
  user_id: string;
}
```

한 명의 `User`는 자신에 대한 프로필 `Profile`을 가진다. 그래서 `User`과 `Profile`은 서로 1:1로 대응되게 된다. 우리는 이런 관계를 `OneToOne` Relationship이라고 한다.

만약, 우리가 User GET API를 통해 `User`에 대한 정보를 받아온다고 해보자. 그런데, 이때, `User`에 대응되는 `Profile`까지 함께 얻고자 한다고 생각해보자. 그러면, 우리가 지금까지 배운 방법에서 이것을 구현해보면,

1. `GET /profile/1`로 `Profile` 정보 얻음
2. `Profile`에 저장된 `user_id`를 바탕으로 `GET /user/[user_id]`로 대응하는 `User` 정도 얻음
3. (`GET`이 아니라 `DELETE`를 수행한다고 해도 비슷한 흐름으로 작업을 반복한다)

물론 이렇게 구현해도 기능적으로는 `OneToOne`을 구현한 것이다. 하지만, TypeORM의 `@OneToOne()` 데코레이터를 사용하면 `GET /profile/1`만으로 쉽게 해결할 수 있다!!

일단 `OneToOne`을 구현하기 위한 준비를 해보자. `User` 모듈과 `Profile` 모듈을 생성해준다. 이 부분은 멘토가 미리 코딩을 해뒀으니 다운 받아서 사용하도록 하자! 😉

(실습) 먼저 `OneToOne`을 쓰지 않은 상태에서 POST로 `User`와 `Profile` Entity를 생성해보자.

<br/>

이제 `OneToOne`을 도입보자. `profile.entity.ts`에 아래의 코드를 추가해준다.

``` ts
@OneToOne(() => User)
@JoinColumn()
user: User;
```

그리고 `profile.service.ts`를 아래와 같이 수정해준다.

``` ts
constructor(
  @InjectRepository(Profile)
  private readonly profileRepo: Repository<Profile>,
  private readonly userService: UserService
) {
}

...

async save(dto: ProfileDto) {
  const existUser = await this.userService.findOne(dto.user_id);

  return this.profileRepo.save({
    gender: dto.gender,
    user: existUser
    // user_id: dto.user_id
  });
}
```

수정이 완료되면, 다시 POST 요청을 보내보자! → `POST /profile`

``` json
{
  "gender": "Male",
  "user_id": "1"
}
```

아래와 같은 response를 얻는다.

``` json
{
    "gender": "Male",
    "user": {
        "id": 1,
        "name": "BlueHorn07"
    },
    "id": 2
}
```

이번에는 GET 요청으로 확인해보자. → `GET /profile`

이 경우네는 response와 달리 `user`에 대한 정보가 출력되지 않는다. 이건 `profile.service.ts`의 `find()` 함수에 아래와 같이 `{ relations: ["user"] }` 옵션을 주면 `user` 정보를 함께 출력하도록 만들 수 있다.

``` ts
find() {
  return this.profileRepo.find({ relations: ["user"] });
}
```

이것으로 `OneToOne`에 대해 살펴봤다!! OneToOne은 각 객체에 1:1로 맺어진다. 위의 예제에서는 `Profile`에서 OneToOne을 설정해줬지만, 반대로 `User`에서 OneToOne을 설정할 수도 있고, `Profile`, `User`에서 동시에 `OneToOne` 설정을 해줄 수도 있다. 더 자세한 내용은 TypeORM의 공식 문서를 더 읽어보도록 하자 👉 [link](https://typeorm.io/#/one-to-one-relations/)

### OneToMany / ManyToOne

이번에는 두번재 relationship인 `OneToMany` / `ManyToOne`을 살펴보자. 이 경우는 두 객체가 1:N으로 맺어지는 경우를 말한다. 예를 통해 살펴보자.

앞에서 구현한 `User`과 `Board`의 관계게 대해 생각해보자. 한 명의 유저는 여러 개의 게시글을 작성할 수 있다. 반대로 하나의 게시글을 오직 하나의 유저에 대응한다. 그래서 `User`과 `Board`는 1:N 즉, `OneToMany` / `ManyToOne` 으로 맺어졌다고 볼 수 있다!

이런 관계를 구현하기 위해 각 entity를 아래와 같이 수정하자.

``` ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  /**
   * Database Relationship
   */

  @OneToMany(() => Board, board => board.user)
  boards: Board[];
}
```

``` ts
@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: string;

  ...

  /**
   * Database Relationship
   */

  @ManyToOne(() => User, user => user.boards)
  user: User;
}
```

이제 `board.dto.ts`에 `user_id` 항목을 추가하고, `board.module.ts`에 `UserModule`을 추가하고, `board.service.ts`를 아래와 같이 수정해주자.

``` ts
@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    private readonly userService: UserService
  ) {
  }

  find() {
    return this.boardRepo.find({ relations: ["user"] });
  }

  ...

  async save(dto: BoardDto) {
    const existUser = await this.userService.findOne(dto.user_id);

    return this.boardRepo.save({
      title: dto.title,
      content: dto.content,
      views: 0,
      user: existUser
    });
  }

  ...
}
```

이제 relation을 고려해 다시 POST 요청을 보내보자. → `POST /board`

그러면 response는 아래와 같다.


``` json
{
    "title": "OneToMany test",
    "content": "test!",
    "views": 0,
    "user": {
        "id": 1,
        "name": "BlueHorn07"
    },
    "id": 2,
    "createdAt": "2021-04-05T13:25:39.000Z",
    "updatedAt": "2021-04-05T13:25:39.000Z"
}
```

GET 요청으로도 확인해보자. → `GET /borad`

(심심하면, `user.service.ts`에서도 `{ relations: ["boards"]}`로 테스트 해보자!)

`OneToOne`과 달리 `OneToMany` / `ManyToOne`은 "무조건" 두 Entity 모두에게 설정을 해줘야 한다는 점을 주의하자! 더 자세한 내용은 TypeORM의 공식 문서를 참고하자 👉 [link](https://typeorm.io/#/many-to-one-one-to-many-relations)

### ManyToMany

이 경우는 두 객체가 M:N으로 맺어진 관계를 말한다. `User`와 `Board`의 예시를 그대로 가져오자면, 게시글 하나에 유저 여러명이 엮여있는 상태라고 볼 수 있다. 코드로 구현한다면, `board.entity.ts`에 아래와 같은 컬럼을 추가하고, `dto`과 `serivce` 부분을 잘 수정하면 된다.

``` ts
@ManyToMany(() => User)
@JoinTable()
users: User[];
```

사실 ManyToMany는 앞의 두 relationship에 비해서 자주 쓰는 타입은 아니다. 경우에 따라서는 `@ManyToMany()` 데코레이터를 쓰는 것보단 로직을 직접 구현해서 쓰는게 더 편리할 수도 있다. `ManyToMany` 역시 앞의 두 relationship과 비슷한 패턴이기 때문에 간단히 소개만 하고 넘어가도록 하겠다. 더 자세한 내용은 TypeORM의 공식 문서를 참고하자 👉 [link](https://typeorm.io/#/many-to-many-relations)

<hr/>

## Homework

1\. Board API에 대해 `getOne(id)`를 호출할 때마다 Board entity의 `views`가 1씩 증가하도록 구현할 것

2\. 현실 또는 웹상에서 `OneToOne`, `OneToMany`/`ManyToOne`, `ManyToMany`로 관계맺는 상황의 예시를 각각 하나씩 생각해볼 것

3\. 마지막에 언급한 `ManyToMany`를 `Board`, `User`의 예시로 직접 구현해볼 것

완료 후 각자의 GitHub Repository에 업로드 하시면 됩니다 😉
