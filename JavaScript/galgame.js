// Galgame游戏逻辑
let currentChapter = 1;
let currentScene = 0;
let currentSentence = 0;
let affection = 0;
let sentences = [];
let currentSceneData = null;
let musicEnabled = false; // 音乐控制变量
let bgMusic = null;
let bgMusicOriginalVolume = 1;
let sfxCount = 0;
let paragraphStarts = []; // 存放每个段落在拆分后句子数组中的起始索引
let playingSfx = {}; // 跟踪按路径的正在播放音效，防止重复叠加
// 全局音效开关（页面上可切换）
window.sfxEnabled = true;
// SFX 音量
window.sfxVolume = 0.85;
// 将原始背景音量同步到 window，供页面脚本访问
window.bgMusicOriginalVolume = bgMusicOriginalVolume;

function setBgOriginalVolume(v) {
    try {
        bgMusicOriginalVolume = v;
        window.bgMusicOriginalVolume = v;
    } catch (e) {}
}

// 角色图片映射
const characterImages = {
    "白菜精灵 🥬": "img/zhongqiutoxiangnv.png",
    "胡萝卜战士 🥕": "img/zhongqiutoxiangnan.png",
    "尘行": "img/luohuanan.png",
    "系统": "img/toxiang1 (11).png"
};

// 默认头像（回退）
const DEFAULT_AVATAR = 'img/toxiang1 (11).png';

// 从 galgamewa.js 中读取 storyData（已由 galgamewa.js 在全局暴露为 window.storyData）
const story = window.storyData || {};

// 音乐控制函数
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('music-toggle');
    
    if (musicEnabled) {
        music.pause();
        musicEnabled = false;
        toggleBtn.textContent = '🎵 音乐: 关';
        toggleBtn.style.background = '#666';
    } else {
        music.play().catch(e => {
            console.log('需要用户交互才能播放音乐，请先点击解锁音频按钮');
        });
        musicEnabled = true;
        toggleBtn.textContent = '🎵 音乐: 开';
        toggleBtn.style.background = '#d4af37';
    }
}

function startGame() {
    currentChapter = 1;
    currentScene = 0;
    currentSentence = 0;
    affection = 0;
    
    // 开始游戏时自动播放背景音乐（如果用户已允许）
    try {
        if (!bgMusic) bgMusic = document.getElementById('bgMusic');
        if (musicEnabled && bgMusic) {
            bgMusic.volume = 0.7;
            bgMusic.play().catch(() => {});
        }
    } catch (e) {
        console.warn('启动背景音乐失败', e);
    }
    
    loadScene();
}

function showInstructions() {
    document.getElementById('character-name').textContent = '游戏说明';
    document.getElementById('dialogue-text').innerHTML = `
        <strong>菜園子物語 - 游戏说明</strong><br><br>
        • 通过选择不同的选项来推进剧情<br>
        • 每个选择会影响角色的好感度<br>
        • 探索菜园的秘密，与蔬菜角色们建立友谊<br>
        • 多个结局等待你的发现！<br><br>
        <em>点击对话框或"继续"按钮显示下一句</em>
    `;
    document.getElementById('choice-buttons').innerHTML = `
        <button class="choice-btn" onclick="startGame()">开始游戏</button>
    `;
    document.getElementById('character-img').style.display = 'none';
    hideContinueButton();
}

