# 취준 루틴

Google Apps Script와 Google Sheets 의존성을 제거하고 GitHub + Vercel만으로 운영하도록 구성했습니다.

## 구성
- 화면: `index.html`
- API: `api/index.js` (Vercel Functions)
- 기록 저장: Vercel Blob Private
- 인증: Vercel 환경변수 `API_TOKEN`

## Vercel 설정
1. GitHub 저장소를 Vercel 프로젝트에 연결합니다.
2. Private Blob Store를 프로젝트에 연결합니다. `BLOB_READ_WRITE_TOKEN`은 자동 생성됩니다.
3. `API_TOKEN`을 Production / Preview / Development 환경변수로 등록합니다.
4. 배포 후 사이트의 접근 코드 입력란에 `API_TOKEN` 값을 입력합니다.

접근 코드는 브라우저 localStorage에 저장되며, 기록은 비공개 Blob에 JSON 파일로 저장됩니다.
