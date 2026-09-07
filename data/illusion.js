/* ============================================================
   일루전 던전 데이터
   - 사이드 메뉴에서 항목을 고르면 오른쪽(좁은 화면은 아래) 내용이 바뀜
   - id      : 주소(#/illusion/id)에 쓰이는 값. 영문/숫자/하이픈만
   - level   : 입장 레벨
   - prereq  : "필요" 를 넣으면 사이드 메뉴와 상단에 선행 퀘스트 배지 표시
   - links   : [{ label, url }] 형태의 참고 링크
   - 비워둔 항목은 화면에 "내용 작성 예정"으로 표시됨
   ============================================================ */
window.ILLUSIONS = [
  {
    id: "moonlight",
    name: "일루전 오브 문라이트",
    level: 100,
    region: "페이욘",
    npc: "원로 산율 (페이욘 12시)",
    boss: "진리의 위자드",
    prereq: "필요",
    summary: "첫 번째 일루전 던전. 베이스 레벨 100 이상이고, 페이욘 12시 원로 산율의 선행 퀘스트를 끝내야 입장할 수 있다. 던전 무대는 페이욘 기반의 \"월야화의 악몽\".",
    entry: [
      "베이스 레벨 100 이상",
      "페이욘 12시 원로 산율의 선행 퀘스트 완료",
      "선행 완료 후 페이욘 별궁의 일렁이는 공간을 클릭해 진입"
    ],
    quest: [
      "페이욘 12시 원로 산율과 대화 → 퀘스트 시작",
      "페이욘 던전 앞 청년학사와 대화 → 무연 구출 임무 수령",
      "청년학사와 대화 후 무연과 만남",
      "페이욘 별궁(12시 위쪽 건물)에 들어가 무연과 다시 대화",
      "일렁이는 공간 클릭 → \"월야화의 악몽\" 진입",
      "경비병 · 대충해와 대화 → 진리의 위자드 사냥 퀘스트 획득",
      "진리의 위자드 처치 후 선행 퀘스트 완료"
    ],
    prepare: [
      "풍 레지스트 포션",
      "수 레지스트 포션"
    ],
    daily: [
      "던전 6시 방향 NPC에게 일일 퀘스트를 전부 수령 (분노한 구미호 20마리 포함)",
      "6시에서 시작해 반시계 방향으로 한 바퀴 도는 동선이 편함",
      "맵 6군데의 마을사람 — 접근하면 몬스터 3마리로 변신, 처치",
      "분노한 구미호 20마리를 채우면 보스 진리의 위자드 출현",
      "완료 보고 ① 5시 방향 청년학사 → 환상석 1개 + 경험치 약 36만",
      "완료 보고 ② 페이욘 별궁 무연 → 환상석 1개",
      "3종 전부 완료 시 환상석 2개 + 경험치 약 72만"
    ],
    rewards: [
      "환상석 — 일일 퀘스트 · 사냥으로 획득, 일루전 장비 강화에 사용",
      "재료 아이템 (흐릿한 달과자, 처녀의 옷자락 등) → 일루전 무기 · 방어구 20종 교환",
      "일루전 투구 인챈트 아이템 28종",
      "일루전 장비 장착용 카드 8종",
      "일일 퀘스트 누적 시 일루전 장비 상자 · 환상석 · 일루전 제련 해머 상자"
    ],
    strategy: [
      "보스 진리의 위자드는 스톰 가스트 · 유피텔 선더 · 로드 오브 버밀리온을 사용 → 풍 · 수 레지스트 포션을 미리 준비",
      "보스 체력은 자료마다 20만 ~ 40만으로 다르게 적혀 있으니 여유 있게 잡고 진입",
      "마을사람은 클릭이 아니라 접근만 해도 변신하므로, 동선 중간에 자연스럽게 처리",
      "분노한 구미호 20마리가 보스 출현 조건이라 이것부터 채우는 편이 빠름"
    ],
    links: [
      { label: "인벤 — 일루전 문라이트 입장 퀘스트 -1-", url: "https://www.inven.co.kr/board/ro/1951/3836" },
      { label: "인벤 — 일루전 문라이트 입장 퀘스트 -2-", url: "https://www.inven.co.kr/board/ro/1951/3837" },
      { label: "인벤 — 일루전 오브 문라이트(LV100) 정리", url: "https://www.inven.co.kr/board/ro/1951/3902" },
      { label: "인벤 — 일루전 입장퀘스트 및 진행 (문라이트 · 프리즌 · 뱀파이어)", url: "https://www.inven.co.kr/board/ro/1951/4920" }
    ],
    notes: "웹에서 정리한 내용이라 현재 서버 기준과 다를 수 있음. 직접 돌아보고 다른 부분은 수정할 것.",
    img: []
  },

  {
    id: "frozen",
    name: "일루전 오브 프로즌",
    level: 120,
    region: "",
    npc: "",
    boss: "",
    prereq: "",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "",
    img: []
  },
  {
    id: "vampire",
    name: "일루전 오브 뱀파이어",
    level: 130,
    region: "",
    npc: "",
    boss: "",
    prereq: "",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "",
    img: []
  },
  {
    id: "guyanggung",
    name: "일루전 오브 구양궁",
    level: 150,
    region: "",
    npc: "",
    boss: "",
    prereq: "",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "",
    img: []
  },
  {
    id: "teddybear",
    name: "일루전 오브 테디베어",
    level: 150,
    region: "",
    npc: "",
    boss: "",
    prereq: "필요",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "선행 퀘스트 주소 정리중.",
    img: []
  },
  {
    id: "luanda",
    name: "일루전 오브 루안다",
    level: 160,
    region: "",
    npc: "",
    boss: "",
    prereq: "",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "",
    img: []
  },
  {
    id: "twins",
    name: "일루전 오브 트윈스",
    level: 160,
    region: "",
    npc: "",
    boss: "",
    prereq: "필요",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "선행 퀘스트 주소 정리중.",
    img: []
  },
  {
    id: "labyrinth",
    name: "일루전 오브 라비린스",
    level: 170,
    region: "",
    npc: "",
    boss: "",
    prereq: "필요",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "선행 퀘스트 주소 정리중.",
    img: []
  },
  {
    id: "underwater",
    name: "일루전 오브 언더워터",
    level: 180,
    region: "",
    npc: "",
    boss: "",
    prereq: "필요",
    summary: "",
    entry: [],
    quest: [],
    prepare: [],
    daily: [],
    rewards: [],
    strategy: [],
    links: [],
    notes: "선행 퀘스트 주소 정리중.",
    img: []
  }
];
