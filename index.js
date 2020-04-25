const electron = require("electron");
const {app, BrowserWindow, Menu, ipcMain} = electron;

let kasirWindow;
let transaksiWindow;
let aboutWindow;
let listWindow;

let allPenjualan = [];

app.on("ready", ()=>{
    kasirWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true
        },
        title: "Aplikasi Kasir"
    });

    kasirWindow.loadURL(`file://${__dirname}/kasir.html`);
    kasirWindow.on("closed", () =>{

        app.quit();
        kasirWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const TransaksiWindowCreator = () => {
    transaksiWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 800,
        height: 600,
        title: "Transaksi"
    });

    transaksiWindow.setMenu(null);
    transaksiWindow.loadURL(`file://${__dirname}/transaksi.html`);
    transaksiWindow.on("closed", () => (transaksiWindow = null));
};

const AboutWindowCreator = () => {
    aboutWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "About"
    });

    aboutWindow.setMenu(null);
    aboutWindow.loadURL(`file://${__dirname}/about.html`);
    aboutWindow.on("closed", () => (aboutWindow = null));
};

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Daftar Transaksi"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null));
};

ipcMain.on("belanja", function(){
    TransaksiWindowCreator()
})
ipcMain.on("profil", function(){
    AboutWindowCreator()
})

ipcMain.on("penjualan:transaksi", (event, penjualan) => {
    allPenjualan.push(penjualan);
    transaksiWindow.close();

    console.log(allPenjualan);
});

ipcMain.on("penjualan:request:list", event => {
    listWindow.webContents.send('penjualan:response:list',allPenjualan);
});




const menuTemplate = [{
    label: "File",
    submenu: [{
            label: "Daftar Transaksi",
            click() {
                listWindowCreator();
            }
        },
        {
            label: "Quit",
            accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl + Q",
            click() {
                app.quit();
            }

        }

    ]
},

{
    label: "View",
    submenu: [{role: "reload"}, {role: "toggledevtools"}]
}

]
