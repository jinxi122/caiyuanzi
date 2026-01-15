// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('syszl');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 统一的动画初始化
document.addEventListener('DOMContentLoaded', function() {
    // 新闻卡片动画
    const cards = document.querySelectorAll('.news-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });

    // 其他元素动画
    const animateElements = document.querySelectorAll('.section-title');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200);
    });
});

// CTA按钮点击效果
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '#tiaozhuanlbt';
        });
    }
});

// 新闻卡片点击效果
document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('阅读更多新闻');
    });
});
// 视频自动播放功能
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video-placeholder video');
    
    if (video) {
        // 检查元素是否在视口中
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
            
            // 检查元素是否在视口的中间部分
            return (
                rect.top <= windowHeight * 0.6 &&
                rect.bottom >= windowHeight * 0.4 &&
                rect.left <= windowWidth * 0.75 &&
                rect.right >= windowWidth * 0.25
            );
        }
        
        // 滚动事件监听器
        window.addEventListener('scroll', function() {
            if (isElementInViewport(video)) {
                // 当视频在视口中时播放
                video.play().catch(e => console.log("自动播放失败:", e));
            } else {
                // 当视频不在视口中时暂停
                video.pause();
            }
        });
        
        // 页面加载时也检查一次
        if (isElementInViewport(video)) {
            video.play().catch(e => console.log("自动播放失败:", e));
        }
    }
});