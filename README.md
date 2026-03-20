# 光影记 | Photography Portfolio

个人摄影作品网站，基于 GitHub Pages 托管。

## 本地预览

```bash
# 方式1：直接用浏览器打开 index.html

# 方式2：使用 Python 本地服务器
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 部署到 GitHub Pages

### 方式一：Git 上传（推荐）

1. **创建 GitHub 仓库**
   - 登录 [github.com](https://github.com)
   - 点击 "+" → "New repository"
   - 仓库名：`your-username.github.io`（必须用这个格式）
   - 选择 "Public"
   - 点击 "Create repository"

2. **上传文件**
   ```bash
   # 克隆仓库
   git clone https://github.com/your-username/your-username.github.io
   cd your-username.github.io
   
   # 复制所有文件到这里
   # (index.html, about.html, contact.html, css/, js/)
   
   # 提交推送
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **访问网站**
   - 等待 1-2 分钟
   - 访问：`https://your-username.github.io`

### 方式二：使用 GitHub 网页

1. 进入仓库页面
2. 点击 "Add file" → "Upload files"
3. 拖入所有文件
4. 提交更改

## 自定义修改

### 1. 修改作品图片
编辑 `js/main.js` 中的 `photos` 数组：

```javascript
{
    id: 1,
    title: "你的作品标题",
    description: "作品描述",
    category: "landscape", // landscape/portrait/street/detail
    src: "https://你的图片链接.jpg",
    thumb: "https://你的缩略图链接.jpg"
}
```

### 2. 修改个人信息
- 联系方式：修改 `contact.html`
- 个人简介：修改 `about.html`
- 社交链接：修改各页面的 `footer` 部分

### 3. 修改网站标题
编辑 `index.html` 中的 `<title>` 标签

## 技术栈

- 纯 HTML + CSS + JavaScript
- 无需后端
- 响应式设计
- 暗色主题

---

有问题？可以在 GitHub 仓库中提交 Issue。
