const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, 'photos');
const files = fs.readdirSync(photosDir).filter(f => f.match(/\.jpg$/i));

async function compress() {
  for (const file of files) {
    const input = path.join(photosDir, file);
    const before = fs.statSync(input).size;
    
    await sharp(input)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(input + '.tmp');
    
    fs.renameSync(input + '.tmp', input);
    const after = fs.statSync(input).size;
    
    console.log(`${file}: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB (${Math.round((1-after/before)*100)}% 压缩)`);
  }
  console.log('\n✅ 全部压缩完成！');
}

compress().catch(console.error);
