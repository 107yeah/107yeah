document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const imageInput = document.getElementById('imageInput');
    const audioInput = document.getElementById('audioInput');
    const uploadArea = document.getElementById('uploadArea');
    const startBtn = document.getElementById('startBtn');
    const photoContainer = document.getElementById('photoContainer');
    const photoImage = document.getElementById('photoImage');
    const photoTitle = document.getElementById('photoTitle');
    const photoDescription = document.getElementById('photoDescription');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const musicTitle = document.getElementById('musicTitle');
    const musicStatus = document.getElementById('musicStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    const deviceInfo = document.getElementById('deviceInfo');
    
    // 创建音频元素
    const audio = new Audio();
    let isPlaying = false;
    let currentImageFile = null;
    let currentAudioFile = null;
    
    // 检测设备类型
    function detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        deviceInfo.textContent = `设备类型: ${isMobile ? '手机' : '电脑/平板'}`;
    }
    
    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // 更新进度条
    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTime.textContent = formatTime(audio.currentTime);
        }
    }
    
    // 初始化音频
    function initAudio() {
        audio.addEventListener('loadedmetadata', function() {
            duration.textContent = formatTime(audio.duration);
        });
        
        audio.addEventListener('timeupdate', updateProgress);
        
        audio.addEventListener('ended', function() {
            musicStatus.textContent = '播放结束';
            isPlaying = false;
        });
    }
    
    // 播放音乐
    function playMusic() {
        if (currentAudioFile) {
            audio.play().then(() => {
                musicStatus.textContent = '正在播放';
                isPlaying = true;
            }).catch(error => {
                musicStatus.textContent = '播放失败，请与页面交互后重试';
                console.error('播放错误:', error);
            });
        }
    }
    
    // 暂停音乐
    function pauseMusic() {
        audio.pause();
        musicStatus.textContent = '已暂停';
        isPlaying = false;
    }
    
    // 停止音乐
    function stopMusic() {
        audio.pause();
        audio.currentTime = 0;
        musicStatus.textContent = '已停止';
        isPlaying = false;
        updateProgress();
    }
    
    // 处理文件选择
    function handleFileSelect(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (type === 'image') {
            currentImageFile = file;
            const reader = new FileReader();
            
            reader.onload = function(e) {
                photoImage.src = e.target.result;
                photoTitle.textContent = file.name.replace(/\.[^/.]+$/, ""); // 移除文件扩展名
                photoDescription.textContent = `上传时间: ${new Date().toLocaleString()}`;
            };
            
            reader.readAsDataURL(file);
        } else if (type === 'audio') {
            currentAudioFile = file;
            const objectURL = URL.createObjectURL(file);
            audio.src = objectURL;
            musicTitle.textContent = file.name.replace(/\.[^/.]+$/, ""); // 移除文件扩展名
            musicStatus.textContent = '音乐已加载';
            initAudio();
        }
    }
    
    // 开始展示
    function startPresentation() {
        if (!currentImageFile) {
            alert('请先选择一张图片');
            return;
        }
        
        photoContainer.style.display = 'block';
        photoContainer.scrollIntoView({ behavior: 'smooth' });
        
        // 尝试自动播放音乐（需要用户交互）
        if (currentAudioFile) {
            // 延迟播放以确保用户已与页面交互
            setTimeout(playMusic, 500);
        }
    }
    
    // 事件监听器
    imageInput.addEventListener('change', (e) => handleFileSelect(e, 'image'));
    audioInput.addEventListener('change', (e) => handleFileSelect(e, 'audio'));
    
    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.7)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        uploadArea.style.background = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        uploadArea.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // 尝试识别文件类型
            for (let file of files) {
                if (file.type.startsWith('image/')) {
                    const event = { target: { files: [file] } };
                    handleFileSelect(event, 'image');
                } else if (file.type.startsWith('audio/')) {
                    const event = { target: { files: [file] } };
                    handleFileSelect(event, 'audio');
                }
            }
        }
    });
    
    startBtn.addEventListener('click', startPresentation);
    playBtn.addEventListener('click', playMusic);
    pauseBtn.addEventListener('click', pauseMusic);
    stopBtn.addEventListener('click', stopMusic);
    
    progressContainer.addEventListener('click', function(e) {
        if (!audio.duration) return;
        
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
        updateProgress();
    });
    
    // 页面点击时尝试播放音乐（处理自动播放限制）
    document.addEventListener('click', function() {
        if (currentAudioFile && !isPlaying) {
            // 仅在音乐已加载但未播放时尝试播放
            playMusic();
        }
    });
    
    // 初始化
    detectDevice();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        }
    });
});