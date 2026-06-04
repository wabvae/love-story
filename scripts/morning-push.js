/**
 * 早安推送脚本 💕
 * 每天早7点自动推送：情话 + 天气 + 穿衣推荐 + 防晒提醒
 * 通过 GitHub Actions 定时触发
 */

const fetch = require('node-fetch');

// ========== 配置 ==========
const CITY = 'Shanghai';   // 城市，可换成你所在的城市
const HER_NAME = process.env.HER_NAME || '宝贝';
const TOKEN = process.env.PUSHPLUS_TOKEN;

// ========== 恋爱语录（你网站里的那些） ==========
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
  '未来很长，但牵着你的手就不怕 🌈',
  '想和你一起慢慢变老，看遍四季风景 🍂🌻❄️🌸'
];

// ========== 你每天对她说的话（会按天轮换） ==========
const dailyMessages = [
  '宝贝早上好呀～新的一天开始了，你今天也要开开心心的哦 ✨',
  '早安宝贝！昨晚睡得好吗？有没有梦到我呀 😄',
  '起床啦我的宝贝～今天的你也超级可爱 💕',
  '早安！一日之计在于晨，但对我来说，一日之计在于你 😊',
  '宝贝早安！想你的第好多好多天，今天也想你 🌞',
  '早安～今天也要像昨天的你一样好看哦，不对，是更好看 💕',
  '我的宝贝该起床啦～太阳都晒屁股了 ☀️',
  '早安！今天又是爱你的一天，每天都比昨天更爱你 💕',
  '宝贝起床啦，早餐吃了吗？记得好好吃饭哦 🥪',
  '早安～你在梦里好乖，所以给你发了这条早安 💙',
  '今天也是超级喜欢你的小智，早安呀～ 🥰',
  '早安！新的一天，新的想你。其实每个小时都在想你 😘',
  '宝贝早安～要记得我爱你比你想象的还要多得多 💕',
  '又是元气满满的一天！因为今天也有你 💪',
];

// ========== 防晒/穿衣指南 ==========
function getUVIndex(uv) {
  const index = parseInt(uv) || 0;
  if (index <= 2) return { level: '低 🌿', tip: '紫外线较低，正常出门就好～' };
  if (index <= 5) return { level: '中等 ☀️', tip: '紫外线中等，出门可以涂点防晒霜哦～' };
  if (index <= 7) return { level: '高 🔆', tip: '紫外线偏强，记得涂防晒霜+戴帽子！' };
  return { level: '很高 🔥', tip: '紫外线极强，一定要涂防晒！戴帽打伞，最好别在太阳下待太久～' };
}

function getClothingSuggestion(temp, weatherDesc) {
  const t = parseInt(temp) || 20;
  const isRain = /rain|shower|drizzle|雷|雨/i.test(weatherDesc);

  let suggestion = '';
  if (t >= 30) suggestion = '今天很热🔥，穿短袖短裤就行，注意防暑～';
  else if (t >= 25) suggestion = '天气温暖🌤，穿短袖或薄长裙正合适～';
  else if (t >= 20) suggestion = '体感舒适😊，短袖+薄外套，早晚微凉要注意～';
  else if (t >= 15) suggestion = '有点凉🍂，建议长袖+外套，别感冒了～';
  else if (t >= 10) suggestion = '比较冷🧥，穿厚外套或毛衣吧～';
  else suggestion = '天冷🥶，多穿点！羽绒服围巾安排上～';

  if (isRain) suggestion += ' 今天有雨🌧，记得带伞！';
  return suggestion;
}

function getWindSuggestion(windSpeed) {
  const speed = parseFloat(windSpeed) || 0;
  if (speed > 30) return '今天风大，出门注意保暖防风～';
  return '';
}

