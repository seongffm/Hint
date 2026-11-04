# 개인 프로젝트 저장소

여러 프로젝트를 한 저장소에서 관리하는 모노레포입니다.

## 프로젝트

| 프로젝트 | 설명 | 경로 |
|---|---|---|
| [취준 루틴](./projects/chwijun-routine/README.md) | 취업 준비 기록 대시보드 (Vercel) | `projects/chwijun-routine/` |

## 폴더 구조

```text
Hint/
├── README.md
├── projects/                 # 개별 프로젝트 소스
│   ├── README.md
│   └── chwijun-routine/      # 취준 루틴 웹 앱
├── docs/                     # 공통 문서 및 설계 자료
├── assets/                   # 공통 이미지·자료
└── .gitignore
```

## 새 프로젝트 추가
1. `projects/새프로젝트명/` 폴더를 만듭니다.
2. 프로젝트별 `README.md`에 목적, 기술 스택, 실행 방법을 기록합니다.
3. 별도 배포가 필요하면 해당 폴더를 Vercel 프로젝트의 Root Directory로 연결합니다.
4. 공통 문서는 `docs/`, 공통 리소스는 `assets/`에 둡니다.

프로젝트별 환경변수 파일에는 예시만 올리고 실제 비밀값은 GitHub에 커밋하지 않습니다.
