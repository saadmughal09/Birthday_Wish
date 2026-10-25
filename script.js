/* ===== EDIT THIS PART ===== */
const CONFIG = {
  name: "Muhammad Ahmad",            // his name
  age: 17,                  // e.g. 18 (or leave null)
  from: "Muhammad Saad",       // your name / sign-off
  lead: "Another year older, another year better. This one is for you.",
  message: [
    "Wishing you a year filled with success, laughter and everything you have been working towards.",
    "Thank you for always being there. You make our home brighter, and I am proud to be your sibling.",
    "May this year be your best one yet."
  ],
  photos: [
    { src: "https://cdn.phototourl.com/member/2026-10-25-00e75ca5-1373-4fb7-a8de-c8892b0fdd54.jpg", caption: "Where it all shines" },
    { src: "https://cdn.phototourl.com/member/2026-10-25-212fc201-aeb0-4841-b90b-e4e139dcd531.jpg", caption: "Always in style" },
    { src: "https://cdn.phototourl.com/member/2026-10-25-bd4ff11f-7440-4b2e-addc-3db22a21b86d.jpg", caption: "Moments worth keeping" },
    { src: "https://cdn.phototourl.com/member/2026-10-25-f52f4acc-e7d8-479b-9137-df76ce42da9a.jpg", caption: "Here is to you" }
  ]
};
/* ========================== */

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Fill content */
$("name").textContent = CONFIG.name;
$("lead").textContent = CONFIG.lead;
$("signoff").textContent = "With love, " + CONFIG.from;
$("age-line").textContent = CONFIG.age ? "Celebrating " + CONFIG.age + " years" : "Today is all about you";
$("message").innerHTML = CONFIG.message.map(t => "<p></p>").join("");
[...$("message").children].forEach((p, i) => p.textContent = CONFIG.message[i]);
document.title = "Happy Birthday, " + CONFIG.name;

/* Gallery */
let cur = 0, timer;
const n = CONFIG.photos.length;
$("track").innerHTML = CONFIG.photos.map((p, i) =>
  `<div class="slide"><img src="${p.src}" alt="${p.caption}" ${i ? 'loading="lazy"' : ""}></div>`).join("");
$("dots").innerHTML = CONFIG.photos.map((_, i) => `<button aria-label="Photo ${i + 1}"></button>`).join("");
function show(i) {
  cur = (i + n) % n;
  $("track").style.transform = `translateX(-${cur * 100}%)`;
  $("caption").textContent = CONFIG.photos[cur].caption;
  [...$("dots").children].forEach((d, k) => d.setAttribute("aria-current", k === cur));
}
function auto() { clearInterval(timer); if (!reduce) timer = setInterval(() => show(cur + 1), 4500); }
$("prev").onclick = () => { show(cur - 1); auto(); };
$("next").onclick = () => { show(cur + 1); auto(); };
[...$("dots").children].forEach((d, i) => d.onclick = () => { show(i); auto(); });
$("slider").addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") $("prev").click();
  if (e.key === "ArrowRight") $("next").click();
});
let sx = null;
$("slider").addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
$("slider").addEventListener("touchend", e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) (dx < 0 ? $("next") : $("prev")).click();
  sx = null;
});
show(0); auto();

/* Gold particles */
const cv = $("fx"), ctx = cv.getContext("2d");
let W, H, parts = [];
function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
addEventListener("resize", size); size();
const GOLD = ["#f3dc9a", "#d6b25e", "#b48a2e", "#f4ead3"];
function burst(x, y, count = 120) {
  if (reduce) count = 30;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 8;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, g: .18, life: 1,
      r: 2 + Math.random() * 4, c: GOLD[i % 4], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, dust: false });
  }
}
for (let i = 0; i < (reduce ? 0 : 45); i++)
  parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: -.15 - Math.random() * .3,
    g: 0, life: 1, r: .6 + Math.random() * 1.6, c: "#d6b25e", rot: 0, vr: 0, dust: true });
(function loop() {
  ctx.clearRect(0, 0, W, H);
  parts.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += p.g; p.rot += p.vr; p.vx *= .99;
    if (p.dust) {
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.globalAlpha = .35;
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    } else {
      p.life -= .008;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
    }
  });
  parts = parts.filter(p => p.dust || p.life > 0);
  requestAnimationFrame(loop);
})();

/* Background music: your mp3, starts when the gift is opened and restarts when it ends */
const MUSIC_URL = "https://mp3tourl.com/audio/1792952796272-5b9086f4-91df-4967-8c09-19673f44e870.mp3";
const audio = new Audio(MUSIC_URL);
audio.loop = true;
audio.preload = "auto";
let playing = false;
function setMusic(on) {
  playing = on;
  $("music").setAttribute("aria-pressed", on);
  if (on) audio.play().catch(() => { playing = false; $("music").setAttribute("aria-pressed", false); });
  else audio.pause();
}
$("music").onclick = () => setMusic(!playing);

/* Gate + wish */
$("open").onclick = () => {
  $("gate").classList.add("gone");
  $("site").hidden = false;
  setMusic(true);
  burst(innerWidth / 2, innerHeight / 2, 160);
  setTimeout(() => $("gate").remove(), 1000);
};
$("makeWish").onclick = e => {
  const r = e.target.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 200);
  e.target.textContent = "Wish made. Happy birthday!";
};