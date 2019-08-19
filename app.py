from flask import Flask, request, session, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from boggle import Boggle


app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def load_game():
    board = boggle_game.make_board()
    session['game'] = board

    return render_template('index.html', board=board)


# route to check guess 
@app.route('/check-word')
def check_word_guess():
    word = request.args.get('word')

    result = boggle_game.check_valid_word(session['game'], word)
    return jsonify(result=result)


# route to update stats: highscore and total number of games played 
@app.route('/check-stats', methods=["POST"])
def check_stats():    
    game_count = session.get('count', 0)
    session['count'] = game_count + 1
    
    score = request.json['score']
    highscore = session.get('score', 0)
    
    if highscore < score:
        session['score'] = score

    return jsonify(highscore=session['score'], game_count=session['count'])

# route to retrieve stats
@app.route('/get-stats')
def get_stats():
    return jsonify(highscore=session.get('score', 0), game_count=session.get('count', 0))