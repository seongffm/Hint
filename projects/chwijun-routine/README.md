# 취준 루틴

취업 준비 기록을 관리하는 웹 대시보드입니다.

## 기술 구성
- 화면: `index.html`
- API: `api/index.js` (Vercel Functions, Node.js 20)
- 데이터: Vercel Blob Private
- 인증: Vercel 환경변수 `API_TOKEN`

## 배포
이 폴더를 Vercel 프로젝트의 Root Directory로 지정합니다. 현재 연결 프로젝트는 `chwijun-routine-auto`이며 Root Directory는 `projects/chwijun-routine`입니다.

Vercel 프로젝트에 Private Blob Store를 연결하고 `BLOB_READ_WRITE_TOKEN`을 제공해야 합니다. `API_TOKEN`은 Production / Preview / Development 환경변수로 등록합니다. 실제 비밀값은 저장소에 커밋하지 않습니다.

사이트 접근 코드 입력란에는 Vercel의 `API_TOKEN` 값을 입력합니다.
