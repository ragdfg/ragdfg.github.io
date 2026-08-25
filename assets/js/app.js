(function () {
  "use strict";

  var TABS = [
    { id: "level",   label: "육성" },
    { id: "dungeon", label: "인던" },
    { id: "tome",    label: "환상총서" },
    { id: "skill",   label: "스킬&스탯" },
    { id: "daily",   label: "일퀘" }
  ];

  var app = document.getElementById("app");

  /* ---------- 유틸 ---------- */123
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
    return "<ul>" + arr.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>";
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
  function block(title, html) {
    return '<div class="section"><div class="section-title">' + esc(title) + "</div>" + html + "</div>";
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
        }).join("") + "</div>");
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
      }).join("") + "</div>");
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
    html += block("이미지", card(has(d.img) ? images(d.img) : todo()));
    html += block("간단 요약", card(has(d.summary) ? "<p>" + esc(d.summary) + "</p>" : todo()));
    html += block("진입 방법", card(has(d.entry) ? lines(d.entry) : todo()));
    html += block("보상", card(has(d.rewards) ? lines(d.rewards) : todo()));
    html += block("공략", card(has(d.strategy) ? lines(d.strategy) : todo()));
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
    html += block("스탯", card(has(cur.stat) ? lines(cur.stat) : todo()));
    html += block("스킬", card(has(cur.skills) ? lines(cur.skills) : todo()));
    html += block("운영 순서", card(has(cur.combo) ? lines(cur.combo) : todo()));
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
      if (has(q.notes)) body += '<div class="note" style="margin-top:8px">' + esc(q.notes) + "</div>";
      return '<details class="acc"><summary>' + esc(q.name) + "</summary><div class='acc-body'>" + body + "</div></details>";
    }).join("");
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
      default:        html = r.sub ? pageDungeonDetail(r.sub) : pageDungeonList();
    }
    app.innerHTML = html;
    bindChecks(app);

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

  render();
})();
