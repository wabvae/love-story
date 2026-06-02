// ===== 密码（你设一个，后期可以改） =====
const SITE_PASSWORD = '5201314';

// ===== 数据：按时间倒序排列 =====
// 格式说明：
//   date:      日期，用于显示和排序
//   title:     卡片标题（可选）
//   chats:     聊天记录，每条有 name(谁说的) 和 text(内容)
//   text:      纯文字内容（没有聊天的用这个）
//   photos:    照片文件名，放在 photos/ 目录下（可选）

const memories = [
  {
    date: '2026-06-01',
    title: '六一快乐 🎈',
    chats: [
      { name: '他', text: '六一快乐宝贝！今天想吃啥？' },
      { name: '她', text: '想吃你做的饭 😋' },
      { name: '他', text: '安排！晚上给你做好吃的' }
    ],
    photos: ['photo1.jpg', 'photo2.jpg']
  },
  {
    date: '2026-05-20',
    title: '520 💕',
    text: '今天是520，虽然不是什么特别的日子，但和你在一起的每一天都很特别。',
    photos: ['photo3.jpg']
  },
  {
    date: '2026-05-15',
    title: '周末散步',
    chats: [
      { name: '他', text: '今天天气好好，出去走走？' },
      { name: '她', text: '好呀！去公园吧 🌸' },
      { name: '他', text: '走，给你买冰淇淋' }
    ]
  }
];
