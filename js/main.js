// Supabase 配置
const SUPABASE_URL = 'https://sybgiwnksanuddwjeqkv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Ymdpd25rc2FudWRkd2plcWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NjczNjIsImV4cCI6MjA4OTU0MzM2Mn0.XOKk8sQxXknUlRKJtzp0wDPNjDDpkiz1YpoMdC6F6yE';

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
let displayedPhotos = []; // 当前显示的照片列表

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
            currentPhotos = [];
        }
    } catch (err) {
        console.warn('加载失败:', err);
        currentPhotos = [];
    }
    
    renderGallery(currentPhotos);
}

// 渲染画廊
function renderGallery(photoList) {
    galleryGrid.innerHTML = '';
    displayedPhotos = photoList;
    
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
                <span class="views-count">👁 ${photo.views || 0}</span>
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
        displayedPhotos = currentPhotos;
    } else {
        displayedPhotos = currentPhotos.filter(p => p.category === category);
    }
    renderGallery(displayedPhotos);
}

// 灯箱
async function openLightbox(index) {
    currentIndex = index;
    const photo = displayedPhotos[index];
    
    // 增加浏览次数
    const newViews = (photo.views || 0) + 1;
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/photos?id=eq.${photo.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ views: newViews })
        });
        // 更新本地数据
        photo.views = newViews;
    } catch (err) {
        console.warn('更新浏览次数失败:', err);
    }
    
    // 构建图片 URL
    let fullSrc = photo.src;
    if (photo.src.includes('unsplash.com')) {
        fullSrc = photo.src.replace(/w=\d+/, 'w=1600');
    }
    
    lightboxImg.src = fullSrc;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.description || '';
    
    // 显示详情面板
    showPhotoDetails(photo);
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showPhotoDetails(photo) {
    // 移除旧详情
    const existingDetails = document.querySelector('.photo-details');
    if (existingDetails) existingDetails.remove();
    
    // 解析 EXIF
    let exifHtml = '';
    if (photo.exif) {
        const exif = typeof photo.exif === 'string' ? JSON.parse(photo.exif) : photo.exif;
        exifHtml = `
            <div class="detail-section">
                <h4>📷 摄影参数</h4>
                <div class="exif-grid">
                    ${exif.camera ? `<div class="exif-item"><span>相机</span><span>${exif.camera}</span></div>` : ''}
                    ${exif.lens ? `<div class="exif-item"><span>镜头</span><span>${exif.lens}</span></div>` : ''}
                    ${exif.aperture ? `<div class="exif-item"><span>光圈</span><span>${exif.aperture}</span></div>` : ''}
                    ${exif.shutter ? `<div class="exif-item"><span>快门</span><span>${exif.shutter}</span></div>` : ''}
                    ${exif.iso ? `<div class="exif-item"><span>ISO</span><span>${exif.iso}</span></div>` : ''}
                </div>
            </div>
        `;
    }
    
    const details = document.createElement('div');
    details.className = 'photo-details';
    details.innerHTML = `
        ${photo.location ? `<div class="detail-section"><h4>📍 拍摄地点</h4><p>${photo.location}</p></div>` : ''}
        ${exifHtml}
        ${photo.thoughts ? `<div class="detail-section"><h4>💭 摄影心得</h4><p>${photo.thoughts}</p></div>` : ''}
        <div class="detail-section"><h4>👁 浏览次数</h4><p>${photo.views || 0} 次</p></div>
    `;
    
    document.querySelector('.lightbox-caption').appendChild(details);
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // 移除详情面板
    const existingDetails = document.querySelector('.photo-details');
    if (existingDetails) existingDetails.remove();
}

function updateLightbox() {
    const photo = displayedPhotos[currentIndex];
    if (!photo) return;
    
    let fullSrc = photo.src;
    if (photo.src.includes('unsplash.com')) {
        fullSrc = photo.src.replace(/w=\d+/, 'w=1600');
    }
    
    lightboxImg.src = fullSrc;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.description || '';
    
    showPhotoDetails(photo);
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + displayedPhotos.length) % displayedPhotos.length;
    updateLightbox();
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % displayedPhotos.length;
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

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// 启动
init();
