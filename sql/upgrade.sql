-- 更新作品表，增加字段
ALTER TABLE photos ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS exif JSONB;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS thoughts TEXT;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT DEFAULT 'general',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 开启 RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 读取策略
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);

-- 写入策略（管理员）
CREATE POLICY "Admin write articles" ON articles FOR ALL USING (true);
CREATE POLICY "Admin write comments" ON comments FOR ALL USING (true);

-- 更新现有数据示例
UPDATE photos SET 
    location = '日本·北海道',
    exif = '{"camera": "Sony A7R IV", "lens": "24-70mm f/2.8 GM", "aperture": "f/8", "shutter": "1/250s", "iso": "100"}',
    thoughts = '这张照片拍摄于冬季北海道的傍晚时分。当阳光透过云层洒向雪原，整个世界仿佛被染成了金色。我静静地等待了很久，终于捕捉到了这完美的一刻。',
    views = 128
WHERE id = 1;

-- 插入示例文章
INSERT INTO articles (title, content, excerpt, cover_image, category, views) VALUES
('摄影心得 | 如何拍出有故事感的照片', 
 '# 如何拍出有故事感的照片

好的照片不仅仅是技术的体现，更是情感的传达。

## 1. 寻找光影

光线是摄影的灵魂。我喜欢在清晨或傍晚拍摄，这时候的光线最柔和最有层次。

## 2. 等待时机

有时候，最美的瞬间需要耐心等待。不要急于按下快门，观察、思考、然后捕捉。

## 3. 融入情感

每一张照片都应该有自己的情绪。在拍摄之前，先问问自己：我想表达什么？

## 4. 后期处理

后期是为了更好地还原现场的感觉，而不是创造一个不存在的世界。

希望这些心得对你有帮助！',
 '分享一些关于人像摄影的思考和技巧...',
 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
 'tutorial',
 256);

-- 示例评论
INSERT INTO comments (article_id, author, content) VALUES
(1, '摄影爱好者', '写的太好了，受益匪浅！'),
(1, '小明', '期待更多教程');
