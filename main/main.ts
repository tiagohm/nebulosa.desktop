import { BrowserWindow, app, shell } from 'electron'
import { join } from 'path'

app.commandLine.appendSwitch('disable-http-cache')
app.commandLine.appendSwitch('lang', 'en-US')

// Menu.setApplicationMenu(null)

function createWindow() {
	const win = new BrowserWindow({
		title: 'Nebulosa',
		width: 800,
		height: 600,
		backgroundColor: '#121212',
		autoHideMenuBar: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			allowRunningInsecureContent: false,
			contextIsolation: true,
			devTools: true,
			spellcheck: false,
		},
	})

	win.maximize()

	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url)
		return { action: 'deny' }
	})

	win.loadFile(join(__dirname, 'web/src/pages/home/index.html'))
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