function loadScene() {
    // 兼容两种文案来源：window.storyData（数组式）或 galgamewa.js 的 getGalgameText（对象式）
    let scene = null;
    try {
        if (window.storyData && window.storyData[currentChapter] && window.storyData[currentChapter][currentScene]) {
            scene = window.storyData[currentChapter][currentScene];
        } else if (typeof getGalgameText === 'function') {
            const g = getGalgameText(currentChapter, currentScene + 1);
            if (g) {
                scene = {
                    character: g.character || '',
                    image: g.image || '',
                    sentences: g.sentences || [],
                    choices: g.choices || []
                };
            }
        }
    } catch (e) {
        console.error('加载场景时出错：', e);
    }

    if (!scene) {
        scene = { character: '系统', image: '', sentences: ['（场景数据缺失）'], choices: [{ text: '返回', next: 0, affection: 0 }] };
    }

    // 更新角色名称和图片
    document.getElementById('character-name').textContent = scene.character;

    // 显示角色图片：优先使用场景 image，其次使用角色映射，再用默认头像回退
    const characterImg = document.getElementById('character-img');
    try {
        let avatarSrc = '';
        if (scene.image && scene.image !== '') avatarSrc = scene.image;
        else if (characterImages[scene.character]) avatarSrc = characterImages[scene.character];
        else avatarSrc = DEFAULT_AVATAR;

        if (avatarSrc) {
            const finalAvatar = (typeof window.getAsset === 'function') ? window.getAsset(avatarSrc) : avatarSrc;
            characterImg.src = finalAvatar;
            characterImg.style.display = 'block';
            characterImg.classList.add('character-fade');
        } else {
            characterImg.style.display = 'none';
        }
    } catch (e) {
        try { characterImg.style.display = 'none'; } catch (e) {}
    }

    // 设置句子数组
    // 将场景中的长段落按句子拆分为更小的显示单元，提升逐句显示体验
    function splitIntoSentences(text) {
        const parts = [];
        let buf = '';
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            buf += ch;
            if (ch === '。' || ch === '！' || ch === '？' || ch === '!' || ch === '?') {
                const t = buf.trim();
                if (t) parts.push(t);
                buf = '';
            }
        }
        if (buf.trim()) parts.push(buf.trim());
        return parts;
    }

    sentences = [];
    paragraphStarts = [];
    (scene.sentences || []).forEach(s => {
        // 记录当前段落的起始句索引
        paragraphStarts.push(sentences.length);
        const subs = splitIntoSentences(s + '');
        if (subs.length > 0) {
            subs.forEach(sub => sentences.push(sub));
        } else {
            sentences.push(String(s));
        }
    });
    currentSentence = 0;
    currentSceneData = scene;
    // 记录访问次数，防止无限循环
    try {
        if (!window._visitCount) window._visitCount = {};
        const key = `${currentChapter}-${currentScene}`;
        window._visitCount[key] = (window._visitCount[key] || 0) + 1;
    } catch (e) {}

    // 播放场景音效
    playSceneSoundEffect(scene);

    // 显示第一句
    showSentence();

    updateProgress();
}

function showSentence() {
    if (currentSentence < sentences.length) {
        const dialogueText = document.getElementById('dialogue-text');
        dialogueText.textContent = sentences[currentSentence];
        dialogueText.classList.add('text-fade');
        
        // 显示继续按钮（如果不是最后一句）
            // 一律显示继续按钮，最后一句需要用户点击继续才展示选择
            showContinueButton();
        // 如果这是某个段落的第一句，则触发一次段落音效（避免每句都触发）
        try {
            if (paragraphStarts.indexOf(currentSentence) !== -1) {
                const sfxKey = decideSfxForScene(currentSceneData);
                if (sfxKey) {
                    const sfxMap = {
                        'caodi': 'yinxiao/caodi.wav',
                        'feng': 'yinxiao/feng.wav',
                        'jzfw': 'yinxiao/jzfw.wav',
                        'niaojiao': 'yinxiao/niaojiao.wav'
                    };
                    if (sfxMap[sfxKey]) playSfx(sfxMap[sfxKey], 0.85, true);
                }
            }
        } catch (e) {
            console.warn('段落音效触发错误', e);
        }
    }
}

function nextSentence() {
    if (currentSentence < sentences.length - 1) {
        currentSentence++;
        showSentence();
    } else {
        // 最后一条由用户点击继续后再显示选择
        showChoices();
    }
}

