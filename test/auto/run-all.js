// 執行全部測試套件（每套獨立子程序，互相不污染 eval 作用域）
const { spawnSync } = require('child_process');
const path = require('path');

const suites = [
    'sw.test.js',       // Service Worker 快取策略（network-first、快取清理、離線 fallback）
    'session.test.js',  // session 同步 / 進度計算 / escapeAttr
    'learning.test.js', // 判定流程 / undo / appConfirm 對話框
    'queue.test.js',    // 防回鍋佇列 / 標籤篩選 / 編輯器序列化
    'backup.test.js',   // 備份匯入還原（合併語意）
    'tags.test.js',     // 批次標籤運算 / 跳轉卡片
    'sm2.test.js',      // SM-2 間隔重複演算法 / 遷移 / 到期制排程
    'limits.test.js',   // 每日新卡上限 / leech / 30 天到期預測
    'i18n.test.js',     // zh/en 鍵對稱 / 佔位符一致 / t() 行為
    'share.test.js',    // 分享編解碼 round-trip / 壓縮 / 損毀防護
    'smoke.test.js',    // jsdom 冒煙：完整啟動 + 選單互動 + 顯示模式 + 語言切換
    'numbers.test.js',  // 數字回歸：SM-2 / 進度 / 到期 / 統計視窗全數核對
    'paste.test.js'     // 貼上匯入：分流 + Markdown 救援接合（真實亂序資料）
];

let failed = 0;
for (const f of suites) {
    const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8' });
    const ok = r.status === 0;
    console.log((ok ? 'PASS ' : 'FAIL ') + f);
    if (!ok) {
        failed++;
        console.log((r.stdout || '') + (r.stderr || ''));
    }
}
console.log(`\n${suites.length - failed}/${suites.length} suites passed`);
process.exit(failed === 0 ? 0 : 1);
