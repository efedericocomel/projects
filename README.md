# Simple Tennis Game

This repository contains a small tennis game originally written in Python using `pygame`. It has now been converted to run directly in the browser using HTML5 canvas and JavaScript.

## Playing the Game

Open `index.html` in a web browser. The URL can include a `difficulty` query parameter set to `easy`, `medium`, or `hard` (default is `easy`). For example:

```
index.html?difficulty=medium
```

Use the **Up** and **Down** arrow keys to move your player on the left side. Keep the rally going and try to outscore the computer opponent.

You can still run the original Python version with `pygame` by executing:

```
python tennis_game.py [difficulty]
```

which requires Python 3 and `pygame` installed.
