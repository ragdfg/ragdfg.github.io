/* ============================================================
   육성 데이터
   1) LEVELING  : 레벨 구간별 육성 (지금은 텍스트, 나중에 img 배열에 이미지 경로 추가)
   2) PREP      : 사전 준비 - 필요 아이템 체크리스트 (체크 상태는 브라우저에 저장됨)
   ============================================================ */

window.LEVELING = [
  {
    id: "lv-1",
    range: "1 ~ 99",
    title: "초반 구간",
    lines: [
      "내용 작성 예정"
    ],
    // 이미지 추가 예시: img: ["assets/img/level/1-99-1.png", "assets/img/level/1-99-2.png"]
    img: []
  },
  {
    id: "lv-2",
    range: "100 ~ 130",
    title: "",
    lines: [],
    img: []
  },
  {
    id: "lv-3",
    range: "130 ~ 160",
    title: "",
    lines: [],
    img: []
  },
  {
    id: "lv-4",
    range: "160 ~ 185",
    title: "",
    lines: [],
    img: []
  },
  {
    id: "lv-5",
    range: "185 ~ 200",
    title: "",
    lines: [],
    img: []
  },
  {
    id: "lv-6",
    range: "200 이상",
    title: "",
    lines: [],
    img: []
  }
];

window.PREP = [
  {
    id: "prep-consume",
    title: "소모품",
    items: [
      { t: "회복 아이템 (포션 · 음식)", d: "" },
      { t: "이동용 아이템 (날개 · 이동 스크롤)", d: "" }
    ]
  },
  {
    id: "prep-gear",
    title: "장비",
    items: [
      { t: "무기", d: "" },
      { t: "방어구 세트", d: "" },
      { t: "악세사리", d: "" }
    ]
  },
  {
    id: "prep-quest",
    title: "선행 퀘스트 · 입장 조건",
    items: [
      { t: "달팽이 - 입장 퀘스트 필요", d: "얼음의 성 여관 앞 NPC 꼬뽀" }
    ]
  },
  {
    id: "prep-etc",
    title: "기타",
    items: [
      { t: "무게 · 인벤토리 여유 확보", d: "" }
    ]
  }
];
