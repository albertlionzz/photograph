// 摄影作品数据
const photos = [
    {
        id: 1,
        title: "暮色北海道",
        description: "冬季北海道的日落时分",
        category: "landscape",
        src: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800",
        thumb: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400"
    },
    {
        id: 2,
        title: "城市轮廓",
        description: "雨后的城市天际线",
        category: "landscape",
        src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
        thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400"
    },
    {
        id: 3,
        title: "雾中森林",
        description: "清晨的森林迷雾",
        category: "landscape",
        src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400"
    },
    {
        id: 4,
        title: "光的时刻",
        description: "逆光人像摄影",
        category: "portrait",
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
        thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400"
    },
    {
        id: 5,
        title: "眸",
        description: "黑白人像",
        category: "portrait",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
        thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    },
    {
        id: 6,
        title: "日常",
        description: "生活中的瞬间",
        category: "street",
        src: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800",
        thumb: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=400"
    },
    {
        id: 7,
        title: "夜色",
        description: "霓虹灯下的城市",
        category: "street",
        src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800",
        thumb: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400"
    },
    {
        id: 8,
        title: "细节之美",
        description: "建筑细节",
        category: "detail",
        src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800",
        thumb: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400"
    },
    {
        id: 9,
        title: "静物",
        description: "器物之美",
        category: "detail",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
        id: 10,
        title: "山川",
        description: "日出时的山脉",
        category: "landscape",
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400"
    },
    {
        id: 11,
        title: "海岸线",
        description: "海浪与岩石",
        category: "landscape",
        src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
        thumb: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400"
    },
    {
        id: 12,
        title: "情绪",
        description: "室内人像",
        category: "portrait",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
        thumb: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
    }
];

// DOM 元素
const galleryGrid = document.querySelector('.gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

// 当前状态
let currentPhotos = [...photos];
let currentIndex = 0;

// 初始化
function init() {
    renderGallery(photos);
    setupEventListeners();
}

// 渲染画廊
function renderGallery(photoList) {
    galleryGrid.innerHTML = '';
    
    photoList.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${index * 0.05}s`;
        item.innerHTML = `
            <img src="${photo.thumb}" alt="${photo.title}" loading="lazy">
            <span class="category-tag">${getCategoryName(photo.category)}</span>
            <div class="overlay">
                <h3>${photo.title}</h3>
                <p>${photo.description}</p>
            </div>
        `;
        
        item.addEventListener('click', () => openLightbox(index));
        galleryGrid.appendChild(item);
    });
}

// 获取分类中文名
function getCategoryName(category) {
    const names = {
        landscape: '风景',
        portrait: '人像',
        street: '街拍',
        detail: '细节'
    };
    return names[category] || category;
}

// 过滤照片
function filterPhotos(category) {
    if (category === 'all') {
        currentPhotos = [...photos];
    } else {
        currentPhotos = photos.filter(p => p.category === category);
    }
    renderGallery(currentPhotos);
}

// 灯箱
function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const photo = currentPhotos[currentIndex];
    lightboxImg.src = photo.src.replace('w=400', 'w=1200').replace('w=800', 'w=1200');
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.description;
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightbox();
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateLightbox();
}

// 事件监听
function setupEventListeners() {
    // 过滤器
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterPhotos(btn.dataset.category);
        });
    });

    // 灯箱
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevPhoto);
    lightboxNext.addEventListener('click', nextPhoto);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevPhoto();
        if (e.key === 'ArrowRight') nextPhoto();
    });

    // 移动端菜单
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // 点击移动菜单链接后关闭菜单
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// 启动
init();
