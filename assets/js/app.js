(function () {
  "use strict";

  var TABS = [
    { id: "level",   label: "육성" },
    { id: "dungeon", label: "인던" },
    { id: "tome",    label: "환상총서" },
    { id: "skill",   label: "스킬&스탯" },
    { id: "daily",   label: "일퀘" },
    { id: "event",   label: "이벤트" },
    { id: "element", label: "속성" }
  ];

  var app = document.getElementById("app");

  /* ---------- 유틸 ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function has(v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); }
  function store(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 무시 */ }
  }
  function todo(text) {
    return '<p class="empty">' + esc(text || "내용 작성 예정") + "</p>";
  }
  function lines(arr) {
    if (!has(arr)) return "";
    return "<ul>" + arr.map(function (l) {
      if (/^\/navi\s/.test(l)) {
        return '<li class="navi-line"><code class="navi-cmd">' + esc(l) + "</code>" +
          '<button class="copy-btn" type="button" data-copy="' + esc(l) + '" title="클릭하여 복사">복사</button></li>';
      }
      return "<li>" + esc(l) + "</li>";
    }).join("") + "</ul>";
  }
  function images(arr) {
    if (!has(arr)) {
      return '<div class="img-todo">이미지 추가 예정</div>';
    }
    return '<div class="imgs">' + arr.map(function (src) {
      return '<img src="' + esc(src) + '" alt="" loading="lazy">';
    }).join("") + "</div>";
  }
  function badges(tags) {
    if (!has(tags)) return "";
    return tags.map(function (t) {
      var cls = /보류|미정|확인/.test(t) ? "b-warn" : "b-accent";
      return ' <span class="badge ' + cls + '">' + esc(t) + "</span>";
    }).join("");
  }
  function collapsedMap() { return store("ro.collapsed", {}); }
  function isCollapsed(key) { return !!collapsedMap()[key]; }
  function block(title, html, key) {
    var k = key || title;
    var collapsed = isCollapsed(k);
    return '<div class="section' + (collapsed ? " collapsed" : "") + '" data-collapse-key="' + esc(k) + '">' +
      '<div class="section-title" role="button" tabindex="0">' +
        '<span class="section-title-text">' + esc(title) + "</span>" +
        '<span class="section-toggle">' + (collapsed ? "▸" : "▾") + "</span>" +
      "</div>" +
      '<div class="section-body">' + html + "</div></div>";
  }
  function card(inner) { return '<div class="card">' + inner + "</div>"; }

  /* ---------- 탭 ---------- */
  function renderTabs(active) {
    document.getElementById("tabs").innerHTML = TABS.map(function (t) {
      return '<a href="#/' + t.id + '" class="' + (t.id === active ? "active" : "") + '">' + esc(t.label) + "</a>";
    }).join("");
  }
  function subtabs(base, items, active) {
    return '<nav class="subtabs">' + items.map(function (it) {
      return '<a href="#/' + base + "/" + it.id + '" class="' + (it.id === active ? "active" : "") + '">' + esc(it.name) + "</a>";
    }).join("") + "</nav>";
  }
  function head(title, sub) {
    return '<div class="page-head"><h1>' + esc(title) + "</h1>" +
      (sub ? '<div class="sub">' + esc(sub) + "</div>" : "") + "</div>";
  }

  /* ---------- 1. 육성 ---------- */
  function pageLevel(sub) {
    var view = sub === "prep" ? "prep" : "guide";
    var html = head("육성", "레벨 구간별 정리 · 사전 준비물");
    html += '<nav class="subtabs">' +
      '<a href="#/level/guide" class="' + (view === "guide" ? "active" : "") + '">레벨별 육성</a>' +
      '<a href="#/level/prep" class="' + (view === "prep" ? "active" : "") + '">사전 준비</a></nav>';

    if (view === "guide") {
      html += (window.LEVELING || []).map(function (b, i) {
        var body = has(b.lines) ? lines(b.lines) : todo();
        return '<details class="acc"' + (i === 0 ? " open" : "") + '>' +
          "<summary>" + esc(b.range) + (b.title ? ' <span class="badge">' + esc(b.title) + "</span>" : "") + "</summary>" +
          '<div class="acc-body">' + body + images(b.img) + "</div></details>";
      }).join("");
    } else {
      html += '<div class="note">체크 상태는 이 브라우저에 저장됩니다.</div><div style="height:10px"></div>';
      html += (window.PREP || []).map(function (g) {
        return block(g.title, '<div class="list">' + g.items.map(function (it, i) {
          var key = g.id + ":" + i;
          return '<label class="check" data-store="prep" data-key="' + esc(key) + '">' +
            '<input type="checkbox"><span class="t">' + esc(it.t) +
            (it.d ? '<span class="d">' + esc(it.d) + "</span>" : "") + "</span></label>";
        }).join("") + "</div>", "level-prep:" + g.id);
      }).join("");
      html += '<div class="note warn">필요 아이템은 <code>data/leveling.js</code> 의 PREP 에서 수정하세요.</div>';
    }
    return html;
  }

  /* ---------- 2. 인던 ---------- */
  function dungeonById(id) {
    return (window.DUNGEONS || []).filter(function (d) { return d.id === id; })[0];
  }
  function pageDungeonList() {
    var html = head("인스턴스 던전", "지역별 입장 NPC · 위치");
    html += '<input id="dgSearch" class="search" type="search" placeholder="던전 · 지역 · NPC 검색" autocomplete="off">';
    html += '<div id="dgList">' + dungeonListHTML("") + "</div>";
    return html;
  }
  function dungeonListHTML(q) {
    var list = (window.DUNGEONS || []).filter(function (d) {
      if (!q) return true;
      return (d.name + " " + d.region + " " + d.location + " " + d.npc).toLowerCase().indexOf(q) >= 0;
    });
    if (!list.length) return '<p class="empty">검색 결과가 없습니다.</p>';

    var groups = [], map = {};
    list.forEach(function (d) {
      if (!map[d.region]) { map[d.region] = []; groups.push(d.region); }
      map[d.region].push(d);
    });
    return groups.map(function (g) {
      return block(g, '<div class="list">' + map[g].map(function (d) {
        var meta = [d.location, d.npc, d.boss].filter(has).join(" · ") || "정보 추가 예정";
        return '<a class="row" href="#/dungeon/' + esc(d.id) + '">' +
          '<div class="grow"><div class="name">' + esc(d.name) + badges(d.tags) + "</div>" +
          '<div class="meta">' + esc(meta) + "</div></div>" +
          '<span class="chev">›</span></a>';
      }).join("") + "</div>", "dungeon-list:" + g);
    }).join("");
  }
  function pageDungeonDetail(id) {
    var d = dungeonById(id);
    if (!d) return head("찾을 수 없음") + '<p class="empty">해당 던전 정보가 없습니다.</p><p><a href="#/dungeon">목록으로</a></p>';

    var html = '<a class="back" href="#/dungeon">‹ 인던 목록</a>';
    html += head(d.name, d.region);
    html += card('<dl class="kv">' +
      "<dt>지역</dt><dd>" + esc(d.region || "-") + "</dd>" +
      "<dt>위치</dt><dd>" + esc(d.location || "확인 필요") + "</dd>" +
      "<dt>입장 NPC</dt><dd>" + esc(d.npc || "확인 필요") + "</dd>" +
      "<dt>보스 몬스터</dt><dd>" + esc(d.boss || "확인 필요") + "</dd>" +
      "</dl>" + (has(d.tags) ? '<div style="margin-top:8px">' + badges(d.tags) + "</div>" : ""));

    html += "<div style='height:14px'></div>";
    html += block("이미지", card(has(d.img) ? images(d.img) : todo()), "dungeon:" + d.id + ":img");
    html += block("간단 요약", card(has(d.summary) ? "<p>" + esc(d.summary) + "</p>" : todo()), "dungeon:" + d.id + ":summary");
    html += block("진입 방법", card(has(d.entry) ? lines(d.entry) : todo()), "dungeon:" + d.id + ":entry");
    html += block("보상", card(has(d.rewards) ? lines(d.rewards) : todo()), "dungeon:" + d.id + ":rewards");
    html += block("공략", card(has(d.strategy) ? lines(d.strategy) : todo()), "dungeon:" + d.id + ":strategy");
    if (has(d.notes)) html += '<div class="note">' + esc(d.notes) + "</div>";
    return html;
  }

  /* ---------- 3. 환상총서 ---------- */
  function pageTome() {
    var list = window.TOMES || [];
    var html = head("환상총서", "한 페이지에 전부 · 위 버튼으로 바로 이동");
    html += '<nav class="subtabs">' + list.map(function (t) {
      return '<a href="#' + esc(t.id) + '" data-jump="' + esc(t.id) + '">' + esc(t.name) + "</a>";
    }).join("") + "</nav>";

    html += list.map(function (t) {
      var body = "";
      if (t.tip) body += '<div class="note">' + esc(t.tip) + "</div>";
      body += has(t.lines) ? lines(t.lines) : todo();
      if (has(t.img)) body += images(t.img);
      return '<div class="section anchor" id="' + esc(t.id) + '">' +
        '<div class="section-title">' + esc(t.name) + "</div>" + card(body) + "</div>";
    }).join("");
    return html;
  }

  /* ---------- 4. 스킬 · 스탯 ---------- */
  function pageSkill(sub) {
    var list = window.CLASSES || [];
    if (!list.length) return head("스킬 · 스탯") + '<p class="empty">등록된 직업이 없습니다.</p>';
    var cur = list.filter(function (c) { return c.id === sub; })[0] || list[0];

    var html = head("스킬 · 스탯", "직업별 정리");
    html += subtabs("skill", list, cur.id);
    html += block("스탯", card(has(cur.stat) ? lines(cur.stat) : todo()), "skill:" + cur.id + ":stat");
    html += block("스킬", card(has(cur.skills) ? lines(cur.skills) : todo()), "skill:" + cur.id + ":skills");
    html += block("운영 순서", card(has(cur.combo) ? lines(cur.combo) : todo()), "skill:" + cur.id + ":combo");
    if (has(cur.notes)) html += '<div class="note">' + esc(cur.notes) + "</div>";
    if (has(cur.img)) html += images(cur.img);
    return html;
  }

  /* ---------- 5. 일일 퀘스트 ---------- */
  function dayKey() {
    // 새벽 4시 기준으로 하루 구분
    var d = new Date(Date.now() - 4 * 60 * 60 * 1000);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function dayCounter(q) {
    var cells = "";
    for (var i = 1; i <= q.days; i++) {
      cells += '<button class="dc-cell" type="button" data-day="' + i + '">' +
        "<b>" + i + '</b><i class="dc-date"></i></button>';
    }
    return '<div class="daycount" data-quest="' + esc(q.id) + '" data-total="' + q.days + '">' +
      '<div class="dc-head">' +
        '<span class="dc-title">일수 체크</span>' +
        '<span class="dc-progress">0 / ' + q.days + '</span>' +
        '<button class="dc-reset" type="button">전체 초기화</button>' +
      "</div>" +
      '<div class="dc-bar"><i></i></div>' +
      '<div class="dc-last"></div>' +
      '<div class="dc-grid">' + cells + "</div>" +
      '<p class="dc-help">날짜를 누르면 그날 완료로 기록됩니다. 기록한 날짜가 칸에 함께 표시되고 브라우저에 계속 저장됩니다.</p>' +
      "</div>";
  }

  function pageDaily() {
    var list = window.DAILY || [];
    var html = head("일일 퀘스트", "중요한 것만 · 체크는 새벽 4시 기준 자동 초기화");
    html += '<div class="list" style="margin-bottom:14px">' + list.map(function (q) {
      return '<label class="check" data-store="daily" data-key="' + esc(q.id) + '">' +
        '<input type="checkbox"><span class="t">' + esc(q.name) +
        '<span class="d">' + esc([q.place, q.npc, q.reward].filter(has).join(" · ") || "정보 추가 예정") + "</span></span></label>";
    }).join("") + "</div>";

    html += list.map(function (q) {
      var body = '<dl class="kv">' +
        "<dt>주기</dt><dd>" + esc(q.reset || "-") + "</dd>" +
        "<dt>장소</dt><dd>" + esc(q.place || "확인 필요") + "</dd>" +
        "<dt>NPC</dt><dd>" + esc(q.npc || "확인 필요") + "</dd>" +
        "<dt>보상</dt><dd>" + esc(q.reward || "확인 필요") + "</dd></dl>";
      body += "<div style='height:8px'></div>";
      body += has(q.steps) ? lines(q.steps) : todo();
      if (q.days) body += dayCounter(q);
      if (has(q.notes)) body += '<div class="note" style="margin-top:8px">' + esc(q.notes) + "</div>";
      return '<details class="acc"' + (q.days ? " open" : "") + '><summary>' + esc(q.name) +
        (q.days ? ' <span class="badge b-accent">' + q.days + "일</span>" : "") +
        "</summary><div class='acc-body'>" + body + "</div></details>";
    }).join("");
    return html;
  }

  /* ---------- 6. 이벤트 ---------- */
  function pageEvent(sub) {
    var list = window.EVENTS || [];
    if (!list.length) return head("이벤트") + '<p class="empty">등록된 이벤트가 없습니다.</p>';
    var cur = list.filter(function (e) { return e.id === sub; })[0] || list[0];

    var html = head("이벤트", "기간 한정 이벤트 정리");
    html += subtabs("event", list, cur.id);
    html += block("개요", card(has(cur.summary) ? "<p>" + esc(cur.summary) + "</p>" : todo()), "event:" + cur.id + ":summary");
    html += block("진행 방법", card(has(cur.entry) ? lines(cur.entry) : todo()), "event:" + cur.id + ":entry");
    if (has(cur.quests)) html += block("주요 퀘스트", card(lines(cur.quests)), "event:" + cur.id + ":quests");
    if (has(cur.choice)) html += block("선택형 퀘스트 (택1)", card(lines(cur.choice)), "event:" + cur.id + ":choice");
    html += block("보상 · 교환", card(has(cur.rewards) ? lines(cur.rewards) : todo()), "event:" + cur.id + ":rewards");
    if (has(cur.notes)) html += '<div class="note">' + esc(cur.notes) + "</div>";
    if (has(cur.img)) html += images(cur.img);
    return html;
  }

  /* ---------- 7. 속성표 ---------- */
  function pageElement() {
    var list = window.ELEMENTAL || [];
    if (!list.length) return head("속성") + '<p class="empty">등록된 속성표가 없습니다.</p>';
    var html = head("속성", "피해자 속성 레벨별 상성표 (공식 가이드 발췌)");
    html += list.map(function (lv) {
      return block(lv.name, card(images(lv.img)), "element:" + lv.id);
    }).join("");
    html += '<div class="note">출처: 라그나로크 온라인 공식 시작 가이드 (ro.gnjoy.com/guide/ragstart/basic4.asp)</div>';
    return html;
  }

  /* ---------- 체크박스 저장 ---------- */
  function bindChecks(root) {
    var prep = store("ro.prep", {});
    var dailyStore = store("ro.daily", {});
    if (dailyStore.day !== dayKey()) dailyStore = { day: dayKey(), items: {} };

    root.querySelectorAll(".check").forEach(function (el) {
      var kind = el.getAttribute("data-store");
      var key = el.getAttribute("data-key");
      var input = el.querySelector("input");
      var checked = kind === "daily" ? !!(dailyStore.items || {})[key] : !!prep[key];
      input.checked = checked;
      el.classList.toggle("done", checked);

      input.addEventListener("change", function () {
        el.classList.toggle("done", input.checked);
        if (kind === "daily") {
          var cur = store("ro.daily", { day: dayKey(), items: {} });
          if (cur.day !== dayKey()) cur = { day: dayKey(), items: {} };
          cur.items[key] = input.checked;
          save("ro.daily", cur);
        } else {
          var p = store("ro.prep", {});
          p[key] = input.checked;
          save("ro.prep", p);
        }
      });
    });
    if (kindHasDaily(root)) save("ro.daily", dailyStore);
  }
  /* ---------- 일수 체크 (날짜 기록 · 영구 저장) ---------- */
  function stamp(d) {
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function bindDays(root) {
    root.querySelectorAll(".daycount").forEach(function (box) {
      var qid = box.getAttribute("data-quest");
      var total = parseInt(box.getAttribute("data-total"), 10) || 0;
      var bar = box.querySelector(".dc-bar i");
      var prog = box.querySelector(".dc-progress");
      var last = box.querySelector(".dc-last");
      var cells = Array.prototype.slice.call(box.querySelectorAll(".dc-cell"));

      function all() { return store("ro.days", {}); }
      function mine() { return all()[qid] || {}; }

      function paint() {
        var s = mine(), n = 0, newest = "";
        cells.forEach(function (c) {
          var v = s[c.getAttribute("data-day")];
          var on = !!v;
          var when = typeof v === "string" ? v : "";
          c.classList.toggle("done", on);
          c.querySelector(".dc-date").textContent = when ? when.slice(5, 10).replace("-", "/") : "";
          c.title = on ? (when ? when + " 완료" : "완료") : "미완료";
          if (on) { n++; if (when > newest) newest = when; }
        });
        prog.textContent = n + " / " + total;
        bar.style.width = total ? Math.round((n / total) * 100) + "%" : "0%";
        last.textContent = newest ? "마지막 기록 : " + newest : "아직 기록 없음";
      }

      cells.forEach(function (c) {
        c.addEventListener("click", function () {
          var data = all(), s = data[qid] || {}, k = c.getAttribute("data-day");
          if (s[k]) delete s[k]; else s[k] = stamp(new Date());
          data[qid] = s; save("ro.days", data); paint();
        });
      });
      box.querySelector(".dc-reset").addEventListener("click", function () {
        if (!window.confirm("일수 체크 " + total + "칸의 기록을 모두 지웁니다. 계속할까요?")) return;
        var data = all(); delete data[qid]; save("ro.days", data); paint();
      });
      paint();
    });
  }

  function kindHasDaily(root) { return !!root.querySelector('.check[data-store="daily"]'); }

  /* ---------- 라우터 ---------- */
  function parse() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    return { tab: parts[0] || "dungeon", sub: parts[1] ? decodeURIComponent(parts[1]) : "" };
  }

  var lastRoute = "";

  function render() {
    var r = parse();
    var anchor = "";
    // 환상총서 내부 앵커 이동(#tome-xxx)은 라우팅하지 않음
    if (location.hash && location.hash.indexOf("#/") !== 0) {
      var id = location.hash.slice(1);
      var target = document.getElementById(id);
      if (target) { target.scrollIntoView(); return; }
      if ((window.TOMES || []).some(function (t) { return t.id === id; })) {
        r = { tab: "tome", sub: "" };
        anchor = id;
      }
    }
    if (!TABS.some(function (t) { return t.id === r.tab; })) r.tab = "dungeon";

    renderTabs(r.tab);
    var html;
    switch (r.tab) {
      case "level":   html = pageLevel(r.sub); break;
      case "tome":    html = pageTome(); break;
      case "skill":   html = pageSkill(r.sub); break;
      case "daily":   html = pageDaily(); break;
      case "event":   html = pageEvent(r.sub); break;
      case "element": html = pageElement(); break;
      default:        html = r.sub ? pageDungeonDetail(r.sub) : pageDungeonList();
    }
    app.innerHTML = html;
    bindChecks(app);
    bindDays(app);

    var s = document.getElementById("dgSearch");
    if (s) {
      s.addEventListener("input", function () {
        document.getElementById("dgList").innerHTML = dungeonListHTML(s.value.trim().toLowerCase());
      });
    }

    var key = r.tab + "/" + r.sub;
    if (anchor) {
      var el = document.getElementById(anchor);
      if (el) el.scrollIntoView();
    } else if (key !== lastRoute) {
      window.scrollTo(0, 0);
    }
    lastRoute = key;
  }

  window.addEventListener("hashchange", render);

  /* ---------- 테마 ---------- */
  var themeBtn = document.getElementById("themeBtn");
  function applyTheme(t) {
    if (t === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
  }
  applyTheme(store("ro.theme", "dark"));
  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next); save("ro.theme", next);
  });

  /* ---------- 맨 위로 ---------- */
  var topBtn = document.getElementById("topBtn");
  window.addEventListener("scroll", function () {
    topBtn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- 이미지 크게 보기 (라이트박스) ---------- */
  var LB = (function () {
    var el, stage, imgEl, counter, prevBtn, nextBtn;
    var list = [], idx = 0, pushed = false, touchX = null;

    function build() {
      el = document.createElement("div");
      el.className = "lightbox";
      el.hidden = true;
      el.innerHTML =
        '<div class="lb-stage"><img alt=""></div>' +
        '<div class="lb-count"></div>' +
        '<button class="lb-btn lb-close" type="button" aria-label="닫기">✕</button>' +
        '<button class="lb-btn lb-prev" type="button" aria-label="이전 이미지">‹</button>' +
        '<button class="lb-btn lb-next" type="button" aria-label="다음 이미지">›</button>';
      document.body.appendChild(el);

      stage = el.querySelector(".lb-stage");
      imgEl = el.querySelector(".lb-stage img");
      counter = el.querySelector(".lb-count");
      prevBtn = el.querySelector(".lb-prev");
      nextBtn = el.querySelector(".lb-next");

      el.addEventListener("click", function () { close(false); });
      el.querySelector(".lb-close").addEventListener("click", function (e) { e.stopPropagation(); close(false); });
      prevBtn.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
      nextBtn.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
      imgEl.addEventListener("click", function (e) { e.stopPropagation(); toggleZoom(); });

      stage.addEventListener("touchstart", function (e) {
        touchX = e.touches.length === 1 ? e.touches[0].clientX : null;
      }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        if (touchX === null || el.classList.contains("zoomed")) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
      }, { passive: true });

      document.addEventListener("keydown", function (e) {
        if (el.hidden) return;
        if (e.key === "Escape") close(false);
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
      });
      window.addEventListener("popstate", function () { if (!el.hidden) close(true); });
    }

    function show() {
      imgEl.src = list[idx];
      counter.textContent = list.length > 1 ? (idx + 1) + " / " + list.length : "";
      counter.style.display = list.length > 1 ? "" : "none";
      prevBtn.hidden = nextBtn.hidden = list.length < 2;
      el.classList.remove("zoomed");
      stage.scrollTop = stage.scrollLeft = 0;
    }
    function step(d) {
      if (list.length < 2) return;
      idx = (idx + d + list.length) % list.length;
      show();
    }
    function toggleZoom() { el.classList.toggle("zoomed"); }

    function open(target) {
      if (!el) build();
      var group = target.closest(".imgs");
      list = group
        ? Array.prototype.slice.call(group.querySelectorAll("img")).map(function (i) { return i.getAttribute("src"); })
        : [target.getAttribute("src")];
      idx = Math.max(0, list.indexOf(target.getAttribute("src")));
      show();
      el.hidden = false;
      document.body.style.overflow = "hidden";
      if (!pushed) { try { history.pushState({ lb: 1 }, "", location.href); pushed = true; } catch (e) {} }
    }
    function close(fromPop) {
      if (!el || el.hidden) return;
      el.hidden = true;
      el.classList.remove("zoomed");
      imgEl.removeAttribute("src");
      document.body.style.overflow = "";
      if (pushed && !fromPop) { pushed = false; history.back(); } else { pushed = false; }
    }

    return { open: open };
  })();

  document.addEventListener("click", function (e) {
    var img = e.target.closest ? e.target.closest(".imgs img") : null;
    if (img) { e.preventDefault(); LB.open(img); }
  });

  /* ---------- 섹션 접기 ---------- */
  function toggleSection(title) {
    var sec = title.closest(".section");
    var key = sec && sec.getAttribute("data-collapse-key");
    if (!key) return;
    var collapsed = sec.classList.toggle("collapsed");
    var arrow = title.querySelector(".section-toggle");
    if (arrow) arrow.textContent = collapsed ? "▸" : "▾";
    var s = collapsedMap();
    if (collapsed) s[key] = true; else delete s[key];
    save("ro.collapsed", s);
  }
  document.addEventListener("click", function (e) {
    var title = e.target.closest ? e.target.closest(".section-title") : null;
    if (title) toggleSection(title);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var title = e.target.closest ? e.target.closest(".section-title") : null;
    if (!title) return;
    e.preventDefault();
    toggleSection(title);
  });

  /* ---------- 복사 버튼 ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve(); else reject();
      } catch (e) { reject(e); }
    });
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".copy-btn") : null;
    if (!btn) return;
    var text = btn.getAttribute("data-copy") || "";
    copyText(text).then(function () {
      clearTimeout(btn._copyTimer);
      btn.textContent = "복사됨";
      btn.classList.add("copied");
      btn._copyTimer = setTimeout(function () {
        btn.textContent = "복사";
        btn.classList.remove("copied");
      }, 1200);
    }).catch(function () {
      clearTimeout(btn._copyTimer);
      btn.textContent = "실패";
      btn._copyTimer = setTimeout(function () { btn.textContent = "복사"; }, 1200);
    });
  });

  render();
})();
