const fs = require('fs');
const path = require('path');

const emailsDir = path.join(__dirname, '../src/emails');
const files = fs.readdirSync(emailsDir).filter(f => f.endsWith('.ts') && f !== 'founding-explorer-invite-template.ts');

files.forEach(file => {
  const filePath = path.join(emailsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Rename .container to .email-container
  content = content.replace(/\.container/g, '.email-container');
  content = content.replace(/class="container"/g, 'class="email-container"');

  // Modify .footer block
  content = content.replace(/\.footer\s*\{[^}]+\}/g, (match) => {
    let newBlock = match;
    newBlock = newBlock.replace(/border-top:\s*1px solid #[A-Fa-f0-9]+;?\s*/g, '');
    newBlock = newBlock.replace(/margin-top:\s*\d+px;?\s*/g, '');
    newBlock = newBlock.replace(/padding-top:\s*\d+px;?\s*/g, 'padding-top: 40px;\n          ');
    if (!newBlock.includes('padding-top: 40px;')) {
        newBlock = newBlock.replace(/{/, '{\n          padding-top: 40px;');
    }
    return newBlock;
  });
  
  // modify media query footer padding
  content = content.replace(/\.footer\s*\{\s*margin-top:\s*\d+px;\s*padding-top:\s*\d+px;\s*\}/g, '.footer {\n            padding-top: 40px;\n          }');

  fs.writeFileSync(filePath, content);
  console.log('Updated', file);
});