function showChoices() {
    const scene = currentSceneData || (story[currentChapter] && story[currentChapter][currentScene]);
    let choicesHTML = '';
    const choices = (scene.choices || []);
    // 过滤掉不应出现的选项（例如交付古匣等），除非玩家已获得相关道具
    const filtered = (choices || []).filter(c => {
        try {
            const txt = (c.text || '').toString();
            // 如果选项含有交付/交出/交给关键词且玩家未持有古匣，则隐藏该选项
            if (/交付|交出|交给|交予|交匣|交还|交出古匣/.test(txt)) {
                if (!window.hasGuXia) return false;
            }
        } catch (e) {}
        return true;
    });

    if (filtered.length === 0) {
        // 如果场景没有定义选择，提供一个默认的继续按钮，推进到下一个场景或章节
        choicesHTML += `<button class="choice-btn" onclick="advanceScene()">继续</button>`;
    } else {
        filtered.forEach((choice, index) => {
            // 当过滤后索引映射到原 choices 时，需要找到原 index
            const origIndex = (choices || []).indexOf(choice);
            choicesHTML += `<button class="choice-btn" onclick="makeChoice(${origIndex})">${choice.text}</button>`;
        });
    }
    document.getElementById('choice-buttons').innerHTML = choicesHTML;
    hideContinueButton();
}

// 在没有显式选择时推进到下一个场景或章节的通用函数
function advanceScene() {
    // 默认推进到下一个索引
    let next = currentScene + 1;
    // 如果当前章节无数据，直接结束
    if (!story[currentChapter]) {
        showEnding();
        return;
    }
    // 若越界则进入下一章
    if (next >= story[currentChapter].length) {
        // 到达本章末尾，询问是否进入下一阶段
        const goNext = confirm('本章节已到结尾，是否进入下一阶段？(确定 = 进入下一阶段；取消 = 留在本章节)');
        if (goNext) {
            currentChapter++;
            next = 0;
            if (!story[currentChapter]) {
                showEnding();
                return;
            }
            currentScene = next;
            loadScene();
            return;
        } else {
            // 留在当前章的最后场景（保持 currentScene 不变），重新加载以刷新界面
            loadScene();
            return;
        }
    }
    currentScene = next;
    loadScene();
}

function makeChoice(choiceIndex) {
    const sceneObj = currentSceneData || (story[currentChapter] && story[currentChapter][currentScene]);
    const choice = sceneObj && sceneObj.choices && sceneObj.choices[choiceIndex];
    if (!choice) return;
    affection += choice.affection || 0;
    // 处理 next 的有效性：若未定义或非数字则视为推进到下一个场景
    let next = typeof choice.next === 'number' ? choice.next : (currentScene + 1);
    // 如果 next 为负数或 NaN，则恢复为下一个索引
    if (!isFinite(next)) next = currentScene + 1;

    // 播放选择音效
    playSfx('yinxiao/jzfw.wav', 0.85, true);

    // 如果 next === -1 或者 choice 标记为 ending，则直接进入结局
    if (next === -1 || choice.ending === true) {
        showEnding();
        return;
    }

    // 如果指定的 next 超出当前章范围，则进入下一章（保持原有逻辑，但更稳健）
    if (!story[currentChapter] || next >= story[currentChapter].length) {
        currentChapter++;
        currentScene = 0;
        if (!story[currentChapter]) {
            showEnding();
            return;
        }
    } else {
        currentScene = next;
    }
    // 如果同一场景被多次访问并且出现循环，尝试强制推进以避免卡死
    try {
        const key = `${currentChapter}-${currentScene}`;
        const cnt = (window._visitCount && window._visitCount[key]) || 0;
        if (cnt >= 4) {
            // 强制推进
            if (currentScene + 1 < (story[currentChapter] || []).length) {
                currentScene = currentScene + 1;
            } else {
                currentChapter++;
                currentScene = 0;
            }
        }
    } catch (e) {}
    loadScene();
}

// 决定某个场景应当触发哪个段落音效，由简单规则决定（你可以继续调整这些规则）
function decideSfxForScene(scene) {
    if (!scene) return null;
    const name = (scene.character || '').toString();
    const text = (scene.sentences || []).join(' ');

    // 优先考虑场景中显式关键词
    if (/战|决断|守护/.test(name) || /战斗|刀光|迎战/.test(text)) return 'jzfw';
    if (/鸟|鸟叫|晨曦|清晨/.test(text) || /鸟/.test(name)) return 'niaojiao';
    if (/风|风声|风铃/.test(text) || /风/.test(name)) return 'feng';
    // 识别特定角色关键词
    if (/白菜|精灵/.test(name)) return 'niaojiao';
    if (/尘行|路人|庇护者|行|踏|步|走|路/.test(name) || /走|行|踏|步|路/.test(text)) return 'caodi';

    return null;
}

