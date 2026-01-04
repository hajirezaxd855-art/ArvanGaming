let NEWS = [];
let TUTORIALS = [];
let STATUS = {};
let LINKS = {
  tgUrl: "https://t.me/arvangaming",
  joinUrl: "minecraft://?addExternalServer=ArvanGaming|arvangaming.ir:19132",
  reportUrl: "https://forms.gle/PUT_YOUR_REPORT_FORM",
  giftUrl: "https://forms.gle/PUT_YOUR_GIFT_FORM"
};

function $(id){ return document.getElementById(id); }

function toggleDrawer(forceClose=false){
  const d = $("drawer");
  const isHidden = d.classList.contains("hidden");
  if(forceClose) d.classList.add("hidden");
  else d.classList.toggle("hidden", !isHidden ? true : false);
  // ساده:
  if(isHidden) d.classList.remove("hidden"); else d.classList.add("hidden");
}

function setActiveTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  const btn = $("tab-" + id);
  if(btn) btn.classList.add("active");
}

function openTab(id){
  document.querySelectorAll("main section").forEach(s=>s.classList.add("hidden"));
  $(id).classList.remove("hidden");

  // فقط برای تب‌های بالای صفحه
  const topTabs = ["pages","status","news","tutorials","station"];
  if(topTabs.includes(id)) setActiveTab(id);
}

function openLink(key){
  const url = LINKS[key];
  if(url) window.open(url, "_blank");
}

function copyIP(){
  const ip = (STATUS.ip || "") + ":" + (STATUS.port || "");
  if(!STATUS.ip) return alert("IP هنوز آماده نیست");
  navigator.clipboard.writeText(ip).then(()=>alert("کپی شد: " + ip));
}

function escapeHtml(s){
  return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

async function loadJson(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error("Failed: " + path);
  return await r.json();
}

function renderNews(){
  const box = $("newsList");
  if(!NEWS.length){ box.innerHTML = "<div class='muted'>خبری ثبت نشده.</div>"; return; }
  box.innerHTML = NEWS.map(n=>`
    <div class="item">
      <div class="itemTitle">${escapeHtml(n.title)}</div>
      <div class="itemMeta">${escapeHtml(n.date || "")}</div>
      <div class="itemBody">${escapeHtml(n.body || "")}</div>
    </div>
  `).join("");
}

function renderTutorials(){
  const q = ($("tSearch").value || "").trim().toLowerCase();
  const list = q
    ? TUTORIALS.filter(t => (t.title+t.content+t.category).toLowerCase().includes(q))
    : TUTORIALS;

  const box = $("tutorialList");
  if(!list.length){ box.innerHTML = "<div class='muted'>چیزی پیدا نشد.</div>"; return; }
  box.innerHTML = list.map(t=>`
    <div class="item">
      <div class="itemTitle">${escapeHtml(t.title)}</div>
      <div class="itemMeta">${escapeHtml(t.category || "")}</div>
      <div class="itemBody">${escapeHtml(t.content || "")}</div>
    </div>
  `).join("");
}

function renderStatus(){
  const s = STATUS;
  const box = $("statusBox");

  const onlineTxt = s.online ? "آنلاین" : "آفلاین";
  const playersTxt = (s.players ?? "?") + " / " + (s.maxPlayers ?? "?");
  const ipTxt = (s.ip || "-") + ":" + (s.port || "-");

  box.dataset.ip = s.ip || "";
  box.innerHTML = `
    <div><b>وضعیت:</b> ${onlineTxt}</div>
    <div><b>پلیر:</b> ${playersTxt}</div>
    <div><b>IP:</b> ${ipTxt}</div>
    <div class="itemMeta">${escapeHtml(s.note || "")}</div>
  `;
}

function runSearch(){
  const q = ($("q").value || "").trim().toLowerCase();
  const out = $("searchResult");
  if(!q){ out.innerHTML = ""; return; }

  const n = NEWS.filter(x => (x.title+x.body).toLowerCase().includes(q)).map(x=>({type:"خبر", title:x.title, body:x.body}));
  const t = TUTORIALS.filter(x => (x.title+x.content+x.category).toLowerCase().includes(q)).map(x=>({type:"آموزش", title:x.title, body:x.content}));
  const all = [...n, ...t];

  if(!all.length){ out.innerHTML = "<div class='muted'>چیزی پیدا نشد.</div>"; return; }

  out.innerHTML = all.map(x=>`
    <div class="item">
      <div class="itemTitle">${escapeHtml(x.title)} <span class="itemMeta">(${x.type})</span></div>
      <div class="itemBody">${escapeHtml(x.body || "")}</div>
    </div>
  `).join("");
}

async function init(){
  // لینک تلگرام بنر
  $("tgLink").href = LINKS.tgUrl;

  try{
    NEWS = await loadJson("data/news.json");
    TUTORIALS = await loadJson("data/tutorials.json");
    STATUS = await loadJson("data/status.json");

    renderNews();
    renderTutorials();
    renderStatus();

    // نمونه فروشگاه نمایشی
    const shop = [
      {title:"VIP - 7 روز", body:"نمایشی (بدون بک‌اند خرید واقعی نمی‌شود)"},
      {title:"1000 سکه", body:"نمایشی"}
    ];
    $("shopList").innerHTML = shop.map(x=>`
      <div class="item">
        <div class="itemTitle">${escapeHtml(x.title)}</div>
        <div class="itemBody">${escapeHtml(x.body)}</div>
      </div>
    `).join("");

  }catch(e){
    console.error(e);
    alert("خطا در لود دیتا. فایل‌های data را چک کن.");
  }
}

init();
