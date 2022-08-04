from flask import Flask, render_template, request
from flask_cors import CORS
from flask import Flask, render_template, json, url_for
import os


class VueFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(variable_end_string = "%%",
                              variable_start_string = "%%"))

app = VueFlask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})

@app.route("/")
def index():
    showjson()
    return render_template("index.html")

@app.route("/model_name")
def showjson():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/json", "model_name.json")
    data = json.load(open(json_url))
    print(data)
    return data
if __name__ == "__main__":
    app.run(host = "127.0.0.1",port = "5000",debug =True)