// ========== 获取天气 ==========
async function getWeather(city) {
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`;
  const res = await fetch(url);
  const data = await res.json();

  const current = data.current_condition[0];
  const forecast = data.weather[0]; // today

  return {
    city: data.nearest_area[0].areaName[0].value,
    temp: current.temp_C,
    feelLike: current.FeelsLikeC,
    weather: current.weatherDesc[0].value,
    humidity: current.humidity,
    windSpeed: current.windspeedKmph,
    uvIndex: current.uvIndex,
    sunrise: astronomy ? astronomy[0].sunrise : '未知',
    sunset: astronomy ? astronomy[0].sunset : '未知',
    maxTemp: forecast ? forecast.maxtempC : current.temp_C,
    minTemp: forecast ? forecast.mintempC : current.temp_C,
    astronomy: data.weather[0].astronomy || [{ sunrise: '--', sunset: '--' }]
  };
}

// ========== 生成推送内容 ==========
function buildMessage(weather, quoteIndex, msgIndex) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const dayOfWeek = weekdays[today.getDay()];

  const uv = getUVIndex(weather.uvIndex);
  const clothing = getClothingSuggestion(weather.temp, weather.weather);
  const wind = getWindSuggestion(weather.windSpeed);

  const quote = loveQuotes[quoteIndex % loveQuotes.length];
  const message = dailyMessages[msgIndex % dailyMessages.length];

  const sunrise = weather.astronomy ? weather.astronomy[0].sunrise : '--';
  const sunset = weather.astronomy ? weather.astronomy[0].sunset : '--';

  return `
<div style="font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #fce4ec, #fff0f5); border-radius: 20px; padding: 30px; box-shadow: 0 8px 32px rgba(233,30,99,0.1);">

  <div style="text-align: center; margin-bottom: 20px;">
    <div style="font-size: 48px; margin-bottom: 8px;">💕</div>
    <div style="font-size: 24px; font-weight: bold; color: #e91e63;">早安，${HER_NAME}</div>
    <div style="font-size: 14px; color: #999; margin-top: 4px;">${dateStr} 星期${dayOfWeek}</div>
  </div>

  <div style="background: rgba(255,255,255,0.85); border-radius: 14px; padding: 18px; margin-bottom: 14px;">
    <div style="font-size: 14px; font-weight: bold; color: #e91e63; margin-bottom: 8px;">🌤 今日天气</div>
    <table style="width: 100%; font-size: 13px; color: #333;">
      <tr>
        <td style="padding: 4px 8px;">📍 ${weather.city}</td>
        <td style="padding: 4px 8px;">🌡 ${weather.temp}°C (${weather.minTemp}~${weather.maxTemp}°C)</td>
      </tr>
      <tr>
        <td style="padding: 4px 8px;">☁ ${weather.weather}</td>
        <td style="padding: 4px 8px;">💧 ${weather.humidity}%</td>
      </tr>
      <tr>
        <td style="padding: 4px 8px;">🌅 日出 ${sunrise}</td>
        <td style="padding: 4px 8px;">🌇 日落 ${sunset}</td>
      </tr>
    </table>
  </div>

  <div style="background: rgba(255,255,255,0.85); border-radius: 14px; padding: 18px; margin-bottom: 14px;">
    <div style="font-size: 14px; font-weight: bold; color: #e91e63; margin-bottom: 8px;">👗 穿衣推荐</div>
    <div style="font-size: 13px; color: #555; line-height: 1.6;">${clothing}</div>
  </div>

  <div style="background: rgba(255,255,255,0.85); border-radius: 14px; padding: 18px; margin-bottom: 14px;">
    <div style="font-size: 14px; font-weight: bold; color: #e91e63; margin-bottom: 8px;">☀️ 防晒提醒</div>
    <div style="font-size: 13px; color: #555; line-height: 1.6;">紫外线强度：${uv.level}</div>
    <div style="font-size: 13px; color: #555; line-height: 1.6;">${uv.tip}</div>
    ${wind ? `<div style="font-size: 13px; color: #555; margin-top: 4px;">${wind}</div>` : ''}
  </div>

  <div style="background: rgba(255,255,255,0.85); border-radius: 14px; padding: 18px; margin-bottom: 14px;">
    <div style="font-size: 14px; font-weight: bold; color: #e91e63; margin-bottom: 8px;">💌 想对你说</div>
    <div style="font-size: 15px; color: #333; line-height: 1.8; text-align: center; padding: 8px 0;">
      ${message}
    </div>
  </div>

  <div style="background: rgba(255,255,255,0.85); border-radius: 14px; padding: 18px;">
    <div style="font-size: 14px; font-weight: bold; color: #e91e63; margin-bottom: 8px;">📖 今日语录</div>
    <div style="font-size: 14px; color: #666; line-height: 1.8; text-align: center; font-style: italic; padding: 8px 0;">
      「${quote}」
    </div>
  </div>

</div>`;
}

// ========== 推送到微信 ==========
async function pushToWechat(title, content) {
  const res = await fetch('https://www.pushplus.plus/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: TOKEN,
      title: title,
      content: content,
      template: 'html'
    })
  });
  return res.json();
}

// ========== 主函数 ==========
async function main() {
  if (!TOKEN) {
    console.error('❌ 错误：未设置 PUSHPLUS_TOKEN');
    console.error('请在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加');
    process.exit(1);
  }

  try {
    console.log('🌤 正在获取天气...');
    const weather = await getWeather(CITY);

    // 按日期轮换情话和消息（每天不同）
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const quoteIndex = dayOfYear % loveQuotes.length;
    const msgIndex = dayOfYear % dailyMessages.length;

    console.log(`📍 ${weather.city} | 🌡 ${weather.temp}°C | ☁ ${weather.weather}`);

    const content = buildMessage(weather, quoteIndex, msgIndex);
    const title = `💕 早安，${HER_NAME}`;

    console.log('📤 正在推送...');
    const result = await pushToWechat(title, content);

    if (result.code === 200) {
      console.log('✅ 推送成功！');
    } else {
      console.error('❌ 推送失败:', JSON.stringify(result));
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ 出错:', err.message);
    process.exit(1);
  }
}

main();
