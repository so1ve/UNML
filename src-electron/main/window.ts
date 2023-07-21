import { release } from "node:os";
import { join } from "node:path";

import type { WebPreferences } from "electron";
import { BrowserWindow, app, shell } from "electron";

process.env.ROOT = join(__dirname, "..");
process.env.DIST = join(process.env.ROOT, "dist-electron");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.ROOT, "public")
  : join(process.env.ROOT, ".output/public");
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

const TITLE = "UNML";
const ICON = join(process.env.VITE_PUBLIC, "favicon.ico");
const WIDTH = 1000;
const HEIGHT = 750;
const preload = join(__dirname, "./preload.js");
const url = process.env.VITE_DEV_SERVER_URL!;
const indexHtml = join(process.env.DIST, "index.html");
const WEB_PREFERENCES: WebPreferences = {
  preload,
  contextIsolation: true,
};

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) {
  app.disableHardwareAcceleration();
}

// Set application name for Windows 10+ notifications
if (process.platform === "win32") {
  app.setAppUserModelId(app.getName());
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length > 0) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

export async function createWindow() {
  win = new BrowserWindow({
    title: TITLE,
    icon: ICON,
    width: WIDTH,
    height: HEIGHT,
    webPreferences: WEB_PREFERENCES,
    resizable: false,
    titleBarStyle: "hidden",
    frame: false,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(url);
    win.webContents.openDevTools({
      mode: "detach",
    });
  } else {
    await win.loadFile(indexHtml);
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  return win;
}
