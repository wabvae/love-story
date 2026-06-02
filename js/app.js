/* ===== 密码验证 ===== */
function checkPwd() {
  var input = document.getElementById('pwdInput').value;
  if (input === SITE_PASSWORD) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('app').classList.add('show');
    document.getElementById('loader').classList.add('hide');
    setTimeout(function() { document.getElementById('loader').style.display = 'none'; }, 800);
    initApp();
  } else {
    document.getElementById('pwdError').textContent = '密码不对哦，再试试 💕';
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdInput').focus();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('pwdInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') checkPwd();
  });
  initLoginParticles();
  // Auto-hide loader after 2s if already logged in
  setTimeout(function() {
    document.getElementById('loader').classList.add('hide');
  }, 2000);
});

/* ===== 登录页粒子 ===== */
function initLoginParticles() {
  var c = document.getElementById('loginParticles');
  if (!c) return;
  var ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  var particles = [];
  for (var i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * c.width, y: Math.random() * c.height,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.1
    });
  }
  function animate() {
    ctx.clearRect(0, 0, c.width, c.height);
    particles.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233,30,99,' + p.alpha + ')';
      ctx.fill();
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = c.width;
      if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height;
      if (p.y > c.height) p.y = 0;
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', function() { c.width = window.innerWidth; c.height = window.innerHeight; });
}

/* ===== 主应用 ===== */
var allPhotos = [];
var lightboxPhotos = [];
var lightboxIndex = 0;

function initApp() {
  collectPhotos();
  renderStats();
  renderMilestones();
  renderPhotoStrip();
  renderLatestMemories();
  renderTimeline(memories);
  renderGallery();
  renderLetters();
  buildFilters();
  initHeroCanvas();
  initMusicPlayer();
  initScroll();
  initNavbar();
}

