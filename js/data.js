// ===== 密码 =====
const SITE_PASSWORD = '1006';

// ===== 在一起的日子（从这天开始算） =====
const LOVE_START_DATE = '2025-12-06';

// ===== 女朋友的称呼 =====
const HER_NAME = '宝贝';

// ===== 数据：按时间倒序排列 =====
const memories = [
  {
    date: '2026-06-02',
    title: '我们的照片书 📖',
    text: '把我们的回忆装进照片书里，每一页都是故事 💕',
    photos: ['photo_01.jpg', 'photo_02.jpg', 'photo_03.jpg', 'photo_04.jpg', 'photo_05.jpg', 'photo_06.jpg']
  },
  {
    date: '2026-06-02',
    title: '更多美好瞬间 ✨',
    text: '和你在一起的每一天都值得被记录下来 💕',
    photos: ['photo_07.jpg', 'photo_08.jpg', 'photo_09.jpg', 'photo_10.jpg', 'photo_11.jpg', 'photo_12.jpg']
  },
  {
    date: '2026-06-02',
    title: '未完待续 💝',
    text: '故事还在继续，未来还有更多美好等着我们 💕',
    photos: ['photo_13.jpg', 'photo_14.jpg', 'photo_15.jpg']
  },
  {
    date: '2026-06-01',
    title: '六一快乐 🎈',
    chats: [
      { name: '他', text: '六一快乐宝贝！今天想吃啥？' },
      { name: '她', text: '想吃你做的饭 😋' },
      { name: '他', text: '安排！晚上给你做好吃的' }
    ]
  },
  {
    date: '2026-05-20',
    title: '520 💕',
    text: '今天是520，虽然不是什么特别的日子，但和你在一起的每一天都很特别。520那天我们去吃了好吃的，吃完饭你拉着我拍照，看你笑得那么开心，我的心都要化了。你说这张好看那张也好看，其实在我眼里，你怎么样都好看。宝贝，以后的每一个520，我都想和你一起过 💕',
    photos: ['520_01.jpg', '520_02.jpg']
  },
  {
    date: '2026-05-15',
    title: '周末散步',
    chats: [
      { name: '他', text: '今天天气好好，出去走走？' },
      { name: '她', text: '好呀！去公园吧 🌸' },
      { name: '他', text: '走，给你买冰淇淋' }
    ]
  },
  {
    date: '2026-05-01',
    title: '五一劳动节 🎉',
    text: '放假啦！终于可以好好陪你了～一起出去玩了两天，开心！'
  },
  {
    date: '2026-04-15',
    title: '春天的约会 🌸',
    chats: [
      { name: '他', text: '今天天气真好，我们去看花吧' },
      { name: '她', text: '好呀！春天的花都开了 🌷' },
      { name: '他', text: '你比花还好看 😄' },
      { name: '她', text: '嘻嘻嘴真甜 🥰' }
    ]
  },
  {
    date: '2026-04-01',
    title: '愚人节玩笑 🃏',
    chats: [
      { name: '她', text: '我好像不喜欢你了' },
      { name: '他', text: '啊？！😱' },
      { name: '她', text: '哈哈哈愚人节快乐！被骗到了吧 😂' },
      { name: '他', text: '吓死我了…你等着 😤' }
    ]
  },
  {
    date: '2026-03-14',
    title: '白色情人节 💝',
    text: '给你准备了惊喜，看到你开心的样子，比什么都值得。'
  },
  {
    date: '2026-02-14',
    title: '第一个情人节 💕',
    text: '这是我们在一起之后的第一个情人节，想对你说——遇见你是我最大的幸运。',
    chats: [
      { name: '他', text: '情人节快乐！这是我送你的礼物 🎁' },
      { name: '她', text: '哇好喜欢！谢谢你 😭💕' },
      { name: '他', text: '你喜欢就好，以后每个情人节都陪你过' }
    ]
  },
  {
    date: '2026-01-01',
    title: '跨年夜 🎆',
    text: '一起跨年啦！在烟花下许的愿望，每一个都关于你。'
  },
  {
    date: '2025-12-25',
    title: '圣诞快乐 🎄',
    chats: [
      { name: '他', text: 'Merry Christmas！想和你一起过每一个圣诞' },
      { name: '她', text: '圣诞快乐！今天的约会很开心 🥰' }
    ]
  },
  {
    date: '2025-12-06',
    title: '故事的开始 💕',
    text: '这一天，我们在一起了。从那天起，世界变得更美好了。这是我们的第1天。',
    chats: [
      { name: '他', text: '我喜欢你，做我女朋友好吗？' },
      { name: '她', text: '好 💕' }
    ]
  }
];

