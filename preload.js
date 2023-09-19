const { contextBridge } = require('electron');
// 预加载脚本,将不同类型的进程桥接在一起
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});