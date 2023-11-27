<p align="center">
    <img src="./public/icon.png" width = "128" height = "128" alt="app logo" align=center />
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;color:#409fee;">
lmo-Transform</h1>
<p align="center">
    <img src="https://img.shields.io/badge/License-Apache2.0 -blue.svg" alt="TypeScript">
</p>
<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-5.1.6 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/React-18.2.0 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/React_dom-18.2.0 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/React_Redux-8.1.2 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/Electron-25.3.2 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/Electron_Builder-24.6.3 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/concurrently-8.2.0 -blue.svg" alt="TypeScript">
</p>

---

## 介绍

lmo-Transform，一款开源的格式转换工具，支持主流的视频、音频、图像格式互转。

## 开源相关

本项目所有源代码基于 [Apache-2.0](https://github.com/ayuanlmo/lmo-transform/blob/main/LICENSE)协议开源。
本项目所使用的第三方库，请遵循该库的协议标准。

[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)

---

## 开发相关

首先，如果您有更好的idea，我们非常欢迎您的PR。

您需要注意的是：本项目基于NT操作系统开发。并未对其他操作系统做适配、兼容处理，
如果您想移植到其他操作系统，请确保它功能能在目标操作系统上正常运行。

我们推荐您设置 `yarn` 来作为JavaScript套件管理器。

**本程序依赖ffmpeg**， 请确保`/ffmpeg`目录下存在`ffmpeg.exe` 、 `ffplay.exe` 、 `ffprobe.exe`
可执行文件，当然如果您不想这样，您也可以修改`/scr/bin/ffmpeg.ts`下`FFMPEG_BIN_PATH`、`FFPROBE_BIN_PATH`、`FFPLAY_BIN_PATH`
变量值。

由于使用了`Node.js API`，所以 react app并不能运行在您的浏览器上。

开始开发：

```bash
# 启动开发环境
yarn start
```

构建：

```bash
yarn build
```

其他：

```bash
# 
yarn react-start
# 
yarn react-build
# 
yarn react-test
# 
yarn react-eject

```

## 有问题吗？

可通过[YouTrack](https://ayuanlmo.youtrack.cloud/)向我们提问，或者您可以发送issues

## 特别感谢

由衷地感谢 [JetBrains](https://www.jetbrains.com/)团队,
为此项目赞助了免费的[许可证](https://www.jetbrains.com/community/opensource/)

![JetBrainsLogo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