// 初始化音频元素（在 DOMContentLoaded 调用）
function initAudio() {
    try {
        bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.volume = window.bgMusicOriginalVolume || 0.7;
            bgMusicOriginalVolume = bgMusic.volume;
            window.bgMusicOriginalVolume = bgMusicOriginalVolume;
        }
    } catch (e) {
        console.warn('initAudio error', e);
    }
}

// 播放音效并在需要时临时压低背景音乐音量（ducking）
function playSfx(path, volume = 1, duck = true) {
    try {
        // 全局音效开关检查
        if (window.sfxEnabled === false) return null;
        // 防止同一路径的音效被重复触发导致叠加
        if (playingSfx[path]) {
            // 如果该音效已经在播放，则忽略新的触发
            return playingSfx[path];
        }
        const audio = new Audio(path);
        // 记录基准音量因子，便于后续通过滑条调整正在播放的音效
        audio._baseVolume = typeof volume === 'number' ? volume : 1;
        // 考虑全局 sfxVolume
        const sVol = (typeof window.sfxVolume === 'number') ? window.sfxVolume : 0.85;
        audio.volume = Math.max(0, Math.min(1, audio._baseVolume * sVol));
        if (duck && bgMusic && !bgMusic.paused) {
            if (sfxCount === 0) {
                bgMusicOriginalVolume = bgMusic.volume || 0.7;
                window.bgMusicOriginalVolume = bgMusicOriginalVolume;
            }
            sfxCount++;
            bgMusic.volume = Math.max(0.05, bgMusicOriginalVolume * 0.25);
            audio.addEventListener('ended', () => {
                sfxCount = Math.max(0, sfxCount - 1);
                if (sfxCount === 0 && bgMusic) bgMusic.volume = bgMusicOriginalVolume;
            });
        }
        // 将正在播放的实例记录下来，ended 时清理
        // 将正在播放的实例记录到全局（页面脚本可访问）
        playingSfx[path] = audio;
        try { window.playingSfx = playingSfx; } catch (e) {}
        audio.addEventListener('ended', () => {
            try { delete playingSfx[path]; } catch (e) {}
        });
        audio.play().catch(e => console.warn('sfx play error', e));
        return audio;
    } catch (e) {
        console.error('playSfx error', e);
    }
}

// 简单的音效名称映射
function playSoundEffect(name) {
    const map = {
        'woosh': 'yinxiao/feng.wav',
        'footstep': 'yinxiao/caodi.wav',
        'suspense': 'yinxiao/jzfw.wav',
        'birds': 'yinxiao/niaojiao.wav'
    };
    const file = map[name];
    if (file) playSfx(file, 0.9, true);
}

// 根据场景角色或图像触发特定音效
function playSceneSoundEffect(scene) {
    if (!scene) return;
    // 统一使用 decideSfxForScene 的规则来决定场景音效，保证一致性并覆盖更多场景
    const key = decideSfxForScene(scene);
    const sfxMap = {
        'caodi': 'yinxiao/caodi.wav',
        'feng': 'yinxiao/feng.wav',
        'jzfw': 'yinxiao/jzfw.wav',
        'niaojiao': 'yinxiao/niaojiao.wav'
    };
    if (key && sfxMap[key]) {
        playSfx(sfxMap[key], 0.9, true);
    }
}

function showContinueButton() {
    document.getElementById('continue-btn').classList.add('visible');
}

function hideContinueButton() {
    document.getElementById('continue-btn').classList.remove('visible');
}

