/* ===== 密码 ===== */
function checkPwd() {
  var input = document.getElementById('pwdInput').value;
  if (input === SITE_PASSWORD) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('mainApp').classList.add('show');
    initApp();
  } else {
    document.getElementById('pwdError').textContent = '密码不对哦，再试试 💕';
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdInput').focus();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var pwdInput = document.getElementById('pwdInput');
  if (pwdInput) {
    pwdInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') checkPwd();
    });
  }
  drawLoginBg();
});

/* ===== 登录页动态背景 ===== */
function drawLoginBg() {
  var c = document.getElementById('loginBg');
  if (!c) return;
  var ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  var hearts = [];
  for (var i = 0; i < 30; i++) {
    hearts.push({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 6 + 3,
      dx: (Math.random() - 0.5) * 0.8,
      dy: -Math.random() * 0.5 - 0.3,
      alpha: Math.random() * 0.4 + 0.2
    });
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    hearts.forEach(function(h) {
      ctx.globalAlpha = h.alpha;
      ctx.font = h.r * 3 + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💕', h.x, h.y);
      h.x += h.dx;
      h.y += h.dy;
      if (h.y < -20) { h.y = c.height + 20; h.x = Math.random() * c.width; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ===== 主应用 ===== */
var allPhotos = [];
var currentFilter = 'all';
var lightboxIndex = 0;
var lightboxPhotos = [];

function initApp() {
  collectAllPhotos();
  renderHome();
  renderMemories(memories);
  renderGallery();
  renderMilestones();
  buildFilters();
  setupHeartCanvas();
  setupScroll();
}

/* ===== 天数计算 ===== */
function getLoveDays() {
  var start = new Date(LOVE_START_DATE);
  var today = new Date();
  today.setHours(0,0,0,0);
  start.setHours(0,0,0,0);
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

/* ===== 收集照片 ===== */
function collectAllPhotos() {
  allPhotos = [];
  memories.forEach(function(m) {
    if (m.photos) {
      m.photos.forEach(function(p) { allPhotos.push({ src:'photos/'+p, memory:m }); });
    }
  });
}

/* ===== 首页 ===== */
function renderHome() {
  var days = getLoveDays();
  document.getElementById('daysCount').textContent = days + ' 天 💕';
  document.getElementById('aboutDays').textContent = days + '天';

  // 统计
  var totalPhotos = allPhotos.length;
  var totalChats = 0;
  memories.forEach(function(m) {
    if (m.chats) totalChats += m.chats.length;
  });
  document.getElementById('statMemories').textContent = memories.length;
  document.getElementById('statPhotos').textContent = totalPhotos;
  document.getElementById('statChats').textContent = totalChats;
  document.getElementById('aboutMemories').textContent = memories.length;
  document.getElementById('aboutPhotos').textContent = totalPhotos;

  // 随机语录
  document.getElementById('randomQuote').textContent = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

  // 统计标签改成"在一起第XX天"
  document.querySelector('.counter-label').textContent = '从 2025.12.6 开始';

  // 最近照片
  var recentGrid = document.getElementById('recentGrid');
  var recent = allPhotos.slice(0, 6);
  recentGrid.innerHTML = '';
  recent.forEach(function(p) {
    var img = document.createElement('img');
    img.src = p.src;
    img.loading = 'lazy';
    img.onclick = function() { openLightbox(p.src, allPhotos.map(function(x){return x.src})); };
    recentGrid.appendChild(img);
  });

  // 最新回忆
  var cards = document.getElementById('recentCards');
  var latest = memories.slice(0, 5);
  cards.innerHTML = '';
  var emojis = ['💕', '📸', '🎉', '💌', '🌟', '🎈'];
  latest.forEach(function(m) {
    var card = document.createElement('div');
    card.className = 'recent-card';
    card.onclick = function() { switchPage('memories'); };
    var text = m.text || (m.chats ? m.chats[0].text.substring(0, 30) + '...' : '');
    var emoji = emojis[Math.floor(Math.random() * emojis.length)];
    card.innerHTML = '<div class="recent-card-emoji">' + emoji + '</div>' +
      '<div class="recent-card-content"><div class="recent-card-title">' + (m.title || '我们的回忆') + '</div>' +
      '<div class="recent-card-date">' + formatDate(m.date) + '</div>' +
      '<div class="recent-card-text">' + escapeHtml(text) + '</div></div>';
    cards.appendChild(card);
  });
}

/* ===== 里程碑 ===== */
function renderMilestones() {
  var container = document.getElementById('page-home');
  var section = document.createElement('div');
  section.className = 'milestones-section';
  section.innerHTML = '<div class="section-title"><h2>🏆 我们的里程碑</h2></div><div class="milestones-container"></div>';
  
  // 插入在相册后面
  var recentGrid = document.getElementById('recentGrid');
  if (recentGrid) recentGrid.parentNode.insertBefore(section, recentGrid.nextSibling);
  
  var grid = section.querySelector('.milestones-container');
  var days = getLoveDays();
  
  var allMilestones = [
    { label: '在一起', date: LOVE_START_DATE, icon: '💕' },
    { label: '一月', date: addMonths(LOVE_START_DATE, 1), icon: '🎉' },
    { label: '100天', date: addDays(LOVE_START_DATE, 100), icon: '💯' },
    { label: '半年', date: addMonths(LOVE_START_DATE, 6), icon: '🎊' },
    { label: '一年', date: addMonths(LOVE_START_DATE, 12), icon: '🎂' },
    { label: '500天', date: addDays(LOVE_START_DATE, 500), icon: '🌟' }
  ];
  
  var today = new Date();
  today.setHours(0,0,0,0);
  
  allMilestones.forEach(function(m) {
    var d = new Date(m.date);
    d.setHours(0,0,0,0);
    var passed = (today - d) >= 0;
    var remaining = Math.abs(Math.floor((d - today) / (1000*60*60*24)));
    
    var item = document.createElement('div');
    item.className = 'milestone-item' + (passed ? ' passed' : ' upcoming');
    item.innerHTML = '<div class="milestone-icon">' + m.icon + '</div>' +
      '<div class="milestone-info"><div class="milestone-label">' + m.label + '</div>' +
      '<div class="milestone-date">' + formatDateRaw(m.date) + '</div></div>' +
      '<div class="milestone-status">' + (passed ? '✅ 已度过' : '⏳ 还有' + remaining + '天') + '</div>';
    grid.appendChild(item);
  });
}

function addDays(dateStr, days) {
  var d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().substring(0, 10);
}
function addMonths(dateStr, months) {
  var d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().substring(0, 10);
}

/* ===== 回忆页 ===== */
function renderMemories(items) {
  var container = document.getElementById('memoriesContainer');
  container.innerHTML = '<div class="timeline-line"></div>';
  
  if (items.length === 0) {
    container.innerHTML += '<div style="text-align:center;padding:60px 20px;color:#999">还没有记录哦 💕</div>';
    return;
  }
  
  items.forEach(function(m) {
    var card = document.createElement('div');
    card.className = 'memory-card';
    
    card.innerHTML += '<div class="memory-date">' + formatDate(m.date) + '</div>';
    if (m.title) card.innerHTML += '<div class="memory-title">' + m.title + '</div>';
    
    if (m.chats) {
      m.chats.forEach(function(chat) {
        var cls = (chat.name === '他' || chat.name === '我') ? 'his' : 'hers';
        card.innerHTML += '<div class="chat-label">' + chat.name + '</div>';
        card.innerHTML += '<div class="chat-bubble ' + cls + '">' + escapeHtml(chat.text) + '</div>';
      });
    }
    
    if (m.text) card.innerHTML += '<div class="memory-text">' + escapeHtml(m.text) + '</div>';
    
    if (m.photos && m.photos.length > 0) {
      var cls = 'memory-photos';
      if (m.photos.length === 1) cls += ' single';
      else if (m.photos.length === 2) cls += ' double';
      else cls += ' multiple';
      
      var photoSrcs = JSON.stringify(m.photos.map(function(x){return 'photos/'+x}));
      var photosHtml = '<div class="' + cls + '">';
      m.photos.forEach(function(p) {
        photosHtml += '<img src="photos/' + p + '" loading="lazy" onclick="event.stopPropagation();openLightbox(\'photos/' + p + '\', ' + photoSrcs + ')">';
      });
      photosHtml += '</div>';
      card.innerHTML += photosHtml;
    }
    
    container.appendChild(card);
  });
}

/* ===== 相册页 ===== */
function renderGallery() {
  var grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  allPhotos.forEach(function(p) {
    var img = document.createElement('img');
    img.src = p.src;
    img.loading = 'lazy';
    img.onclick = function() { openLightbox(p.src, allPhotos.map(function(x){return x.src})); };
    grid.appendChild(img);
  });
}

/* ===== 筛选 ===== */
function buildFilters() {
  var bar = document.getElementById('filterBarTop');
  var months = {};
  memories.forEach(function(m) {
    months[m.date.substring(0, 7)] = true;
  });
  var sorted = Object.keys(months).sort().reverse();
  sorted.forEach(function(ym) {
    var label = ym.split('-')[0] + '年' + parseInt(ym.split('-')[1]) + '月';
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = label;
    btn.onclick = function() { filterMemories(ym); };
    bar.appendChild(btn);
  });
}

function filterMemories(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-bar .filter-btn').forEach(function(b) { b.classList.remove('active'); });
  event.target.classList.add('active');
  var items = (filter === 'all') ? memories : memories.filter(function(m) { return m.date.substring(0, 7) === filter; });
  renderMemories(items);
}

/* ===== 页面切换 ===== */
function switchPage(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector('.nav-btn[data-page="' + page + '"]').classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
  document.querySelector('.nav-links').classList.remove('open');
}

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.nav-btn');
  if (btn) {
    var page = btn.dataset.page;
    if (page) switchPage(page);
  }
});

function toggleNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

/* ===== 爱心粒子动效 ===== */
function setupHeartCanvas() {
  var c = document.getElementById('heartCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  function resize() {
    c.width = c.parentElement.offsetWidth;
    c.height = c.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  var particles = [];
  for (var i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      size: Math.random() * 14 + 8,
      speedY: -Math.random() * 1 - 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.4 + 0.2
    });
  }
  var emojis = ['💕', '✨', '🌸', '💝'];
  
  function animate() {
    ctx.clearRect(0, 0, c.width, c.height);
    particles.forEach(function(p, idx) {
      ctx.globalAlpha = p.alpha;
      ctx.font = p.size + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(emojis[idx % emojis.length], p.x, p.y);
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.y < -20) { p.y = c.height + 20; p.x = Math.random() * c.width; }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function setupScroll() {
  window.addEventListener('scroll', function() {
    var btn = document.getElementById('backTop');
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  });
}

/* ===== 图片预览 ===== */
function openLightbox(src, allSrcs) {
  document.getElementById('lightboxImg').src = src;
  lightboxPhotos = allSrcs || [src];
  lightboxIndex = lightboxPhotos.indexOf(src);
  if (lightboxIndex < 0) lightboxIndex = 0;
  document.getElementById('lightbox').classList.add('show');
  updateLightboxCounter();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = '';
}

function prevPhoto() {
  lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
  document.getElementById('lightboxImg').src = lightboxPhotos[lightboxIndex];
  updateLightboxCounter();
}

function nextPhoto() {
  lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
  document.getElementById('lightboxImg').src = lightboxPhotos[lightboxIndex];
  updateLightboxCounter();
}

function updateLightboxCounter() {
  document.getElementById('lightboxCounter').textContent = (lightboxIndex + 1) + ' / ' + lightboxPhotos.length;
}

document.addEventListener('keydown', function(e) {
  if (document.getElementById('lightbox').classList.contains('show')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  }
});

/* ===== 工具 ===== */
function formatDate(dateStr) {
  var parts = dateStr.split('-');
  var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  var d = new Date(parts[0], parts[1]-1, parts[2]);
  return parts[0] + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日 星期' + weekdays[d.getDay()];
}

function formatDateRaw(dateStr) {
  var parts = dateStr.split('-');
  return parts[0] + '.' + parseInt(parts[1]) + '.' + parseInt(parts[2]);
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
