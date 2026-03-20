// Supabase 配置
const SUPABASE_URL = 'https://sybgiwnksanuddwjeqkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Ymdpd25rc2FudWRkd2plcWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NjczNjIsImV4cCI6MjA4OTU0MzM2Mn0.XOKk8sQxXknUlRKJtzp0wDPNjDDpkiz1YpoMdC6F6yE';

// 照片数据（本地备用）
const localPhotos = [
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
let currentPhotos = [];
let currentIndex = 0;

// 初始化
async function init() {
    await loadPhotos();
    setupEventListeners();
}

// 从 Supabase 加载照片
async function loadPhotos() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/photos?order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (res.ok) {
            currentPhotos = await res.json();
        } else {
            console.warn('无法从 Supabase 加载，使用本地数据');
            currentPhotos = localPhotos;
        }
    } catch (err) {
        console.warn('加载失败，使用本地数据:', err);
        currentPhotos = localPhotos;
    }
    
    renderGallery(currentPhotos);
}

// 渲染画廊
function renderGallery(photoList) {
    galleryGrid.innerHTML = '';
    
    if (photoList.length === 0) {
        galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 4rem;">暂无作品</p>';
        return;
    }
    
    photoList.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${index * 0.05}s`;
        item.innerHTML = `
            <img src="${photo.thumb || photo.src}" alt="${photo.title}" loading="lazy">
            <span class="category-tag">${getCategoryName(photo.category)}</span>
            <div class="overlay">
                <h3>${photo.title}</h3>
                <p>${photo.description || ''}</p>
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
    // 重新从 currentPhotos 过滤，而不是重新获取
    if (category === 'all') {
        renderGallery(currentPhotos);
    } else {
        const filtered = currentPhotos.filter(p => p.category === category);
        renderGallery(filtered);
    }
}

// 灯箱
function openLightbox(index) {
    // 找到当前显示的照片列表中的索引对应的实际照片
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const photoList = activeCategory === 'all' ? currentPhotos : currentPhotos.filter(p => p.category === activeCategory);
    
    currentIndex = index;
    const photo = photoList[index];
    
    // 更新灯箱
    const fullSrc = photo.src.replace('w=400', 'w=1200').replace('w=800', 'w=1200');
    lightboxImg.src = fullSrc;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.description || '';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const photoList = activeCategory === 'all' ? currentPhotos : currentPhotos.filter(p => p.category === activeCategory);
    const photo = photoList[currentIndex];
    
    if (!photo) return;
    
    const fullSrc = photo.src.replace('w=400', 'w=1200').replace('w=800', 'w=1200');
    lightboxImg.src = fullSrc;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.description || '';
}

function prevPhoto() {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const photoList = activeCategory === 'all' ? currentPhotos : currentPhotos.filter(p => p.category === activeCategory);
    
    currentIndex = (currentIndex - 1 + photoList.length) % photoList.length;
    updateLightbox();
}

function nextPhoto() {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const photoList = activeCategory === 'all' ? currentPhotos : currentPhotos.filter(p => p.category === activeCategory);
    
    currentIndex = (currentIndex + 1) % photoList.length;
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
