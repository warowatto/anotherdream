import { app, BrowserWindow } from 'electron';
import * as path from 'path';

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    width: 512,
    height: 512,
    autoHideMenuBar: true,
  });

  window.loadFile(path.join(__dirname, '..', '.output/public', 'index.html'));
});