function updateProgress() {
    document.getElementById('chapter').textContent = currentChapter;
    document.getElementById('affection').textContent = affection;
    document.getElementById('scene').textContent = currentScene + 1;
    // 更新调试面板（如果存在）
    try {
        const dbg = document.getElementById('debug-panel');
        if (dbg) {
            dbg.innerText = `章:${currentChapter} 场:${currentScene} 句:${currentSentence}/${sentences.length} 好感:${affection}`;
            // 列出当前场景选择信息
            const scene = currentSceneData || (story[currentChapter] && story[currentChapter][currentScene]);
            if (scene) {
                const choices = scene.choices || [];
                const info = '\nchoices: ' + choices.map((c,i)=>`[${i}] ${c.text} -> ${c.next}`).join('; ');
                dbg.innerText += info;
            }
        }
    } catch (e) {}
}

function showEnding() {
    let endingText = '';
    if (affection >= 20) {
        endingText = '恭喜！你与蔬菜们建立了深厚的友谊，成为了菜园的荣誉守护者！';
    } else if (affection >= 10) {
        endingText = '你与蔬菜们度过了愉快的时光，菜园的大门将永远为你敞开！';
    } else {
        endingText = '虽然相处时间不长，但蔬菜们会记得你这个特别的访客。';
    }
    
    document.getElementById('character-name').textContent = '结局';
    document.getElementById('dialogue-text').textContent = endingText;
    
    // 游戏结束时停止音乐
    if (musicEnabled) {
        try {
            const musicEl = bgMusic || document.getElementById('bgMusic');
            if (musicEl) {
                musicEl.pause();
                musicEl.currentTime = 0;
            }
        } catch (e) {}
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    hideContinueButton();
    try { initAudio(); } catch (e) {}
    try { if (typeof autoFixStory === 'function') autoFixStory(); } catch (e) {}
});

// 浏览器内可调用的检查函数：扫描 window.storyData 中所有 choice.next，报告明显问题
function checkStoryIntegrity() {
    const report = [];
    const storyObj = window.storyData || {};
    for (const chapKey of Object.keys(storyObj)) {
        const chap = storyObj[chapKey];
        if (!Array.isArray(chap)) continue;
        for (let i = 0; i < chap.length; i++) {
            const scene = chap[i] || {};
            const choices = scene.choices || [];
            for (let j = 0; j < choices.length; j++) {
                const choice = choices[j] || {};
                const next = choice.next;
                if (typeof next !== 'number') continue;
                if (next === -1) continue;
                if (next < 0) report.push({ chapter: chapKey, scene: i, choiceIndex: j, issue: 'negative next', next });
                if (next >= chap.length) report.push({ chapter: chapKey, scene: i, choiceIndex: j, issue: 'next out of current chapter range', next, chapterLength: chap.length });
            }
        }
    }
    if (report.length === 0) {
        console.log('checkStoryIntegrity: 未发现明显问题。');
    } else {
        console.warn('checkStoryIntegrity 报告：', report);
    }
    return report;
}

// 自动修复简单的文案索引问题：将超出范围的 next 调整为本章末尾（以便进入下一章），
// 将非法负数（非 -1）修正为 0。此函数会修改 window.storyData 原地数据。
function autoFixStory() {
    try {
        const storyObj = window.storyData || {};
        for (const chapKey of Object.keys(storyObj)) {
            const chap = storyObj[chapKey];
            if (!Array.isArray(chap)) continue;
            for (let i = 0; i < chap.length; i++) {
                const scene = chap[i] || {};
                const choices = scene.choices || [];
                for (let j = 0; j < choices.length; j++) {
                    const choice = choices[j] || {};
                    if (typeof choice.next !== 'number') continue;
                    if (choice.next === -1) continue;
                    if (!isFinite(choice.next)) {
                        choice.next = i + 1 < chap.length ? i + 1 : chap.length;
                    }
                    if (choice.next < 0) {
                        choice.next = 0;
                    }
                    if (choice.next >= chap.length) {
                        // 设置为 chap.length，使现有逻辑将跳转到下一章的第0场
                        choice.next = chap.length;
                    }
                }
            }
        }
        console.log('autoFixStory: 已对 window.storyData 执行自动修复。');
    } catch (e) {
        console.warn('autoFixStory 失败', e);
    }
}