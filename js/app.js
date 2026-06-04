/* ===== Password ===== */
function checkPwd() {
  var input = document.getElementById('pwdInput').value;
  if (input === SITE_PASSWORD) {
    // Kill particles to save CPU
    stopLoginParticles = true;
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('app').classList.add('show');
    document.getElementById('loader').classList.add('hide');
    document.getElementById('loader').style.display = 'none';
    initApp();
  } else {
    document.getElementById('pwdError').textContent = 'Wrong password, try again';
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdInput').focus();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('pwdInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') checkPwd();
  });
  initLoginParticles();
  // Hide loader immediately
  setTimeout(function() { 
    document.getElementById('loader').classList.add('hide');
    document.getElementById('loader').style.display = 'none'; 
  }, 100);
});

/* ===== Particles ===== */
var stopLoginParticles = false;

function initLoginParticles() {
  var c = document.getElementById('loginParticles');
  if (!c) return;
  var ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  var particles = [];
  for (var i = 0; i < 40; i++) particles.push({
    x: Math.random() * c.width, y: Math.random() * c.height,
    size: Math.random() * 6 + 2, speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5, alpha: Math.random() * 0.5 + 0.1
  });
  function animate() {
    if (stopLoginParticles) { c.style.display = 'none'; return; }
    ctx.clearRect(0, 0, c.width, c.height);
    particles.forEach(function(p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233,30,99,' + p.alpha + ')';
      ctx.fill(); p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', function() { c.width = window.innerWidth; c.height = window.innerHeight; });
}

/* ===== App ===== */
var allPhotos = [];
var lightboxPhotos = [];
var lightboxIndex = 0;

function initApp() {
  collectPhotos();
  renderStats();
  renderMilestones();
  renderNextMilestone();
  renderPhotoStrip();
  renderLatestMemories();
  renderTodayMemory();
  renderLoveDiary();
  renderLoveQuote();
  renderWishList();
  renderFuturePlans();
  renderAchievements();
  renderTimeline(memories);
  renderGallery();
  renderLetters();
  renderQuiz();
  buildFilters();
  initHeroCanvas();
  initScroll();
  initNavbar();
}

function getLoveDays() {
  var s = new Date(LOVE_START_DATE), t = new Date();
  s.setHours(0,0,0,0); t.setHours(0,0,0,0);
  return Math.floor((t - s) / 86400000);
}

function formatDate(d) {
  var p = d.split('-');
  var weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var dt = new Date(p[0], p[1]-1, p[2]);
  return p[0] + '-' + p[1] + '-' + p[2] + ' ' + weekdays[dt.getDay()];
}

function escHtml(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

function collectPhotos() {
  allPhotos = [];
  memories.forEach(function(m) {
    if (m.photos) m.photos.forEach(function(p) { allPhotos.push('photos/' + p); });
  });
}

function renderStats() {
  var days = getLoveDays();
  document.getElementById('daysDisplay').textContent = days;
  document.getElementById('statDays').textContent = days;
  document.getElementById('statMemories').textContent = memories.length;
  document.getElementById('statPhotos').textContent = allPhotos.length;
  var msgs = 0;
  memories.forEach(function(m) { if (m.chats) msgs += m.chats.length; });
  document.getElementById('statMessages').textContent = msgs;
  document.querySelector('.counter-sublabel').textContent = '从 ' + LOVE_START_DATE + ' 开始';
}

function renderMilestones() {
  var grid = document.getElementById('milestonesGrid');
  if (!grid) return;
  var items = [
    { label:'在一起', date:LOVE_START_DATE, icon:'💕' },
    { label:'一个月', date:addDate(LOVE_START_DATE,0,1), icon:'🎉' },
    { label:'100天', date:addDate(LOVE_START_DATE,100,0), icon:'💯' },
    { label:'半年', date:addDate(LOVE_START_DATE,0,6), icon:'🎊' },
    { label:'一周年', date:addDate(LOVE_START_DATE,0,12), icon:'🎂' },
    { label:'500天', date:addDate(LOVE_START_DATE,500,0), icon:'🌟' }
  ];
  var today = new Date(); today.setHours(0,0,0,0);
  grid.innerHTML = '';
  items.forEach(function(m) {
    var d = new Date(m.date); d.setHours(0,0,0,0);
    var passed = today >= d;
    var remain = Math.floor((d - today) / 86400000);
    var el = document.createElement('div');
    el.className = 'milestone-item ' + (passed ? 'passed' : 'upcoming');
    el.innerHTML = '<div class="milestone-icon">' + m.icon + '</div>' +
      '<div class="milestone-info"><div class="milestone-label">' + m.label + '</div>' +
      '<div class="milestone-date">' + m.date + '</div></div>' +
      '<div class="milestone-status">' + (passed ? '已达成 ✓' : '还有 ' + remain + ' 天') + '</div>';
    grid.appendChild(el);
  });
}

function addDate(base, days, months) {
  var d = new Date(base);
  if (months) d.setMonth(d.getMonth() + months);
  if (days) d.setDate(d.getDate() + days);
  return d.toISOString().substring(0,10);
}

function renderPhotoStrip() {
  var strip = document.getElementById('photoStrip');
  if (!strip) return;
  var recent = allPhotos.slice(0, 6);
  strip.innerHTML = '';
  recent.forEach(function(src) {
    var img = document.createElement('img');
    img.src = src; img.loading = 'lazy';
    img.onclick = function() { openLightbox(src, allPhotos); };
    strip.appendChild(img);
  });
}

function renderLatestMemories() {
  var container = document.getElementById('latestMemories');
  if (!container) return;
  var latest = memories.slice(0, 5);
  container.innerHTML = '';
  latest.forEach(function(m) {
    var text = m.text || (m.chats ? m.chats[0].text : '');
    var el = document.createElement('div');
    el.className = 'latest-card';
    el.dataset.date = m.date;
    el.onclick = function() { 
      switchPage('story');
      filterBy(m.date.substring(0,7));
    };
    el.innerHTML = '<div class="latest-card-icon">💕</div>' +
      '<div class="latest-card-info"><div class="latest-card-title">' + (m.title || '回忆') + '</div>' +
      '<div class="latest-card-date">' + m.date + '</div>' +
      '<div class="latest-card-text">' + escHtml(text.substring(0,40)) + '</div></div>';
    container.appendChild(el);
  });
}

function renderTimeline(items) {
  var tl = document.getElementById('timeline');
  if (!tl) return;
  tl.innerHTML = '';
  if (!items.length) { tl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary)">No memories yet</div>'; return; }
  items.forEach(function(m) {
    var card = document.createElement('div');
    card.className = 'timeline-card';
    var html = '<div class="timeline-date">' + formatDate(m.date) + '</div>';
    if (m.title) html += '<div class="timeline-title">' + m.title + '</div>';
    if (m.chats) {
      m.chats.forEach(function(c) {
        var cls = (c.name === 'He' || c.name === 'I') ? 'his' : 'hers';
        html += '<div class="chat-label">' + c.name + '</div>';
        html += '<div class="chat-bubble ' + cls + '">' + escHtml(c.text) + '</div>';
      });
    }
    if (m.text) html += '<div class="timeline-text">' + escHtml(m.text) + '</div>';
    if (m.photos && m.photos.length) {
      var photoSrcs = JSON.stringify(m.photos.map(function(x){return 'photos/'+x}));
      var nc = Math.min(m.photos.length,3);
      html += '<div style="display:grid;grid-template-columns:repeat(' + nc + ',1fr);gap:8px;margin-top:10px;">';
      m.photos.forEach(function(p) {
        html += '<img src="photos/' + p + '" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;cursor:pointer" onclick="event.stopPropagation();openLightbox(\'photos/' + p + '\',' + photoSrcs + ')">';
      });
      html += '</div>';
    }
    card.innerHTML = html;
    tl.appendChild(card);
  });
}

function renderGallery() {
  var grid = document.getElementById('galleryMasonry');
  if (!grid) return;
  grid.innerHTML = '';
  allPhotos.forEach(function(src) {
    var img = document.createElement('img');
    img.src = src; img.loading = 'lazy';
    img.onclick = function() { openLightbox(src, allPhotos); };
    grid.appendChild(img);
  });
}

function buildFilters() {
  var bar = document.getElementById('filterTabs');
  if (!bar) return;
  var months = {};
  memories.forEach(function(m) { months[m.date.substring(0,7)] = true; });
  Object.keys(months).sort().reverse().forEach(function(ym) {
    var btn = document.createElement('button');
    btn.className = 'filter-tab';
    btn.textContent = ym; btn.dataset.ym = ym;
    btn.onclick = function(e) { filterBy(ym, e.target); };
    bar.appendChild(btn);
  });
}

function filterBy(filter, el) {
  document.querySelectorAll('.filter-tab').forEach(function(b) { b.classList.remove('active'); });
  if (el && el.classList) { el.classList.add('active'); } else {
    document.querySelectorAll('.filter-tab').forEach(function(b) { if (b.dataset.ym === filter) b.classList.add('active'); });
  }
  var items = filter === 'all' ? memories : memories.filter(function(m) { return m.date.substring(0,7) === filter; });
  renderTimeline(items);
}

/* ===== Letters ===== */
function postLetter() {
  var input = document.getElementById('letterInput');
  var nameInput = document.getElementById('letterName');
  var text = input.value.trim();
  var name = nameInput.value.trim() || 'He';
  if (!text) return;
  var letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  letters.unshift({ name: name, text: text, time: new Date().toISOString() });
  localStorage.setItem('loveLetters', JSON.stringify(letters));
  input.value = ''; renderLetters();
}

function renderLetters() {
  var wall = document.getElementById('lettersWall');
  if (!wall) return;
  var letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  if (!letters.length) { wall.innerHTML = '<div class="empty-state">No messages yet</div>'; return; }
  wall.innerHTML = '';
  letters.forEach(function(l) {
    var el = document.createElement('div');
    el.className = 'letter-item';
    var ts = new Date(l.time);
    var t = ts.getFullYear() + '-' + (ts.getMonth()+1).toString().padStart(2,'0') + '-' + ts.getDate().toString().padStart(2,'0');
    el.innerHTML = '<div class="letter-header"><span>' + (l.name==='He'?'💙':'💕') + '</span><span class="letter-author">' + escHtml(l.name) + '</span><span class="letter-time">' + t + '</span></div><div class="letter-content">' + escHtml(l.text) + '</div>';
    wall.appendChild(el);
  });
}

/* ===== Love Quote Rotator ===== */
var quoteIndex = 0;
var quoteTimer = null;

function renderLoveQuote() {
  if (!loveQuotes || !loveQuotes.length) return;
  var el = document.getElementById('loveQuoteText');
  var dots = document.getElementById('quoteDots');
  if (!el) return;
  quoteIndex = 0;
  showQuote(0);
  if (dots) {
    dots.innerHTML = '';
    loveQuotes.forEach(function(q, i) {
      var d = document.createElement('span');
      d.className = 'quote-dot' + (i === 0 ? ' active' : '');
      dots.appendChild(d);
    });
  }
  startQuoteTimer();
}

function showQuote(idx) {
  var el = document.getElementById('loveQuoteText');
  if (!el) return;
  var dots = document.querySelectorAll('.quote-dot');
  el.textContent = loveQuotes[idx];
  dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
}

function nextQuote() {
  quoteIndex = (quoteIndex + 1) % loveQuotes.length;
  showQuote(quoteIndex);
  resetQuoteTimer();
}

function prevQuote() {
  quoteIndex = (quoteIndex - 1 + loveQuotes.length) % loveQuotes.length;
  showQuote(quoteIndex);
  resetQuoteTimer();
}

function startQuoteTimer() {
  if (quoteTimer) clearInterval(quoteTimer);
  quoteTimer = setInterval(function() {
    quoteIndex = (quoteIndex + 1) % loveQuotes.length;
    showQuote(quoteIndex);
  }, 5000);
}

function resetQuoteTimer() {
  if (quoteTimer) clearInterval(quoteTimer);
  startQuoteTimer();
}

/* ===== Wish List ===== */
var defaultWishes = [
  { icon: '🌊', text: '一起去看海' },
  { icon: '🎢', text: '一起去游乐园' },
  { icon: '🍜', text: '一起吃遍美食街' },
  { icon: '🌅', text: '一起看一次日出' },
  { icon: '🌄', text: '一起看一次日落' },
  { icon: '✈️', text: '一起去旅行' },
  { icon: '🏔️', text: '一起爬一次山' },
  { icon: '📸', text: '拍一组情侣写真' },
  { icon: '🎬', text: '一起看100部电影' },
  { icon: '📖', text: '一起读完一本书' },
  { icon: '🏠', text: '一起布置我们的小家' },
  { icon: '🔑', text: '新房交房，拿到钥匙' },
  { icon: '📐', text: '一起设计装修方案' },
  { icon: '🎨', text: '一起选墙漆颜色' },
  { icon: '🛋️', text: '一起挑家具逛家居城' },
  { icon: '💡', text: '一起选灯和软装' },
  { icon: '👷', text: '一起监工装修' },
  { icon: '🧹', text: '一起打扫新家' },
  { icon: '📦', text: '一起打包搬家' },
  { icon: '🎉', text: '办一场乔迁派对' },
  { icon: '🍳', text: '在新家一起做第一顿饭' },
  { icon: '🌱', text: '在阳台养花种绿植' },
  { icon: '🐱', text: '养一只小猫或小狗' },
  { icon: '👨‍👩‍👧‍👦', text: '一起见家长' },
  { icon: '🎄', text: '一起装饰第一个圣诞树' },
  { icon: '🎂', text: '一起过每一个生日' },
  { icon: '🏡', text: '在新家过第一个年' },
  { icon: '📝', text: '给对方写一封信' },
  { icon: '💍', text: '一起挑选对戒' },
  { icon: '💑', text: '永远在一起' }
];

function renderWishList() {
  var grid = document.getElementById('wishGrid');
  if (!grid) return;
  var wishes = JSON.parse(localStorage.getItem('loveWishes') || 'null');
  if (!wishes || !wishes.length) {
    wishes = defaultWishes.map(function(w) { return { icon: w.icon, text: w.text, done: false }; });
    localStorage.setItem('loveWishes', JSON.stringify(wishes));
  }
  grid.innerHTML = '';
  wishes.forEach(function(w, i) {
    var el = document.createElement('div');
    el.className = 'wish-item' + (w.done ? ' done' : '');
    el.onclick = function() { toggleWish(i); };
    el.innerHTML = '<span class="wish-icon">' + w.icon + '</span>' +
      '<span class="wish-text">' + escHtml(w.text) + '</span>' +
      '<span class="wish-check">' + (w.done ? '✓' : '') + '</span>';
    grid.appendChild(el);
  });
}

function toggleWish(idx) {
  var wishes = JSON.parse(localStorage.getItem('loveWishes'));
  if (!wishes || idx >= wishes.length) return;
  wishes[idx].done = !wishes[idx].done;
  localStorage.setItem('loveWishes', JSON.stringify(wishes));
  renderWishList();
}

/* ===== Next Milestone Countdown ===== */
function renderNextMilestone() {
  var el = document.getElementById('nextMilestone');
  if (!el) return;
  var milestones = [
    { label:'在一起', date:LOVE_START_DATE, icon:'💕' },
    { label:'一个月', date:addDate(LOVE_START_DATE,0,1), icon:'🎉' },
    { label:'100天', date:addDate(LOVE_START_DATE,100,0), icon:'💯' },
    { label:'半年', date:addDate(LOVE_START_DATE,0,6), icon:'🎊' },
    { label:'一周年', date:addDate(LOVE_START_DATE,0,12), icon:'🎂' },
    { label:'500天', date:addDate(LOVE_START_DATE,500,0), icon:'🌟' }
  ];
  var today = new Date(); today.setHours(0,0,0,0);
  var next = null;
  for (var i = 0; i < milestones.length; i++) {
    var d = new Date(milestones[i].date); d.setHours(0,0,0,0);
    if (d >= today) { next = milestones[i]; break; }
  }
  if (!next) { el.style.display = 'none'; return; }
  var d = new Date(next.date); d.setHours(0,0,0,0);
  var remain = Math.floor((d - today) / 86400000);
  el.style.display = 'block';
  el.innerHTML = '<div class="next-milestone-card">' +
    '<div class="next-milestone-icon">' + next.icon + '</div>' +
    '<div class="next-milestone-info">' +
      '<div class="next-milestone-label">下一个纪念日</div>' +
      '<div class="next-milestone-name">' + next.label + '</div>' +
      '<div class="next-milestone-date">' + next.date + '</div>' +
    '</div>' +
    '<div class="next-milestone-countdown">' +
      '<div class="next-milestone-num">' + remain + '</div>' +
      '<div class="next-milestone-unit">天后</div>' +
    '</div>' +
  '</div>';
}

/* ===== Future Plans (新家计划) ===== */
var defaultPlans = [
  { icon: '🏗️', text: '新房交付', done: false },
  { icon: '📐', text: '商量装修风格', done: false },
  { icon: '🎨', text: '选乳胶漆颜色', done: false },
  { icon: '🪵', text: '挑地板和瓷砖', done: false },
  { icon: '🛋️', text: '选沙发和床', done: false },
  { icon: '🍳', text: '选厨房橱柜', done: false },
  { icon: '🚿', text: '选卫浴洁具', done: false },
  { icon: '💡', text: '选全屋灯具', done: false },
  { icon: '🏷️', text: '定制衣柜和收纳', done: false },
  { icon: '🖼️', text: '选挂画装饰', done: false },
  { icon: '🧹', text: '搬家前大扫除', done: false },
  { icon: '📦', text: '打包搬家入住', done: false },
  { icon: '🍳', text: '在新家做第一顿饭', done: false },
  { icon: '🌱', text: '布置阳台小花园', done: false },
  { icon: '🎉', text: '办暖房派对', done: false }
];

function renderFuturePlans() {
  var grid = document.getElementById('plansGrid');
  if (!grid) return;
  var plans = JSON.parse(localStorage.getItem('lovePlans') || 'null');
  if (!plans || !plans.length) {
    plans = defaultPlans.map(function(p) { return { icon: p.icon, text: p.text, done: p.done }; });
    localStorage.setItem('lovePlans', JSON.stringify(plans));
  }
  grid.innerHTML = '';
  plans.forEach(function(p, i) {
    var el = document.createElement('div');
    el.className = 'plan-item' + (p.done ? ' done' : '');
    el.onclick = function() { togglePlan(i); };
    el.innerHTML = '<span class="plan-icon">' + p.icon + '</span>' +
      '<span class="plan-text">' + escHtml(p.text) + '</span>' +
      '<span class="plan-check">' + (p.done ? '✓' : '') + '</span>';
    grid.appendChild(el);
  });
  updatePlanProgress();
}

function togglePlan(idx) {
  var plans = JSON.parse(localStorage.getItem('lovePlans'));
  if (!plans || idx >= plans.length) return;
  plans[idx].done = !plans[idx].done;
  localStorage.setItem('lovePlans', JSON.stringify(plans));
  renderFuturePlans();
}

function updatePlanProgress() {
  var bar = document.getElementById('planProgress');
  if (!bar) return;
  var plans = JSON.parse(localStorage.getItem('lovePlans') || '[]');
  if (!plans.length) return;
  var done = plans.filter(function(p) { return p.done; }).length;
  var pct = Math.round(done / plans.length * 100);
  bar.innerHTML = '<div class="plan-progress-bar"><div class="plan-progress-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="plan-progress-text">装修进度 ' + done + '/' + plans.length + '（' + pct + '%）</div>';
}

/* ===== Today's Memory Pick ===== */
var todayMemoryIdx = -1;

function renderTodayMemory() {
  var el = document.getElementById('todayMemory');
  if (!el || !memories.length) return;
  pickRandomMemory();
}

function pickRandomMemory() {
  var idx = Math.floor(Math.random() * memories.length);
  todayMemoryIdx = idx;
  showMemory(idx);
}

function showMemory(idx) {
  var el = document.getElementById('todayMemory');
  if (!el || idx < 0 || idx >= memories.length) return;
  var m = memories[idx];
  var text = m.text || '';
  if (m.chats && m.chats.length) {
    text = m.chats.map(function(c) { return c.name + ': ' + c.text; }).join('  ');
  }
  var photoHtml = '';
  if (m.photos && m.photos.length) {
    photoHtml = '<div class="today-memory-photos">';
    m.photos.slice(0, 3).forEach(function(p) {
      photoHtml += '<img src="photos/' + p + '" loading="lazy" onclick="openLightbox(\'photos/' + p + '\',allPhotos)" style="width:60px;height:60px;border-radius:10px;object-fit:cover;cursor:pointer">';
    });
    photoHtml += '</div>';
  }
  el.innerHTML = '<div class="today-memory-card">' +
    '<div class="today-memory-header"><span class="today-memory-badge">🎲 今日回忆</span><button class="today-memory-shuffle" onclick="pickRandomMemory()">换一个 ↻</button></div>' +
    '<div class="today-memory-date">' + m.date + '</div>' +
    '<div class="today-memory-title">' + (m.title || '') + '</div>' +
    '<div class="today-memory-text">' + escHtml(text) + '</div>' +
    photoHtml +
  '</div>';
}

/* ===== Love Diary ===== */
function renderLoveDiary() {
  var list = document.getElementById('diaryList');
  if (!list) return;
  var entries = JSON.parse(localStorage.getItem('loveDiary') || '[]');
  if (!entries.length) {
    list.innerHTML = '<div class="empty-state">还没有日记，写一篇吧 💕</div>';
    return;
  }
  list.innerHTML = '';
  entries.slice(0, 10).forEach(function(e) {
    var el = document.createElement('div');
    el.className = 'diary-item';
    var ts = new Date(e.time);
    var d = ts.getFullYear() + '-' + (ts.getMonth()+1).toString().padStart(2,'0') + '-' + ts.getDate().toString().padStart(2,'0');
    var t = ts.getHours().toString().padStart(2,'0') + ':' + ts.getMinutes().toString().padStart(2,'0');
    el.innerHTML = '<div class="diary-item-header">' +
      '<span class="diary-item-date">' + d + '</span>' +
      '<span class="diary-item-time">' + t + '</span>' +
    '</div><div class="diary-item-text">' + escHtml(e.text) + '</div>' +
    '<div class="diary-item-mood">' + (e.mood || '💕') + '</div>';
    list.appendChild(el);
  });
}

function postDiary() {
  var input = document.getElementById('diaryInput');
  var moodEl = document.getElementById('diaryMood');
  var text = input.value.trim();
  if (!text) return;
  var mood = moodEl ? moodEl.value : '💕';
  var entries = JSON.parse(localStorage.getItem('loveDiary') || '[]');
  entries.unshift({ text: text, mood: mood, time: new Date().toISOString() });
  localStorage.setItem('loveDiary', JSON.stringify(entries));
  input.value = '';
  renderLoveDiary();
  // Show a little heart animation
  var btn = document.getElementById('diaryPostBtn');
  if (btn) { btn.textContent = '已记录 💖'; setTimeout(function(){ btn.textContent = '记录今日 ✍️'; }, 1500); }
}

/* ===== Achievements ===== */
function renderAchievements() {
  var grid = document.getElementById('achievementGrid');
  if (!grid || !achievements) return;
  grid.innerHTML = '';
  achievements.forEach(function(a) {
    var el = document.createElement('div');
    el.className = 'achievement-item' + (a.unlocked ? '' : ' locked');
    el.innerHTML = '<div class="achievement-icon">' + (a.unlocked ? a.icon : '🔒') + '</div>' +
      '<div class="achievement-info">' +
      '<div class="achievement-title">' + a.title + '</div>' +
      '<div class="achievement-desc">' + a.desc + '</div>' +
      (a.unlocked ? '<div class="achievement-check">✓</div>' : '<div class="achievement-locked">🔒</div>') +
    '</div>';
    grid.appendChild(el);
  });
}

/* ===== Couple Quiz ===== */
var quizState = {};

function renderQuiz() {
  var container = document.getElementById('quizContainer');
  if (!container || !quizQuestions) return;
  container.innerHTML = '';
  quizQuestions.forEach(function(q, i) {
    var el = document.createElement('div');
    el.className = 'quiz-card';
    var herAnswer = q.her || '🤔 等你来填';
    var himAnswer = q.him || '🤔 等你来填';
    var match = q.her && q.him && q.her.trim().toLowerCase() === q.him.trim().toLowerCase();
    el.innerHTML = '<div class="quiz-icon">' + (q.icon || '💕') + '</div>' +
      '<div class="quiz-question">' + escHtml(q.q) + '</div>' +
      '<div class="quiz-answers">' +
        '<div class="quiz-answer her"><span class="quiz-label">她的回答</span><span>' + escHtml(herAnswer) + '</span></div>' +
        '<div class="quiz-answer him"><span class="quiz-label">他的回答</span><span>' + escHtml(himAnswer) + '</span></div>' +
      '</div>' +
      (match ? '<div class="quiz-match">💯 默契！</div>' : '<div class="quiz-nomatch">💔 还没填</div>');
    container.appendChild(el);
  });
}

/* ===== Pages (SPA mode) ===== */
function switchPage(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  var navItem = document.querySelector('.nav-item[data-page="' + page + '"]');
  if (navItem) navItem.classList.add('active');
  // Scroll to top of the newly active page (non-home pages need padding offset)
  setTimeout(function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, 10);
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
  for (var i = 0; i < 40; i++) particles.push({
    x: Math.random() * c.width, y: Math.random() * c.height,
    size: Math.random() * 3 + 1, alpha: Math.random() * 0.5 + 0.1,
    speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
    color: Math.random() > 0.5 ? '255,107,157' : '156,39,176'
  });
  function anim() {
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(function(p) {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      ctx.fill(); p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
    });
    requestAnimationFrame(anim);
  }
  anim();
}

function initScroll() {
  window.addEventListener('scroll', function() {
    var btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('show', window.scrollY > 500);
  });
}

function initNavbar() {
  var lastY = 0;
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 100) nav.classList.toggle('hidden', window.scrollY > lastY && window.scrollY > 200);
    else nav.classList.remove('hidden');
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
  updateLbCounter(); document.body.style.overflow = 'hidden';
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

/* ===== Music Player ===== */
function toggleMusicPanel() {
  var panel = document.getElementById('musicPanel');
  if (!panel) return;
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    setTimeout(function() { playMelody(); }, 300);
  }
}

function playMelody() {
  try {
    var ac = new (window.AudioContext || window.webkitAudioContext)();
    var now = ac.currentTime;
    function n(freq, start, dur, vol) {
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol || 0.25, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.start(now + start); osc.stop(now + start + dur);
    }
    var notes = [
      [523,0,0.2],[587,0.2,0.2],[659,0.4,0.2],[784,0.6,0.25],[659,0.9,0.12],[784,1.05,0.25],
      [1047,1.35,0.35],[784,1.75,0.12],[659,1.9,0.12],[587,2.05,0.12],[523,2.2,0.35],
      [587,2.6,0.12],[659,2.75,0.12],[784,2.9,0.25],[659,3.2,0.25],[523,3.5,0.5],
      [659,4.1,0.2],[784,4.3,0.2],[880,4.5,0.3],[784,4.8,0.15],[659,4.95,0.15],
      [587,5.1,0.3],[523,5.4,0.2],[587,5.6,0.2],[659,5.8,0.3],[784,6.1,0.6]
    ];
    notes.forEach(function(x) { n(x[0], x[1], x[2], 0.2); });
  } catch(e) {}
}
