// 共用工具：載入 FlipDeck 原始碼並抽取指定函式（各測試套件 require 使用）
const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', '..', 'js', 'script.js');
const serviceWorkerPath = path.join(__dirname, '..', '..', 'service-worker.js');

const readScript = () => fs.readFileSync(scriptPath, 'utf8');
const readServiceWorker = () => fs.readFileSync(serviceWorkerPath, 'utf8');

// 以括號平衡抽取整個函式原始碼（支援參數解構的簽名，如 appConfirm({ ... })）
function extractFn(src, name) {
    // 支援 async function（從關鍵字起切，保留 async）
    let idx = src.indexOf(`async function ${name}(`);
    if (idx < 0) idx = src.indexOf(`function ${name}(`);
    if (idx < 0) throw new Error(`function ${name} not found in source`);
    const sigEnd = src.indexOf(') {', idx);
    if (sigEnd < 0) throw new Error(`body brace not located for ${name}`);
    let i = sigEnd + 1, depth = 0;
    const isRegexContext = () => {
        for (let j = i - 1; j >= idx; j--) {
            const c = src[j];
            if (/\s/.test(c)) continue;
            return '(,=:[!&|>?;{+*%~-'.includes(c);
        }
        return true;
    };
    while (i < src.length) {
        const ch = src[i];
        // 跳過字串與模板字面值（v5.6.0：'{' 等字元不再干擾括號計數）
        if (ch === "'" || ch === '"') {
            const q = ch; i++;
            while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
            i++; continue;
        }
        if (ch === '`') {
            i++;
            while (i < src.length && src[i] !== '`') {
                if (src[i] === '\\') { i += 2; continue; }
                if (src[i] === '$' && src[i + 1] === '{') { // ${…} 內部是程式碼——遞迴計數
                    i += 2; let d2 = 1;
                    while (i < src.length && d2 > 0) {
                        const c2 = src[i];
                        if (c2 === "'" || c2 === '"') { const q2 = c2; i++; while (i < src.length && src[i] !== q2) { if (src[i] === '\\') i++; i++; } i++; continue; }
                        if (c2 === '{') d2++;
                        else if (c2 === '}') d2--;
                        i++;
                    }
                    continue;
                }
                i++;
            }
            i++; continue;
        }
        // 跳過註解與正規表示式字面值（前一個非空白字元屬運算/括號語境時視為 regex）
        if (ch === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
        if (ch === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
        if (ch === '/' && isRegexContext()) {
            i++; let inClass = false;
            while (i < src.length) {
                const rc = src[i];
                if (rc === '\\') { i += 2; continue; }
                if (rc === '[') inClass = true;
                else if (rc === ']') inClass = false;
                else if (rc === '/' && !inClass) break;
                i++;
            }
            i++; continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) return src.slice(idx, i + 1); }
        i++;
    }
    throw new Error('unbalanced braces');
}

module.exports = { readScript, readServiceWorker, extractFn, scriptPath, serviceWorkerPath };
