const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/rbach/Downloads/roofingplams';

const FOLDERS = [
  { folder: '', prefix: '' },
  { folder: 'services', prefix: 'services' },
  { folder: 'roof-types', prefix: 'roof-types' },
  { folder: 'locations', prefix: 'locations' },
  { folder: 'blog', prefix: 'blog' },
];

const SKIP = ['404.html'];

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].replace(/\s*[\|\-–]\s*Roofing Palm.*$/i,'').trim() : 'Untitled';
}

function extractContent(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let c = body ? body[1] : html;
  c = c.replace(/<header[\s\S]*?<\/header>/gi,'');
  c = c.replace(/<footer[\s\S]*?<\/footer>/gi,'');
  c = c.replace(/<script[\s\S]*?<\/script>/gi,'');
  return c.trim();
}

const pages = [];
for (const {folder, prefix} of FOLDERS) {
  const d = path.join(dir, folder);
  if (!fs.existsSync(d)) continue;
  const files = fs.readdirSync(d).filter(f => f.endsWith('.html') && !SKIP.includes(f));
  for (const file of files) {
    const html = fs.readFileSync(path.join(d,file),'utf8');
    const name = file.replace('.html','');
    const slug = name === 'index' ? (prefix || 'home') : name;
    pages.push({ title: extractTitle(html), content: extractContent(html), slug, folder: prefix });
  }
}

fs.writeFileSync(path.join(dir,'pages-data.json'), JSON.stringify(pages));
console.log('Generated pages-data.json with', pages.length, 'pages');
pages.forEach(p => console.log(' -', p.folder ? p.folder+'/'+p.slug : p.slug));
