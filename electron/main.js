const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

/**
 * @name createWindow
 * @return {undefined}
 */
function createWindow() {

	// todo: register shortcuts
	// globalShortcut.register('CommandOrControl+Y', () => {
	// 	// Do stuff when Y and either Command/Control is pressed.
	// })

	// Create the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 600,
		// todo: remember w/h
		titleBarStyle: 'hiddenInset'
	});

	const proxyRules = 'http://localhost:65501'; // todo: config it
	const proxyBypassRules = 'http://localhost:5000'; // todo: config it
	session.fromPartition('persist:webviewsession').setProxy({ proxyRules, proxyBypassRules }, () => {
		console.log('using the proxy', proxyRules, proxyBypassRules);
	});

	const startUrl = process.env.ELECTRON_START_URL || url.format({
		pathname: path.join(__dirname, '/../build/index.html'),
		protocol: 'file:',
		slashes: true
	});
	win.loadURL(startUrl);
	win.setTitle('Point Browser');

	// Emitted when the window is closed.
	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
