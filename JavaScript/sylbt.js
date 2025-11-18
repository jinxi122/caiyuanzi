// 轮播图功能脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有轮播图元素
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let intervalId;
    
    // 初始化轮播图状态
    function initSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
        });
        
        // 设置当前活跃的幻灯片
        slides[currentIndex].classList.add('active');
    }
    
    // 重置并重新开始自动轮播
    function resetAutoPlay() {
        // 清除现有的计时器
        clearInterval(intervalId);
        // 重新设置计时器
        intervalId = setInterval(nextSlide, 4000); // 每4秒切换一次
    }
    
    // 初始化显示第一张图片
    initSlides();
    
    // 轮播函数
    function nextSlide() {
        // 更新索引
        currentIndex = (currentIndex + 1) % totalSlides;
        
        // 更新轮播图状态
        initSlides();
    }
    
    // 设置自动轮播
    resetAutoPlay();
    
    // 鼠标悬浮在轮播图上时暂停轮播
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', function() {
        clearInterval(intervalId);
    });
    
    // 鼠标离开轮播图时继续轮播
    carouselContainer.addEventListener('mouseleave', function() {
        resetAutoPlay();
    });
});