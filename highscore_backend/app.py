from flask import Flask, request, Response, send_file, jsonify
import sqlite3

db = sqlite3.connect('highscores.db')

app = Flask(__name__)

@app.route('/add_score', methods=['POST'])
def add_score():
    vals = request.get_json()

    name, score = vals['name'], vals['score']

    with db:
        db.execute('insert into scores values (?, ?);', (name, score))

    return Response()

@app.route('/')
def get_scores():
    cur = db.cursor()
    cur.execute('select * from scores order by -score limit 10');

    result = [{'name': n, 'score': s} for n, s in cur.fetchall()]

    return jsonify(result)

