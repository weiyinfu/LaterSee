from flask import Flask, request, make_response
import json

app = Flask(__name__)


@app.route("/send_tabs", methods=['POST'])
def send_tabs():
    content = json.loads(request.get_data(as_text=True))
    print(content)
    resp = make_response("ok")
    resp.headers['Access-Control-Allow-Origin'] = "*"
    return resp


if __name__ == '__main__':
    app.run(port=6767)
