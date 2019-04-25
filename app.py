"""."""
from flask import Flask, flash, json, jsonify, render_template, request, send_file
from PyLog import Log, Logger
import dataset
import os
from werkzeug.utils import secure_filename
from datetime import datetime
from werkzeug.security import check_password_hash
import hashlib 
import random
import string
import smtplib
from email.message import EmailMessage

app = Flask(__name__, template_folder="static/CanvasWorld")
app.debug = True
files =[[secure_filename(x.name),x.name, datetime.fromtimestamp(x.stat().st_ctime).strftime('%Y-%m-%d')] for x in os.scandir("static/CanvasWorld") if x.is_dir() and not x.name.startswith(".")]
files.sort(key=lambda tup: tup[2])
# key = 'pbkdf2:sha256:50000$kcKh6aKg$2df02e4cc530afad0e67f3b9f3b27e0aba561cfdaf91866814b3aa56acd86fee'
# k = check_password_hash(key, "LNca8HA9DYrBtpe4")
# Log(k)

db = dataset.connect("sqlite:///logs.db?check_same_thread=false")

logs = db["logs"]

keys = ''.join([random.choice(string.hexdigits) for x in range(random.randrange(20, 30))])
with open(".h", "w+") as f:
   f.write(keys + "\n")
keys = hashlib.md5(keys.encode()).hexdigest()



def log():
   """."""
   logs.insert(dict(
         time = datetime.now(), 
         referrer = request.referrer,
         path = request.url,
         ip = request.remote_addr,
         env_ip = request.environ['REMOTE_ADDR']
   ))
@app.route("/admin/<key>")
def add(key=None):
   """."""
   log()

   if key:
      if hashlib.md5(key.encode()).hexdigest() == keys:
         return render_template(".admin.html", logs=[x for x in logs.all()])
      
   return "", 502


@app.route("/static/CanvasWorld/.index.html")
@app.route("/static/CanvasWorld/.template.html")
@app.route("/static/CanvasWorld/<a>/index.html")
@app.route("/static/CanvasWorld/.admin.html")
def block(a=""):
   return "", 404

   
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


# @app.route("/<name>")
def pathn(name):
   """."""
   try:
      return render_template(f"{name[1]}/index.html", args={"name" : name, "v":request.args.get("v"), "scripts":files})
   except Exception as exc:
      Log(exc)
      return "", 404

for filename in files:
    app.add_url_rule("/" + filename[0], defaults={"name": filename}, view_func=pathn)


@app.route("/<path>")
@app.route("/sample/<path>")
def getsample(path):
   """."""
   # Log(request.referrer.split("/")[-1])
   # if path == "sample.gif":
   #    path = request.referrer.split("/")[:-1]
   p = f"static/CanvasWorld/{path}/sample.gif"
   if not os.path.isfile(p):
      p = "static/images/404.gif"
   return send_file(p, mimetype='image/gif')

@app.route('/')
def method_name():
   log()
   return render_template(".index.html", files = files)




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)


