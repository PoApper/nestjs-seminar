# 세미나 수강 플랫폼

**■ due date**

2021.07.20.

## 도입말

포애퍼는 매 학기 세미나를 진행한다. 프론트, 백, 모바일, 디자인 등 여러 세미나가 열리는 만큼 이제는 세미나를 관리하는 플랫폼이 필요하다. 

가칭 "포애퍼 세미나 플랫폼"은 학기 별로 열리는 세미나를 총괄할 수 있는 플랫폼으로 관리자와 수강자가 나뉘어 각각 세미나 등록과 수강 신청을 수행한다. 마치 포항공대의 수강신청 시스템과 마찬가지로 포애퍼 세미나 역시 정해진 기간 그리고 정해진 인원을 수용할 예정이며, 세미나 수강자는 과거 세미나 내역과 본인이 신청한 세미나의 내역을 조회할 수 있을 것이다.

수강 신청 후에는 이 내용을 바탕으로 가상의 PLMS를 만들어 세미나 진행 상황과 출결 등을 관리할 예정이다. 추후에는 포애퍼 세미나를 외부에 까지 확대하여 일반 학생을 위한 세미나를 신청 받을 수도 있을 것이다.

희망사항이지만, 추후에 학교에서 PLMS나 Povis 수강 신청을 개편할 때, 이 플랫폼이 좋은 선례가 되어 포애퍼에서 외주를 가져갈지도....? 

<hr/>

## 구현

2021-1 NestJS 세미나의 최종 과제는 앞에서 소개한 **"포애퍼 세미나 플랫폼"**을 구현하는 것이다. 대충 Povis 수강신청과 PLMS와 비슷한 서비스를 개발한다고 생각하면 될 것 같다.

구체적인 개발 조건은 아래와 같다.

- 계정(Account)
  - Student
  - Instructor
  - Admin
- 세미나(Seminar)
- 수강신청
  - 수락
  - 반려
  - 이수
  - Withdraw
- 출결 & 과제
- 적절한 프론트 페이지
  - 단, 프론트 페이지의 디자인은 채점 요소에 포함되지 않는다.

<hr/>

### 모델

#### 계정(Account)

세미나 플랫폼은 수강생(Student), 담당자(Instructor), 관리자(Admin) 세가지 계정이 필요하다. 이를 구현하고, `Guard`를 이용해 Authentication과 Authorization을 구현한다.

이때, 디테일한 로그인 로직을 구현할 필요는 없다. (ex: 메일 인증, 비밀번호 암호화 등등). 단, `Guard`를 사용해 API에 대한 접근을 적절히 제한해야 한다.

#### 세미나

세미나에 적절한 정보를 담는 `Entity`를 정의한다. `Entity`의 컬럼은 자유롭게 설정해도 되지만, 꼭 들어가야 하는 컬럼은 아래와 같다.

- uuid
- title
- description
- yearcode (ex: 2021-1, 2021-S, 2021-2, 2021-W)
- 수강 신청 기간
- 수강 인원
- created_at
- updated_at

추후에 이 세미나 `Entity`를 기준으로 적절한 DB relation을 사용해야 할 것이다.

#### 수강신청

유저와 세미나 사이의 수강신청을 적절한 DB relation 또는 `Entity`를 정의해 구현한다. 컬럼은 자유롭게 설정해도 되지만, 꼭 들어가야 하는 컬럼은 아래와 같다.

- created_at
- status: 수락, 반려, 이수, withdraw

#### 출결 & 과제

세미나를 신청한 각 유저의 출결과 과제를 관리할 수 있는 로직을 구현한다. 적절한 DB relation을 사용해 각각의 `Entity`를 구현한다.

<hr/>

### 기능

- 학기별로 열리는 세미나들을 등록하고 볼 수 있어야함
    - 등록 및 수정은 세미나 담당자들만 가능
    - 수강신청 기간 설정
- 세미나 수강신청 및 수락
    - 수강생들이 학기별로 열리는 세미나를 확인할 수 있어야함
    - 신청 기간에만 신청하도록
    - 신청 후 담당자가 수락
- 자신이 신청한 세미나들과 통과 여부를 확인할 수 있어야함
    - 담당자가 최종 통과 여부 결정
- 출결 & 과제는 해당 세미나의 담당자만이 수정할 수 있어야 함
- 그밖에 필요한 것 같은 내용은 직접 고민해보면서 설계해보기

<hr/>

### 프론트

- 프론트 페이지 작성에는 별다른 제약은 없다. 본인이 원하는 프레임워크를 사용해 구현하면 된다.
  - 다만, 웹페이지가 내용이 바뀌지 않는 정적(static)인 상황은 아니기 때문에 pure html로 구현하기에는 무리가 있다.
- 만약 ReactJS 프레임워크를 다룰 줄 안다면, ReactJS로 구현하는 것을 추천한다.
  - ReactJS는 정말 쉽다. 처음 배워도 3일이면 세미나를 완성할 수준은 된다.
- 프론트 페이지는 어플리케이션에서 요구하는 기본적인 기능을 수행할 수 있는 수준만 구현하면 충분하다.
  - 즉, 웹프론트의 디자인은 채점 요소에 포함되지 않는다.
- 만약 어플리케이션의 웹프론트를 어떻게 디자인할지 감이 잡히지 않는다면, 비슷한 기능을 수행하는 **Povis 수강신청**과 **PLMS**를 참고하라.


<hr/>

### 채점 및 통과 기준

과제 Due는 2021.07.20. 23:59:59이다.

완성된 서버와 프론트에 대한 GitHub repository url를 첨부한다.

완성된 어플리케이션은 local 환경이 아니라, 외부에서 호스팅되는 상태여야 한다.

즉, 채점자가 본인의 컴퓨터에서 App을 실행해 채점하는 방식이 아니라 채점자가 완성된 어플리케이션에 접속해 기능을 테스트한다.

따라서 제출 이메일에 **본인의 사이트에 대한 웹주소를 함께 기입한다.**

<hr/>

Final Assignment를 통과해야 세미나의 수료가 최종적으로 인정된다.

채점 시 고려하는 사항은 아래와 같다.

- Assn에서 요구하는 "포애퍼 세미나 플랫폼"의 기능이 잘 구현되었는가?
- CRUD 기능이 잘 구현되었는가?
- 모듈을 적절히 설계했는가?
- DB Relationship을 적절히 사용했는가?
- 서버 코드에 주석이 적절히 달렸는가? (주석은 모두 영어로 작성해주세요!)
- README.md에서 서버 디자인에 대해 잘 설명했는가?

위의 조건을 “모두” 총족한다면, Fianl Assn을 통과한 것이 된다.

1차 채점 후, 만약 어플리케이션의 구현이 미흡하다면, 피드백과 함께 최대 이틀을 연장 제출할 수 있다.

구현에 어려움을 겪는다면, 멘토의 도움을 요청할 수 있다. 단, 빠른 문제해결을 위해 요청 전에 문제 상황을 3~4 문장으로 요약하여 제시하길 부탁한다.