/* ===== 工具 ===== */
function getLoveDays() {
  var s = new Date(LOVE_START_DATE), t = new Date();
  s.setHours(0,0,0,0); t.setHours(0,0,0,0);
  return Math.floor((t - s) / 86400000);
}
function formatDate(d) {
  var p = d.split('-'), weekdays = ['日','一','二','三','四','五','六'];
  var dt = new Date(p[0], p[1]-1, p[2]);
  return p[0] + '年' + parseInt(p[1]) + '月' + parseInt(p[2]) + '日 星期' + weekdays[dt.getDay()];
}
function escHtml(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

function collectPhotos() {
  allPhotos = [];
  memories.forEach(function(m) {
    if (m.photos) m.photos.forEach(function(p) { allPhotos.push('photos/' + p); });
  });
}

/* ===== Stats ===== */
function renderStats() {
  var days = getLoveDays();
  document.getElementById('daysDisplay').textContent = days;
  document.getElementById('statDays').textContent = days;
  document.getElementById('statMemories').textContent = memories.length;
  document.getElementById('statPhotos').textContent = allPhotos.length;
  var msgs = 0;
  memories.forEach(function(m) { if (m.chats) msgs += m.chats.length; });
  document.getElementById('statMessages').textContent = msgs;
  document.getElementById('heroQuote').textContent = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
}

/* ===== Milestones ===== */
function renderMilestones() {
  var grid = document.getElementById('milestonesGrid');
  var items = [
    { label:'在一起', date:LOVE_START_DATE, icon:'💕' },
    { label:'一个月', date:addDate(LOVE_START_DATE,0,1), icon:'🎉' },
    { label:'100天', date:addDate(LOVE_START_DATE,100,0), icon:'💯' },
    { label:'半年', date:addDate(LOVE_START_DATE,0,6), icon:'🎊' },
    { label:'一年', date:addDate(LOVE_START_DATE,0,12), icon:'🎂' },
    { label:'500天', date:addDate(LOVE_START_DATE,500,0), icon:'🌟' }
  ];
  var today = new Date(); today.setHours(0,0,0,0);
  grid.innerHTML = '';
  items.forEach(function(m) {
    var d = new Date(m.date); d.setHours(0,0,0,0);
    var passed = today >= d;
    var remain = Math.abs(Math.floor((d - today) / 86400000));
    var el = document.createElement('div');
    el.className = 'milestone-item ' + (passed ? 'passed' : 'upcoming');
    el.innerHTML = '<div class="milestone-icon">' + m.icon + '</div>' +
      '<div class="milestone-info"><div class="milestone-label">' + m.label + '</div>' +
      '<div class="milestone-date">' + m.date + '</div></div>' +
      '<div class="milestone-status">' + (passed ? '✅ 已达成' : '⏳ ' + remain + '天后') + '</div>';
    grid.appendChild(el);
  });
}
function addDate(base, days, months) {
  var d = new Date(base);
  if (months) d.setMonth(d.getMonth() + months);
  if (days) d.setDate(d.getDate() + days);
  return d.toISOString().substring(0,10);
}

/* ===== Photo Strip ===== */
function renderPhotoStrip() {
  var strip = document.getElementById('photoStrip');
  var recent = allPhotos.slice(0, 6);
  strip.innerHTML = '';
  recent.forEach(function(src) {
    var img = document.createElement('img');
    img.src = src; img.loading = 'lazy';
    img.onclick = function() { openLightbox(src, allPhotos); };
    strip.appendChild(img);
  });
}

/* ===== Latest Memories ===== */
function renderLatestMemories() {
  var container = document.getElementById('latestMemories');
  var latest = memories.slice(0, 5);
  container.innerHTML = '';
  latest.forEach(function(m) {
    var text = m.text || (m.chats ? m.chats[0].text : '');
    var el = document.createElement('div');
    el.className = 'latest-card';
    el.onclick = function() { switchPage('story'); };
    el.innerHTML = '<div class="latest-card-icon">💕</div>' +
      '<div class="latest-card-info"><div class="latest-card-title">' + (m.title || '回忆') + '</div>' +
      '<div class="latest-card-date">' + m.date + '</div>' +
      '<div class="latest-card-text">' + escHtml(text.substring(0,40)) + '</div></div>';
    container.appendChild(el);
  });
}

/* ===== Timeline ===== */
function renderTimeline(items) {
  var tl = document.getElementById('timeline');
  tl.innerHTML = '';
  if (!items.length) { tl.innerHTML = '<div style="text-align:center;padding:40px;color:' + getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') + '">还没有回忆 💕</div>'; return; }
  items.forEach(function(m) {
    var card = document.createElement('div');
    card.className = 'timeline-card';
    var html = '<div class="timeline-date">' + formatDate(m.date) + '</div>';
    if (m.title) html += '<div class="timeline-title">' + m.title + '</div>';
    if (m.chats) {
      m.chats.forEach(function(c) {
        var cls = (c.name === '他' || c.name === '我') ? 'his' : 'hers';
        html += '<div class="chat-label">' + c.name + '</div>';
        html += '<div class="chat-bubble ' + cls + '">' + escHtml(c.text) + '</div>';
      });
    }
    if (m.text) html += '<div class="timeline-text">' + escHtml(m.text) + '</div>';
    if (m.photos && m.photos.length) {
      var photoSrcs = JSON.stringify(m.photos.map(function(x){return 'photos/'+x}));
      var cls = 'memory-photos';
      if (m.photos.length === 1) cls += ' single'; else if (m.photos.length === 2) cls += ' double'; else cls += ' multiple';
      html += '<div class="' + cls + '" style="display:grid;grid-template-columns:repeat(' + Math.min(m.photos.length,3) + ',1fr);gap:8px;margin-top:10px;">';
      m.photos.forEach(function(p) {
        html += '<img src="photos/' + p + '" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;cursor:pointer" onclick="event.stopPropagation();openLightbox(\'photos/' + p + '\',' + photoSrcs + ')">';
      });
      html += '</div>';
    }
    card.innerHTML = html;
    tl.appendChild(card);
  });
}

/* ===== Gallery ===== */
function renderGallery() {
  var grid = document.getElementById('galleryMasonry');
  grid.innerHTML = '';
  allPhotos.forEach(function(src) {
    var img = document.createElement('img');
    img.src = src; img.loading = 'lazy';
    img.onclick = function() { openLightbox(src, allPhotos); };
    grid.appendChild(img);
  });
}

/* ===== Filters ===== */
function buildFilters() {
  var bar = document.getElementById('filterTabs');
  var months = {};
  memories.forEach(function(m) { months[m.date.substring(0,7)] = true; });
  Object.keys(months).sort().reverse().forEach(function(ym) {
    var btn = document.createElement('button');
    btn.className = 'filter-tab';
    btn.textContent = ym.split('-')[0] + '年' + parseInt(ym.split('-')[1]) + '月';
    btn.dataset.ym = ym;
    btn.onclick = function() { filterBy(ym); };
    bar.appendChild(btn);
  });
}
function filterBy(filter) {
  document.querySelectorAll('.filter-tab').forEach(function(b) { b.classList.remove('active'); });
  event.target.classList.add('active');
  var items = filter === 'all' ? memories : memories.filter(function(m) { return m.date.substring(0,7) === filter; });
  renderTimeline(items);
  document.getElementById('timeline').scrollIntoView({behavior:'smooth'});
}

/* ===== 留言板 ===== */
function postLetter() {
  var input = document.getElementById('letterInput');
  var nameInput = document.getElementById('letterName');
  var text = input.value.trim();
  var name = nameInput.value.trim() || '他';
  if (!text) return;
  var letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  letters.unshift({ name: name, text: text, time: new Date().toISOString() });
  localStorage.setItem('loveLetters', JSON.stringify(letters));
  input.value = '';
  renderLetters();
}
function renderLetters() {
  var wall = document.getElementById('lettersWall');
  var letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  if (!letters.length) { wall.innerHTML = '<div class="empty-state">还没有留言，写一条吧 💕</div>'; return; }
  wall.innerHTML = '';
  letters.forEach(function(l) {
    var el = document.createElement('div');
    el.className = 'letter-item';
    var time = new Date(l.time);
    var timeStr = time.getFullYear() + '-' + (time.getMonth()+1).toString().padStart(2,'0') + '-' + time.getDate().toString().padStart(2,'0') + ' ' + time.getHours().toString().padStart(2,'0') + ':' + time.getMinutes().toString().padStart(2,'0');
    el.innerHTML = '<div class="letter-header"><span>' + (l.name === '他' ? '💙' : '💕') + '</span><span class="letter-author">' + escHtml(l.name) + '</span><span class="letter-time">' + timeStr + '</span></div><div class="letter-content">' + escHtml(l.text) + '</div>';
    wall.appendChild(el);
  });
}

/* ===== 页面切换 ===== */
function switchPage(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  var navItem = document.querySelector('.nav-item[data-page="' + page + '"]');
  if (navItem) navItem.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  document.getElementById('navMenu').classList.remove('open');
}
function toggleMenu() { document.getElementById('navMenu').classList.toggle('open'); }

/* ===== Hero Canvas ===== */
function initHeroCanvas() {
  var c = document.getElementById('heroCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  function resize() { c.width = c.parentElement.offsetWidth; c.height = c.parentElement.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  var particles = [];
  for (var i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * c.width, y: Math.random() * c.height,
      size: Math.random() * 3 + 1, alpha: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '233,30,99' : '156,39,176'
    });
  }
  function anim() {
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(function(p) {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      ctx.fill();
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
    });
    requestAnimationFrame(anim);
  }
  anim();
}

/* ===== 音乐播放器 ===== */
var audioCtx = null;
var isPlaying = false;

function initMusicPlayer() {
  var musicTitles = ['💕 我们的主题曲', '🌸 想你的旋律', '✨ 美好的时光'];
  var musicIcons = ['🎵', '🎶', '🎼'];
  var idx = Math.floor(Math.random() * musicTitles.length);
  document.getElementById('musicTitle').textContent = musicTitles[idx];
  document.getElementById('musicArtist').textContent = '点击播放 · 随机旋律';
  // Simulated progress bar animation
  setInterval(function() {
    if (isPlaying) {
      var bar = document.getElementById('musicProgress');
      var w = parseFloat(bar.style.width || 0);
      bar.style.width = (w >= 100 ? 0 : w + 0.5) + '%';
    }
  }, 200);
}

function toggleMusic() {
  isPlaying = !isPlaying;
  document.getElementById('musicIcon').textContent = isPlaying ? '⏸️' : '🎵';
  document.getElementById('musicArtist').textContent = isPlaying ? '正在播放...' : '点击播放';
  if (!isPlaying) document.getElementById('musicProgress').style.width = '0%';
}

function toggleVolume() {
  var vol = document.getElementById('musicVolume');
  vol.value = vol.value > 0 ? 0 : 0.5;
  document.querySelector('.music-vol-btn').textContent = vol.value > 0 ? '🔊' : '🔇';
}

/* ===== Scroll ===== */
function initScroll() {
  window.addEventListener('scroll', function() {
    var btn = document.getElementById('backToTop');
    btn.classList.toggle('show', window.scrollY > 500);
  });
}

/* ===== Navbar ===== */
function initNavbar() {
  var lastY = 0;
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('navbar');
    if (window.scrollY > 100) {
      nav.classList.toggle('hidden', window.scrollY > lastY && window.scrollY > 200);
    } else {
      nav.classList.remove('hidden');
    }
    lastY = window.scrollY;
  });
}

/* ===== Lightbox ===== */
function openLightbox(src, allSrcs) {
  document.getElementById('lbImg').src = src;
  lightboxPhotos = allSrcs || [src];
  lightboxIndex = lightboxPhotos.indexOf(src);
  if (lightboxIndex < 0) lightboxIndex = 0;
  document.getElementById('lightbox').classList.add('show');
  updateLbCounter();
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) { if (e && e.target !== e.currentTarget) return; document.getElementById('lightbox').classList.remove('show'); document.body.style.overflow = ''; }
function prevPhoto(e) { if (e) e.stopPropagation(); lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length; document.getElementById('lbImg').src = lightboxPhotos[lightboxIndex]; updateLbCounter(); }
function nextPhoto(e) { if (e) e.stopPropagation(); lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length; document.getElementById('lbImg').src = lightboxPhotos[lightboxIndex]; updateLbCounter(); }
function updateLbCounter() { document.getElementById('lbCounter').textContent = (lightboxIndex + 1) + ' / ' + lightboxPhotos.length; }
document.addEventListener('keydown', function(e) {
  if (document.getElementById('lightbox').classList.contains('show')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto(e);
    if (e.key === 'ArrowRight') nextPhoto(e);
  }
});
