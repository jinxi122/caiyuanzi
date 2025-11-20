// Backup of JavaScript/galgame.js — created before migration
// Original content saved for rollback

// Galgame游戏逻辑
let currentChapter = 1;
let currentScene = 0;
let currentSentence = 0;
let affection = 0;
let sentences = [];

// 角色图片映射
const characterImages = {
    "白菜精灵 🥬": "img/byqie.png",
    "胡萝卜战士 🥕": "img/fengshu.png",
    "系统": "img/caoguoxszl.png"
};

// 从 galgamewa.js 中读取 storyData（已由 galgamewa.js 在全局暴露为 window.storyData）
const story = window.storyData || {};

function startGame() {
    currentChapter = 1;
    currentScene = 0;
    currentSentence = 0;
    affection = 0;
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
    const scene = story[currentChapter][currentScene];
    
    // 更新角色名称和图片
    document.getElementById('character-name').textContent = scene.character;
    
    // 显示角色图片
    const characterImg = document.getElementById('character-img');
    if (scene.image && scene.image !== '') {
        characterImg.src = scene.image;
        characterImg.style.display = 'block';
        characterImg.classList.add('character-fade');
    } else {
        characterImg.style.display = 'none';
    }
    
    // 设置句子数组
    sentences = scene.sentences;
    currentSentence = 0;
    
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
        if (currentSentence < sentences.length - 1) {
            showContinueButton();
        } else {
            showChoices();
        }
    }
}

function nextSentence() {
    if (currentSentence < sentences.length - 1) {
        currentSentence++;
        showSentence();
    } else {
        // 显示选择按钮
        showChoices();
    }
}

function showChoices() {
    const scene = story[currentChapter][currentScene];
    let choicesHTML = '';
    scene.choices.forEach((choice, index) => {
        choicesHTML += `<button class="choice-btn" onclick="makeChoice(${index})">${choice.text}</button>`;
    });
    document.getElementById('choice-buttons').innerHTML = choicesHTML;
    hideContinueButton();
}

function makeChoice(choiceIndex) {
    const choice = story[currentChapter][currentScene].choices[choiceIndex];
    affection += choice.affection;
    currentScene = choice.next;
    
    if (currentScene >= story[currentChapter].length) {
        // 章节结束，进入下一章
        currentChapter++;
        currentScene = 0;
        
        if (!story[currentChapter]) {
            // 游戏结束
            showEnding();
            return;
        }
    }
    
    loadScene();
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
    document.getElementById('choice-buttons').innerHTML = `
        <button class="choice-btn" onclick="startGame()">重新开始</button>
    `;
    document.getElementById('character-img').style.display = 'none';
    hideContinueButton();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    hideContinueButton();
});
