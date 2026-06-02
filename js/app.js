// ===== 密码验证 =====
function checkPwd() {
  var input = document.getElementById('pwdInput').value;
  if (input === SITE_PASSWORD) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    initApp();
  } else {
    document.getElementById('pwdError').textContent = '密码不对哦，再试试 💕';
    document.getElementById('pwdInput').value = '';
    document.getElementById('pwdInput').focus();
  }
}

// 回车键登录
document.addEventListener('DOMContentLoaded', function() {
  var pwdInput = document.getElementById('pwdInput');
  if (pwdInput) {
    pwdInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') checkPwd();
    });
  }
});

// ===== 主应用 =====
var currentFilter = '全部';

function initApp() {
  renderCards(getFilteredMemories());
  buildFilters();
}

function getFilteredMemories() {
  if (currentFilter === '全部') return memories;
  return memories.filter(function(m) {
    return m.date.substring(0, 7) === currentFilter;
  });
}

function buildFilters() {
  var bar = document.getElementById('filterBar');
  // 提取所有月份
  var months = {};
  memories.forEach(function(m) {
    var ym = m.date.substring(0, 7);
    months[ym] = true;
  });
  var sorted = Object.keys(months).sort().reverse();
  sorted.forEach(function(ym) {
    var label = ym.split('-')[0] + '年' + ym.split('-')[1] + '月';
    var btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.textContent = label;
    btn.dataset.ym = ym;
    btn.onclick = function() { filterByMonth(ym); };
    bar.appendChild(btn);
  });
}

function filterAll() {
  currentFilter = '全部';
  document.querySelectorAll('.filter-tag').forEach(function(b) { b.classList.remove('active'); });
  document.querySelector('.filter-tag:first-child').classList.add('active');
  document.getElementById('currentMonth').textContent = '全部回忆';
  renderCards(getFilteredMemories());
}

function filterByMonth(ym) {
  currentFilter = ym;
  document.querySelectorAll('.filter-tag').forEach(function(b) { b.classList.remove('active'); });
  event.target.classList.add('active');
  var parts = ym.split('-');
  document.getElementById('currentMonth').textContent = parts[0] + '年' + parts[1] + '月';
  renderCards(getFilteredMemories());
}

function toggleFilter() {
  var bar = document.getElementById('filterBar');
  bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
}

function renderCards(items) {
  var container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  
  if (items.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#999">这个月还没有记录哦 💕</div>';
    return;
  }
  
  items.forEach(function(m, idx) {
    var card = document.createElement('div');
    card.className = 'card';
    
    // Date
    var dateEl = document.createElement('div');
    dateEl.className = 'card-date';
    dateEl.textContent = formatDate(m.date);
    card.appendChild(dateEl);
    
    // Title
    if (m.title) {
      var titleEl = document.createElement('div');
      titleEl.className = 'card-title';
      titleEl.textContent = m.title;
      card.appendChild(titleEl);
    }
    
    // Chats
    if (m.chats) {
      m.chats.forEach(function(chat) {
        var label = document.createElement('div');
        label.className = 'chat-label';
        label.textContent = chat.name;
        card.appendChild(label);
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + (chat.name === '他' || chat.name === '我' ? 'his' : 'hers');
        bubble.textContent = chat.text;
        card.appendChild(bubble);
      });
    }
    
    // Text
    if (m.text) {
      var textEl = document.createElement('div');
      textEl.className = 'card-text';
      textEl.textContent = m.text;
      card.appendChild(textEl);
    }
    
    // Photos
    if (m.photos && m.photos.length > 0) {
      var photosEl = document.createElement('div');
      var cls = 'card-photos';
      if (m.photos.length === 1) cls += ' single';
      else if (m.photos.length === 2) cls += ' double';
      else cls += ' multiple';
      photosEl.className = cls;
      
      m.photos.forEach(function(p) {
        var img = document.createElement('img');
        img.src = 'photos/' + p;
        img.alt = 'photo';
        img.loading = 'lazy';
        img.onclick = function() { window.open(img.src); };
        img.onerror = function() {
          img.style.display = 'none';
          var placeholder = document.createElement('div');
          placeholder.style.cssText = 'aspect-ratio:1;background:#fce4ec;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#e91e63';
          placeholder.textContent = '📸';
          photosEl.insertBefore(placeholder, img.nextSibling);
        };
        photosEl.appendChild(img);
      });
      card.appendChild(photosEl);
    }
    
    container.appendChild(card);
  });
}

function formatDate(dateStr) {
  var parts = dateStr.split('-');
  var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  var d = new Date(parts[0], parts[1]-1, parts[2]);
  return parts[0] + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日 星期' + weekdays[d.getDay()];
}
