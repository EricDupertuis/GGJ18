# Creating the db

sqlite3 -line highscores.db 'create table scores (name text, score integer);'

# Adding a score

post to /add_score json encoded object with "name" and "score" as attribute.

# Fetching highscores

Get from "/", returns a JSON array of objects with name and scores.
It returns the 10 best high scores, already sorted.

# Running the docker imagejo

It exposes a port to which you can bind (4000).
