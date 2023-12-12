"""."""
from flask import Flask, flash, json, jsonify, render_template, request, send_file
from PyLog import Log, Logger
import dataset
import os
from werkzeug.utils import secure_filename
from datetime import datetime

 
app = Flask(__name__, template_folder="static/CanvasWorld")
app.debug = True
files =[[secure_filename(x.name),x.name, datetime.fromtimestamp(x.stat().st_ctime).strftime('%Y-%m-%d')] for x in os.scandir("static/CanvasWorld") if x.is_dir() and not x.name.startswith(".")]
files.sort(key=lambda tup: tup[2])

# @app.before_request
# def before():
#    """."""
#    Log(request)


def wrap(func):
   def w1(*args, **kwargs):
      # Log(dir(request))
      # Log(request.user_agent)
      # Log(request.url)
      # Log(request.path)
      # Log(request.headers)
      # Log(request.access_route)
      # Log(request.host_url)
      # Log(request.referrer)
      return func(*args, **kwargs)
   return w1




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

    
def pathn(name):
   """."""
   try:
      return render_template(f"{name[1]}/index.html", args={"name" : name, "scripts":files})
   except:
      return 404

for filename in files:
    app.add_url_rule("/" + filename[0], defaults={"name": filename}, view_func=pathn)


@app.route("/sample/<path>")
def getsample(path):
   """."""
   p = f"static/CanvasWorld/{path}/sample.gif"
   if not os.path.isfile(p):
      p = "static/images/404.gif"
   return send_file(p, mimetype='image/gif')


@app.route('/')
@wrap
def method_name():
   return render_template(".index.html", files = files)




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)


