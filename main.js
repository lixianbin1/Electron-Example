const { app, BrowserWindow ,Menu} = require('electron')
const path = require('path') // 路径模块

// 设置自定义菜单
const template=[]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// 创建窗口函数
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    resizable: true,
    show:false,
    backgroundColor: '#fff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.webContents.openDevTools({mode:'right'})
  win.loadFile('index.html')
  win.once('ready-to-show', () => {
    win.show()
  })
}

// 只有在app模块的ready事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 监听关闭窗口，在所有窗口关闭后，退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})