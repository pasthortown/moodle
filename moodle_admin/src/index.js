const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let loginWindow;

app.on('ready', () => {
  loginWindow = new BrowserWindow({});
  //loginWindow.setMenu(null)
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/login/login.html'),
    protocol: 'file',
    slashes: true,
  }));
});