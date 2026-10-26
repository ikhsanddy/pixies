# Setup Windows
Here we describe the setup for Windows.

## Installing Pixies

1. Download Pixies  
   Download the latest version of Pixies from the [releases page](https://github.com/ikhsanddy/pixies/releases/latest). Download the file `pixies-windows-x64.exe`.

2. Place the file  
   Move the downloaded file to a folder of your choice (e.g., `C:\Pixies`). Rename it to `pixies.exe` for convenience.

3. Test your installation  
   Open PowerShell or Command Prompt in the folder where you placed the file (Shift + Right-click > "Open PowerShell window here").  
   Run the executable:
   ```powershell
   .\pixies.exe
   ```

   If everything runs successfully, you did everything right! Congratulations. :)   
   Pixies is now available on port 5216. Open http://localhost:5216 in your browser.

## Automatic startup using the autostart folder in Windows

1. Open the autostart folder in windows  
   Press both keys (`Windows` + `R`) simultaneously on your keyboard until a Run dialog appears. Then type `%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` and press `Enter`.

2. Create a shortcut  
   Right-click in the folder and select `New` > `Shortcut`. Browse to your `pixies.exe` file and create the shortcut.

3. If everything worked, Pixies should now start automatically when the system is started.

## Alternative: Install from source code
::: warning Attention
This process installs the latest development version of Pixies. Errors may occur.
:::

1. Download Bun  
   To build Pixies from source, you need **Bun**. Open PowerShell and run:
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

2. Download Pixies source  
   Clone the repository or download the source code from [GitHub](https://github.com/ikhsanddy/pixies).

3. Install dependencies and build
   ```powershell
   bun install
   cd client && npm install && npm run build && cd .. && move client\build build
   ```

4. Start Pixies
   ```powershell
   bun run server/index.js
   ```