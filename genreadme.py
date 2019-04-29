import os
from werkzeug.utils import secure_filename
from datetime import datetime

string = """
# Canvas World

My own workshop of cool things I have found and made.

Gallery can be found at [CanvasWorld.xyz](http://CanvasWorld.xyz)

The setup script I use for [three.js](https://threejs.org/) can be found [here](/ThreeSetup.js)

----

"""

files = [[secure_filename(x.name),x.name, datetime.fromtimestamp(x.stat().st_ctime).strftime('%Y-%m-%d')] for x in os.scandir("static/CanvasWorld") if x.is_dir() and not x.name.startswith(".")]

for opt in ["(2d)", "(3d)"]:
    names =[x[1][5:] for x in files if x[1].startswith(opt)]
    names.sort()
    print(names)

    d2 = "\n".join([f"{names.index(x)}. [x] [{x}](http://canvasworld.xyz/{opt[1:-1]}_{x.replace(' ', '_')})" for x in names])
    string += f"\n### {opt[1:-1]}\n{d2}\n---"


with open("static\CanvasWorld\README.md", "w+") as f:
    f.write(string)