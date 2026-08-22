# RO 공략 노트

라그나로크 인스턴스 던전 · 육성 · 환상총서 · 스킬 · 일일 퀘스트 개인 정리용 정적 사이트.
빌드 도구 없이 HTML/CSS/JS만 사용하며, 해시 라우팅이라 GitHub Pages에서 별도 설정 없이 동작합니다.

## GitHub Pages

저장소: <https://github.com/ragdfg/ragdfg.github.io>
공개 주소: <https://ragdfg.github.io/>

사용자 페이지(`<아이디>.github.io`) 저장소라 **main 브랜치에 push하면 몇 분 내로 바로 반영**됩니다.
(Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`)

수정 후 반영:

```bash
git add -A
git commit -m "내용 갱신"
git push
```

로컬에서 볼 때는 `index.html` 을 브라우저로 바로 열면 됩니다.

## 내용 수정하는 법

내용은 전부 `data/` 폴더의 JS 파일에만 있습니다. HTML은 건드릴 필요 없습니다.

| 파일 | 내용 |
|---|---|
| `data/dungeons.js` | 인스턴스 던전 목록 · 상세 (요약/진입/보상/공략) |
| `data/leveling.js` | 레벨 구간별 육성(`LEVELING`) · 사전 준비물(`PREP`) |
| `data/tomes.js` | 환상총서 |
| `data/skills.js` | 직업별 스킬 · 스탯 |
| `data/daily.js` | 일일 퀘스트 |

- 비어 있는 항목(`""`, `[]`)은 화면에 **"내용 작성 예정"** 으로 표시됩니다.
- 목록형 항목은 문자열 배열입니다: `strategy: ["1페이즈는 ...", "2페이즈는 ..."]`
- 던전을 추가하려면 `{ ... }` 블록 하나를 복사해 붙여넣고 `id` 만 겹치지 않게 바꾸면 됩니다.

## 이미지 추가

`assets/img/` 아래에 파일을 넣고 해당 항목의 `img` 배열에 경로를 적으면 됩니다.

```js
img: ["assets/img/level/100-130-1.png", "assets/img/level/100-130-2.png"]
```

경로는 저장소 루트 기준 상대경로이며, 비어 있으면 "이미지 추가 예정" 자리표시가 나옵니다.

## 기타

- 우측 상단 ◐ 버튼으로 다크/라이트 전환 (선택값 저장됨)
- 사전 준비 체크는 브라우저에 계속 저장, 일일 퀘스트 체크는 새벽 4시 기준 자동 초기화
- 인던 탭 상단 검색창에서 던전명 · 지역 · NPC 검색 가능
