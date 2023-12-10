"""."""
import hashlib
import os
import random
import smtplib
import string
from datetime import datetime
from collections import OrderedDict
# import dataset
from flask import (Flask, abort, flash, json, jsonify,
                   render_template, request, send_file, session, url_for, redirect, send_from_directory)
from PyLog import Log, Logger
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from hashlib import sha256, md5

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


app = Flask(__name__, template_folder="static/CanvasWorld")
app.debug = True
app.jinja_env.add_extension('jinja2.ext.do')

Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["50/minute"]
)


keys = ["5393e52062e4cafb1f5f7674263084cc", "283ec960be647c9bcfe138552fb1fb0d"]

app.secret_key = "asdfasdf8904afasdf8904afb0deb0deasd"
# app["files"] =[[secure_filename(x.name),x.name, datetime.fromtimestamp(x.stat().st_ctime).strftime('%Y-%m-%d')] for x in os.scandir("static/CanvasWorld") if x.is_dir() and not x.name.startswith(".")]
# app["files"].sort(key=lambda tup: tup[2])


# key = 'pbkdf2:sha256:50000$kcKh6aKg$2df02e4cc530afad0e67f3b9f3b27e0aba561cfdaf91866814b3aa56acd86fee'
# k = check_password_hash(key, "LNca8HA9DYrBtpe4")
# Log(k)

# db = dataset.connect("sqlite:///logs.db?check_same_thread=false")

# logs = db["logs"]

# keys = ''.join([random.choice(string.hexdigits) for x in range(random.randrange(20, 30))])
# with open(".h", "w+") as f:
#    f.write(keys + "\n")
# keys = hashlib.md5(keys.encode()).hexdigest()


class Tree:
    """."""

    def __init__(self):
        """."""
        self.files = [[secure_filename(x.name), x.name, datetime.fromtimestamp(x.stat().st_ctime).strftime(
            '%Y-%m-%d')] for x in os.scandir("static/CanvasWorld") if x.is_dir() and not x.name.startswith(".")]
        self.files.sort(key=lambda tup: tup[1])

    def reload(self):
        """."""
        self._files = [[secure_filename(x.name), x.name, datetime.fromtimestamp(x.stat().st_ctime).strftime(
            '%Y-%m-%d')] for x in os.scandir("static/CanvasWorld") if x.is_dir() and not x.name.startswith(".")]
        self._files.sort(key=lambda tup: tup[1])


t = Tree()


def log():
    """."""
    ...
    # logs.insert(dict(
    #     time=datetime.now(),
    #     referrer=request.referrer,
    #     path=request.url,
    #     ip=request.remote_addr,
    #     env_ip=request.environ['REMOTE_ADDR']
    # ))

# @app.route("/admin/<key>")
# def add(key=None):
#    """."""
#    if key:
#       if hashlib.md5(key.encode()).hexdigest() == keys:
#          return render_template(".admin.html", logs=[x for x in logs.all()])

#    return "", 502


@app.route("/static/CanvasWorld/.index.html")
@app.route("/static/CanvasWorld/.login.html")
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
        return render_template(f"{name[1]}/index.html", args={"name": name, "v": request.args.get("v"), "scripts": t.files})
    except Exception as exc:
        Log(exc)
        return "", 404


for filename in t.files:
    app.add_url_rule(
        "/" + filename[0], defaults={"name": filename}, view_func=pathn)


# @app.route("/<path>")
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


# @app.route("/db")
# def _db():
#     """."""
#     if session.get("auth") == True:
#         return jsonify([OrderedDict(x) for x in logs.all()])
#     return "",  401


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    """."""
    if request.method == 'POST':

        def hash(sr):
            """."""
            md = md5()
            md.update(sr.encode("utf8"))
            return md.hexdigest()

        m1 = request.args.get("c") or request.values.get("c")
        m2 = request.args.get("c1") or request.values.get("c1")
        if keys[0] == hash(m1) and keys[1] == hash(m2):
            session["auth"] = True
        return "", (200 if session.get("auth") == True else 401)

    if session.get("auth") == True:
        return render_template(".admin.html")
    return render_template(".login.html")


@app.route("/logout")
def logout():
    """."""
    session["auth"] = False
    flash("Successfully logged out.")
    return redirect("/admin")


@app.route('/')
def index():
    log()

    if request.args.get('hard'):
        Log("Reloding")
        t.reload()
    return render_template(".index.html", files=t.files)


# @app.route('/rem')
# def dbconn():
#     """."""
#     if not session.get('auth'):
#         return "", 404
#     args = request.args.get('id')
#     result = logs.delete(id=args)
#     Log(result)
#     return jsonify({"successful": bool(result)})


@app.route('/robots.txt')
@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


@app.route("/test")
def test():
    """."""
    return render_template(".test.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
