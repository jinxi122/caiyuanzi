// Backup of JavaScript/galgamewa.js — created before migration
// Original content saved for rollback

// Galgame文案数据
const galgameTexts = {
    // 章节1文案
    chapter1: {
        scene1: {
            character: "系统",
            sentences: [
                "你来到了一个神秘的菜园，这里种植着各种有生命的蔬菜。",
                "空气中弥漫着清新的泥土气息和蔬菜的芳香。",
                "突然，一个可爱的白菜精灵出现在你面前..."
            ],
            choices: [
                { text: "打招呼", next: 1, affection: 5 },
                { text: "静静观察", next: 2, affection: 2 }
            ]
        },
        scene2: {
            character: "白菜精灵 🥬",
            sentences: [
                "你好呀！我是这个菜园的守护者白菜精灵。",
                "你看起来是个有趣的人类呢！",
                "很少有外人会来到这个神秘的菜园..."
            ],
            choices: [
                { text: "询问菜园的秘密", next: 3, affection: 3 },
                { text: "询问白菜精灵的来历", next: 4, affection: 4 }
            ]
        },
        scene3: {
            character: "白菜精灵 🥬",
            sentences: [
                "（害羞地躲在一片大叶子后面）",
                "你...你在看什么呀？",
                "我脸上有什么东西吗？"
            ],
            choices: [
                { text: "称赞她很可爱", next: 5, affection: 8 },
                { text: "询问菜园的情况", next: 6, affection: 3 }
            ]
        }
    },
    
    // 章节2文案
    chapter2: {
        scene1: {
            character: "胡萝卜战士 🥕",
            sentences: [
                "站住！陌生人！",
                "我是菜园的守卫胡萝卜战士。",
                "说明你的来意！"
            ],
            choices: [
                { text: "表明友好意图", next: 1, affection: 4 },
                { text: "展示自己的实力", next: 2, affection: 2 }
            ]
        }
    },
    
    // 结局文案
    endings: {
        best: "恭喜！你与蔬菜们建立了深厚的友谊，成为了菜园的荣誉守护者！",
        good: "你与蔬菜们度过了愉快的时光，菜园的大门将永远为你敞开！",
        normal: "虽然相处时间不长，但蔬菜们会记得你这个特别的访客。"
    },
    
    // 游戏说明文案
    instructions: {
        title: "菜園子物語 - 游戏说明",
        content: [
            "• 通过选择不同的选项来推进剧情",
            "• 每个选择会影响角色的好感度", 
            "• 探索菜园的秘密，与蔬菜角色们建立友谊",
            "• 多个结局等待你的发现！"
        ],
        tip: "点击对话框或\"继续\"按钮显示下一句"
    },
    
    // 角色介绍文案
    characters: {
        "白菜精灵 🥬": {
            description: "菜园的守护者，性格活泼可爱，喜欢与人交流",
            personality: "天真烂漫，对新鲜事物充满好奇"
        },
        "胡萝卜战士 🥕": {
            description: "菜园的守卫，性格严肃认真，保护菜园安全",
            personality: "责任心强，对陌生人保持警惕"
        }
    }
};

// 获取文案的函数
function getGalgameText(chapter, scene) {
    return galgameTexts[`chapter${chapter}`]?.[`scene${scene}`];
}

function getEndingText(type) {
    return galgameTexts.endings[type] || galgameTexts.endings.normal;
}

function getInstructions() {
    return galgameTexts.instructions;
}

function getCharacterInfo(character) {
    return galgameTexts.characters[character];
}

/* 为兼容现有游戏逻辑，导出 storyData（与原来 galgame.js 中的 `story` 结构一致）
   这样 `galgame.js` 可以直接使用 `window.storyData` 来读取场景数组。 */
window.storyData = {
    1: [ /* ... original scenes ... */ ],
    2: [ /* ... */ ]
};
