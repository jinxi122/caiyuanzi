const fs = require('fs');
const vm = require('vm');
const path = require('path');

const file = path.join(__dirname, '..', 'JavaScript', 'galgamewa.js');
const code = fs.readFileSync(file, 'utf8');

const sandbox = { window: {} };
try {
    vm.runInNewContext(code, sandbox, { filename: file });
} catch (e) {
    console.error('执行 galgamewa.js 时出错:', e.message);
    process.exit(2);
}
const story = sandbox.window.storyData;
if (!story) {
    console.error('未在 galgamewa.js 中找到 window.storyData');
    process.exit(2);
}

function analyze(story) {
    const report = [];
    for (const chapKey of Object.keys(story)) {
        const chap = story[chapKey];
        if (!Array.isArray(chap)) continue;
        for (let i = 0; i < chap.length; i++) {
            const scene = chap[i];
            const choices = scene.choices || [];
            for (let j = 0; j < choices.length; j++) {
                const choice = choices[j];
                const next = choice.next;
                if (typeof next !== 'number') continue;
                if (next === -1) continue; // explicit ending
                if (next < 0) {
                    report.push({ chapter: chapKey, sceneIndex: i, choiceIndex: j, issue: 'negative next', next });
                    continue;
                }
                if (next >= chap.length) {
                    // next points beyond current chapter length -> may mean next chapter or error
                    report.push({ chapter: chapKey, sceneIndex: i, choiceIndex: j, issue: 'next out of current chapter range', next, chapterLength: chap.length });
                }
            }
        }
    }
    return report;
}

const r = analyze(story);
if (r.length === 0) {
    console.log('检查完成：未发现明显越界的 next 索引（注意：跨章跳转未视为错误）。');
    process.exit(0);
}
console.log('检查报告：');
for (const item of r) {
    console.log(JSON.stringify(item));
}
process.exit(0);
