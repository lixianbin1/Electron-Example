# Electron-Example

这是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的示例项目.

## 目录 

 - [项目目录](#mulu)
 - [项目指令](#zhilin)
 - [故障排除](#guzan)

<span id="mulu"></span>

### 项目目录

 - `common/` (公共文件夹)
    - `config.js` (公用配置文件)
 - `index.html` （初始html: 最初的index渲染页面）
 - `main.js` ( 入口文件：Electron的入口文件,用来创建Electron应用 )
 - `preload.js` （预加载脚本:将 Electron 的 process.versions 对象暴露给渲染器）
 - `renderer.js` （执行脚本:将 process.versions 读取渲染出来）

<span id="zhilin"></span>

### 项目指令

```bash
# 初始化安装
yarn install

# 启动项目
yarn dev
```

<span id="guzan"/>

### 故障排查





