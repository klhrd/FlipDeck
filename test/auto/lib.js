// 共用工具：載入 FlipDeck 原始碼並抽取指定函式（各測試套件 require 使用）
const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', '..', 'js', 'script.js');
const serviceWorkerPath = path.join(__dirname, '..', '..', 'service-worker.js');

const readScript = () => fs.readFileSync(scriptPath, 'utf8');
const readServiceWorker = () => fs.readFileSync(serviceWorkerPath, 'utf8');

// 以括號平衡抽取整個函式原始碼（支援參數解構的簽名，如 appConfirm({ ... })）
function extractFn(src, name) {
    const idx = src.indexOf(`function ${name}(`);
    if (idx < 0) throw new Error(`function ${name} not found in source`);
    const sigEnd = src.indexOf(') {', idx);
    if (sigEnd < 0) throw new Error(`body brace not located for ${name}`);
    let i = sigEnd + 1, depth = 0;
    for (; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(idx, i + 1); }
    }
    throw new Error('unbalanced braces');
}

module.exports = { readScript, readServiceWorker, extractFn, scriptPath, serviceWorkerPath };
