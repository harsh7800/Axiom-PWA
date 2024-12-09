import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server";
import path, { join } from "path";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: "localhost",
      port: nextJSPort,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("ping", () => console.log("pong"));
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.commandLine.appendSwitch("enable-logging");

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

ipcMain.on("download-json", (event, data) => {
  // Show the save file dialog to the user
  dialog
    .showSaveDialog({
      title: "Save JSON file",
      defaultPath: path.join(app.getPath("documents"), "data.json"),
      filters: [{ name: "JSON", extensions: ["json"] }],
    })
    .then((result) => {
      if (!result.canceled) {
        const filePath = result.filePath;

        // Write the JSON data to the file
        fs.writeFile(
          filePath,
          JSON.stringify(data, null, 2),
          "utf-8",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err: any) => {
            if (err) {
              console.error("Error saving the JSON file:", err);
            } else {
              console.log("JSON file saved successfully at", filePath);
            }
          }
        );
      }
    });
});
