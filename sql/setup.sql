-- 在 Supabase SQL Editor 中运行以下 SQL

-- 创建作品表
CREATE TABLE IF NOT EXISTS photos (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'landscape',
    src TEXT NOT NULL,
    thumb TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 开启 RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取作品
CREATE POLICY "Allow public read photos" ON photos
    FOR SELECT USING (true);

-- 仅允许管理员写入
CREATE POLICY "Allow admin write photos" ON photos
    FOR ALL USING (true);

-- 插入示例数据
INSERT INTO photos (title, description, category, src, thumb) VALUES
('暮色北海道', '冬季北海道的日落时分', 'landscape', 
 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800',
 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400'),
('城市轮廓', '雨后的城市天际线', 'landscape',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400'),
('光的时刻', '逆光人像摄影', 'portrait',
 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400'),
('夜色', '霓虹灯下的城市', 'street',
 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800',
 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400');
