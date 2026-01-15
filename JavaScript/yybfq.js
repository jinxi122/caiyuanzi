// 音乐播放器控制脚本
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const musicControls = document.getElementById('musicControls');
    
    // 初始状态：显示播放按钮
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    
    // 设置音频音量为较低值，这样可以自动播放且不会太突兀
    audio.volume = 0.3;
    
    // 尝试自动播放
    audio.play().then(function() {
        // 播放成功，显示暂停按钮
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        musicControls.classList.add('playing');
        
        // 0.5秒后逐渐恢复到正常音量
        setTimeout(function() {
            // 使用渐变效果增加音量
            let currentVolume = 0.3;
            const targetVolume = 1.0;
            const volumeStep = 0.05;
            
            const volumeInterval = setInterval(function() {
                currentVolume += volumeStep;
                if (currentVolume >= targetVolume) {
                    currentVolume = targetVolume;
                    clearInterval(volumeInterval);
                }
                audio.volume = currentVolume;
            }, 100);
        }, 500);
    }).catch(function(error) {
        console.log('自动播放失败:', error);
        // 如果自动播放失败，设置音量为正常值并等待用户交互
        audio.volume = 1.0;
        
        let hasInteracted = false;
        
        function enableAutoPlay() {
            if (!hasInteracted) {
                hasInteracted = true;
                audio.play().then(function() {
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'block';
                    musicControls.classList.add('playing');
                }).catch(function(error) {
                    console.log('播放失败:', error);
                });
                
                document.removeEventListener('click', enableAutoPlay);
                document.removeEventListener('touchstart', enableAutoPlay);
                document.removeEventListener('keydown', enableAutoPlay);
            }
        }
        
        document.addEventListener('click', enableAutoPlay);
        document.addEventListener('touchstart', enableAutoPlay);
        document.addEventListener('keydown', enableAutoPlay);
    });
    
    // 播放按钮点击事件
    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // 确保音量为正常值
        audio.volume = 1.0;
        audio.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        musicControls.classList.add('playing');
    });
    
    // 暂停按钮点击事件
    pauseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        audio.pause();
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        musicControls.classList.remove('playing');
    });
    
    // 鼠标悬停放大效果
    musicControls.addEventListener('mouseenter', function() {
        this.classList.add('hover');
    });
    
    musicControls.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
    });

    // 彩蛋音频（互斥播放逻辑）
    const caidanAudio = document.getElementById('caidanMusic');
    const caidanBtn = document.getElementById('caidanMusicBtn');

    // 定义全局函数以支持页面内 inline onclick="playCaidanMusic()"
    window.playCaidanMusic = function() {
        if (!caidanAudio) return;

        // 暂停并保存背景音乐的播放状态
        const bgWasPlaying = !audio.paused && !audio.ended;
        if (bgWasPlaying) {
            audio.pause();
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
            musicControls.classList.remove('playing');
        }

        // 暂停页面上其他所有 audio（除 caidanAudio）并重置播放时间
        document.querySelectorAll('audio').forEach(function(a) {
            if (a !== caidanAudio) {
                try { a.pause(); } catch (e) {}
            }
        });

        // 从头开始播放彩蛋音频
        try {
            caidanAudio.currentTime = 0;
        } catch (e) {}
        caidanAudio.play().catch(function(err) {
            console.log('彩蛋播放失败：', err);
        });

        // 当彩蛋音频结束时，若背景之前在播放则尝试恢复背景音乐
        caidanAudio.onended = function() {
            if (bgWasPlaying) {
                audio.play().then(function() {
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'block';
                    musicControls.classList.add('playing');
                }).catch(function() {
                    // 无法自动恢复播放（浏览器限制）时保持静默
                });
            }
        };
    };

    // 如果页面上存在彩蛋按钮，也为其绑定事件（防止 inline 丢失）
    if (caidanBtn) {
        caidanBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.playCaidanMusic();
        });
    }
});