// ===== 恋爱语录（随机展示） =====
const loveQuotes = [
  '和你在一起的每一天，都是最好的礼物 💕',
  '世界很大，但我的世界里有你就够了',
  '最好的爱情，是一起变成更好的人',
  '你是我平淡生活里的星辰 ✨',
  '爱是细节，是日常，是你在我身边',
  '有你在的地方，就是家 🏠',
  '谢谢你，成为我故事里的女主角 💝',
  '遇见你是我这辈子最幸运的事',
  '我想和你一起，从清晨到日暮 🌅',
  '你的笑是我一天中最期待的事 😊',
  '不管过多久，我还是会像现在这样喜欢你',
  '和你在一起的每分每秒，都是最好的时光 ⏰',
  '我们的新家，要从毛坯变成温暖 🏡',
  '想和你一起选一盏灯，照亮我们的家 💡',
  '以后每天下班，家里有你等我回来 🚪',
  '一起装修的每一天，都是未来的回忆 🛠️',
  '我们一起把房子变成家，这就是爱情最好的样子 🏠❤️',
  '未来很长，但牵着你的手就不怕 🌈',
  '想和你一起慢慢变老，看遍四季风景 🍂🌻❄️🌸'
];

// ===== 默契问答（选择题） =====
// 女票的回答在下标 0 开始，他的回答在下标 1 开始
// 如果两人答案一样就是默契！
const quizQuestions = [
  { q: '我们在一起是哪一天？', her: '2025.12.6', him: '2025.12.6', icon: '💕' },
  { q: '宝贝最喜欢什么颜色？', her: '粉色', him: '', icon: '🎨' },
  { q: '第一次约会去了哪里？', her: '', him: '', icon: '📍' },
  { q: '宝贝最爱吃什么？', her: '', him: '', icon: '🍜' },
  { q: '我们第一次看的电影是什么？', her: '', him: '', icon: '🎬' },
  { q: '宝贝的生日是哪天？', her: '', him: '', icon: '🎂' },
  { q: '宝贝最喜欢的花是什么？', her: '', him: '', icon: '🌸' },
  { q: '我们一起去过最远的地方是？', her: '', him: '', icon: '✈️' },
  { q: '宝贝最想去哪个国家旅行？', her: '', him: '', icon: '🗺️' },
  { q: '我们第一次牵手是在哪里？', her: '', him: '', icon: '🤝' }
];

// ===== 爱的成就 =====
const achievements = [
  { id: 'first_meet', icon: '👋', title: '相遇', desc: '我们在茫茫人海中相遇', unlocked: true },
  { id: 'together', icon: '💕', title: '在一起', desc: '2025.12.6 我们成为彼此的另一半', unlocked: true },
  { id: '100days', icon: '💯', title: '100天', desc: '在一起的第一个100天', unlocked: true, date: '2026-03-16' },
  { id: 'photo_book', icon: '📖', title: '照片书', desc: '把回忆装进照片书', unlocked: true },
  { id: 'website', icon: '🌐', title: '专属网站', desc: '拥有了我们的爱情小站', unlocked: true },
  { id: 'new_home', icon: '🏡', title: '新家钥匙', desc: '拿到新家钥匙，开启新生活', unlocked: false },
  { id: 'move_in', icon: '📦', title: '搬家入住', desc: '搬进属于我们的家', unlocked: false },
  { id: 'half_year', icon: '🎊', title: '半周年', desc: '在一起半年啦', unlocked: false, date: '2026-06-06' },
  { id: 'trip', icon: '✈️', title: '第一次远行', desc: '一起去远方旅行', unlocked: false },
  { id: 'one_year', icon: '🎂', title: '一周年', desc: '在一起一整年', unlocked: false, date: '2026-12-06' },
  { id: 'pet', icon: '🐱', title: '养宠物', desc: '一起养一只小可爱', unlocked: false },
  { id: 'propose', icon: '💍', title: '永远', desc: '往后余生都是你', unlocked: false }
];
