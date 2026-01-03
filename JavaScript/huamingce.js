// 花名册功能脚本
document.addEventListener('DOMContentLoaded', function() {
    // 成员数据
    const members = [
        {
            id: 1,
            name: "不可爱小鬼",
            title: "社主",
            description: "菜園子🥬的创始人，",
            avatar: "img/zhongqiutoxiangnv.png",
            rank: "社主",
            tags: ["管理", "开发", "策划"]
        },
        {
            id: 2,
            name: "重西",
            title: "副园主",
            description: "负责团队管理和活动策划，新手导师，负责帮助新成员快速融入团队",
            avatar: "img/zhangguonv.png",
            rank: "副社长",
            tags: ["管理", "副园主", ""]
        },
        {
            id: 3,
            name: "裸睡穿皮鞋",
            title: "长老",
            description: "新手导师，负责帮助新成员快速融入团队",
            avatar: "img/zhangguonv.png",
            rank: "长老",
            tags: ["设计", "管理"]
        },
        {
            id: 4,
            name: "达达",
            title: "指挥",
            description: "指挥总管",
            avatar: "img/zhanlingnv.png",
            rank: "长老",
            tags: ["管理", "指挥"]
        },
        {
            id: 5,
            name: "寒星隅",
            title: "恶猫",
            description: "新手导师，负责帮助新成员快速融入团队",
            avatar: "img/zhangguonv.png",
            rank: "长老",
            tags: ["管理", "恶猫"]
        },
        {
            id: 6,
            name: "姚雄",
            title: "牛",
            description: "新手导师，负责帮助新成员快速融入团队",
            avatar: "img/yyslscstx.png",
            rank: "长老",
            tags: ["管理", "反馈", "牛"]
        },
        {
            id: 7,
            name: "赢荡",
            title: "稿子王",
            description: "新手导师，负责帮助新成员快速融入团队",
            avatar: "img/toxiang1 (6).png",
            rank: "长老",
            tags: ["管理", "活动"]
        },
        {
            id: 8,
            name: "陈州张宁姚",
            title: "彪哥",
            description: "新手导师，负责帮助新成员快速融入团队",
            avatar: "img/foyuzi.png",
            rank: "长老",
            tags: ["内容", "管理"]
        },
        {
            id: 9,
            name: "曹国雄",
            title: "熊",
            description: "不懂哦，躺平就是了",
            avatar: "img/sanye.png",
            rank: "社众",
            tags: ["萌新", "需要帮助", "熊"]
        },
        {
            id: 10,
            name: "空位",
            title: "空位",
            description: "空位",
            avatar: "",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 11,
            name: "释溪",
            title: "学徒",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (1).png",
            rank: "学徒",
            tags: ["学徒"]
        },
        {
            id: 12,
            name: "星月雨桐",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (8).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 13,
            name: "吾道听风",
            title: "社众",
            description: "魔丸降世！！！",
            avatar: "img/toxiang1 (9).png",
            rank: "社众",
            tags: ["社众", ,"魔丸"]
        },
        {
            id:35,
            name: "宸煜狸",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/zhangguonan.png",
            rank: "社众",
            tags: ["社众"]
        },        
        {
            id: 14,
            name: "木木栗",
            title: "学徒",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (2).png",
            rank: "学徒",
            tags: ["学徒"]
        },
        {
            id: 15,
            name: "灵无妄",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (10).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 16,
            name: "坐忘道天宇",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (3).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 17,
            name: "织雪绛绛",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (11).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 18,
            name: "张璇陵",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (12).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 19,
            name: "半城煙夢",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (13).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 20,
            name: "清茶盏酒",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (14).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 21,
            name: "锝鹿梦鱼",
            title: "学徒",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (5).png",
            rank: "学徒",
            tags: ["学徒"]
        },
        {
            id: 22,
            name: "陵婉菁",
            title: "学徒",
            description: "暂时不知道写什么",
            avatar: "img/luohua.png",
            rank: "学徒",
            tags: ["学徒"]
        },
        {
            id: 23,
            name: "杨拒秋",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/luohuanan.png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 24,
            name: "百里慕凝",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (15).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 25,
            name: "奚泽潇",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (17).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 26,
            name: "曲中人未还",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (16).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 27,
            name: "别惹小林",
            title: "学徒",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (4).png",
            rank: "学徒",
            tags: ["学徒"]
        },
        {
            id: 28,
            name: "木酒",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (18).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 29,
            name: "塔塔开走",
            title: "学徒",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (19).png",
            rank: "学徒",
            tags: ["学徒"]
        },
        {
            id: 30,
            name: "雲風起",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (20).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 31,
            name: "风笛之思",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (21).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 32,
            name: "听雨天",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (22).png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 33,
            name: "李双瑜",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/zhangguonv.png",
            rank: "社众",
            tags: ["社众"]
        },
        {
            id: 34,
            name: "祈隆忆",
            title: "社众",
            description: "暂时不知道写什么",
            avatar: "img/toxiang1 (23).png",
            rank: "社众",
            tags: ["社众"]
        }
    ];
    
    // 获取DOM元素
    const membersGrid = document.getElementById('members-grid');
    const searchInput = document.getElementById('member-search');
    const noResults = document.getElementById('no-results');
    
    // 当前筛选条件
    let currentFilter = 'all';
    
    // 创建成员卡片
    function createMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'member-card fade-in-up';
        card.dataset.rank = member.rank;
        
        // 为id13成员的"魔丸降世"文字添加红色样式
        let descriptionHtml = member.description;
        if (member.id === 13) {
            descriptionHtml = descriptionHtml.replace('魔丸降世', '<span style="color: red;">魔丸降世</span>');
        }
        
        card.innerHTML = `
            <div class="member-avatar">
                <img src="${member.avatar}" alt="${member.name}">
            </div>
            <div class="rank-badge">${member.rank}</div>
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-title">${member.title}</p>
                <p class="member-description">${descriptionHtml}</p>
                <div class="member-tags">
                    ${member.tags.map(tag => `<span class="member-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        return card;
    }
    
    // 渲染成员列表
    function renderMembers(membersToRender) {
        membersGrid.innerHTML = '';
        
        if (membersToRender.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        membersToRender.forEach((member, index) => {
            const card = createMemberCard(member);
            card.style.animationDelay = `${index * 0.05}s`;
            membersGrid.appendChild(card);
        });
    }
    
    // 筛选成员
    function filterMembers() {
        let filteredMembers = members;
        
        // 根据等级筛选
        if (currentFilter !== 'all') {
            filteredMembers = filteredMembers.filter(member => {
                // 如果筛选的是"长老"，则包括社主和副社长
                if (currentFilter === '长老') {
                    return member.rank === '长老' || member.rank === '社主' || member.rank === '副社长';
                }
                return member.rank === currentFilter;
            });
        }
        
        // 根据搜索关键词筛选
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredMembers = filteredMembers.filter(member => 
                member.name.toLowerCase().includes(searchTerm) ||
                member.title.toLowerCase().includes(searchTerm) ||
                member.rank.toLowerCase().includes(searchTerm) ||
                member.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        renderMembers(filteredMembers);
    }
    
    // 初始化筛选器
    function initFilter() {
        const filterItems = document.querySelectorAll('.filter-item, .filter-sub-item');
        
        filterItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有活动状态
                filterItems.forEach(fi => fi.classList.remove('active'));
                
                // 设置当前项为活动状态
                this.classList.add('active');
                
                // 如果是子项，同时设置父项为活动状态
                if (this.classList.contains('filter-sub-item')) {
                    this.closest('.filter-item').classList.add('active');
                }
                
                // 更新当前筛选条件
                currentFilter = this.dataset.rank;
                
                // 应用筛选
                filterMembers();
            });
        });
    }
    
    // 初始化搜索功能
    searchInput.addEventListener('input', filterMembers);
    
    // 初始化页面
    function init() {
        initFilter();
        renderMembers(members);
    }
    
    // 启动应用
    init();
});