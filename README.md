# Slate
Offline text translator built with Tether's QVAC SDK. Runs a local Bergamot NMT model on-device to translate Estonian, Maltese, and other low-resource languages, with no API calls and no data leaving the machine.


# On a Mac:

1
Install Node.js
Go to nodejs.org in your browser. Click the big green download button (it will offer you the right version for Mac automatically). Open the downloaded file and click through the installer using all the default options.

2
Unzip the project folder
Find the qvac-translator.zip file you downloaded (usually in your Downloads folder) and double-click it. This creates a regular folder called qvac-translator next to it.

3
Open the Terminal app
Press Command + Space to open Spotlight search, type Terminal, and press Enter. A plain black or white text window will open. This is where you'll type commands.

4
Go to the project folder in Terminal
Type cd followed by a space, then drag the qvac-translator folder from Finder straight into the Terminal window. It will fill in the folder location for you. Press Enter.

5
Install the app's required files
Type npm install and press Enter. This downloads everything the app needs to run. It can take a few minutes and looks like nothing is happening for a while, that's normal, just let it finish.

6
Run the translator
Type node translate.js followed by a space, then some text in quotes, like node translate.js "Tere, kuidas Sul laheb?" and press Enter. The first time, it will also download a small translation model, then show you the translated text.


# On Windows:

1
Install Node.js
Go to nodejs.org in your browser. Click the big green download button, it will offer you the Windows installer automatically. Open the downloaded file and click Next through the installer using all the default options, then Finish.

2
Unzip the project folder
Find the qvac-translator.zip file you downloaded (usually in your Downloads folder). Right-click it and choose Extract All, then click Extract. This creates a regular folder called qvac-translator.

3
Open Command Prompt
Click the Start menu, type cmd, and press Enter. A plain black text window will open. This is where you'll type commands.

4
Go to the project folder
Type cd followed by a space, then drag the qvac-translator folder from File Explorer straight into the Command Prompt window. It will fill in the folder location for you. Press Enter.

5
Install the app's required files
Type npm install and press Enter. This downloads everything the app needs to run. It can take a few minutes and looks like nothing is happening for a while, that's normal, just let it finish.

6
Run the translator
Type node translate.js followed by a space, then some text in quotes, like node translate.js "Tere, kuidas Sul laheb?" and press Enter. The first time, it will also download a small translation model, then show you the translated text.
