from flask import Flask, render_template, request
from flask_cors import CORS

class VueFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(variable_end_string = "%%",
                              variable_start_string = "%%"))

app = VueFlask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})

@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host = "127.0.0.1",port = "5000",debug =True)

