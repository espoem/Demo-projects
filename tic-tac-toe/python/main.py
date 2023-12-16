import itertools
import random
import tkinter
from typing import Literal

SIZE = 3


def restart():
    """
    Restarts the game by selecting a new player, updating the label text, and clearing the button texts.

    Args:
        None

    Returns:
        None
    """
    global player

    player = random.choice(characters)
    label.config(text=f"Player {player}'s turn")

    for row, col in itertools.product(range(SIZE), range(SIZE)):
        buttons[row][col].config(text="")


def next_turn(row: int, col: int):
    """
    Updates the game state based on the player's move and checks for a winner or tie.

    Args:
        row (int): The row index of the button clicked.
        col (int): The column index of the button clicked.

    Returns:
        None
    """
    global player

    if buttons[row][col]["text"] or check_winner():
        return

    buttons[row][col]["text"] = player
    winner: bool | Literal['Tie'] = check_winner()

    if not winner:
        player: Literal['X', 'O'] = characters[(characters.index(player) + 1) % 2]
        label.config(text=f"Player {player}'s turn")
    elif winner == "Tie":
        label.config(text="Tie!")
    else:
        label.config(text=f"Player {player} wins!")


def check_winner():
    """
    Checks the game board for a winner or tie.

    Returns:
        bool or str: True if there is a winner, "Tie" if the game is tied, False otherwise.
    """
    # Check rows and columns
    for i in range(SIZE):
        if (
            buttons[i][0]["text"]
            == buttons[i][1]["text"]
            == buttons[i][2]["text"]
            != ""
        ):
            return True
        if (
            buttons[0][i]["text"]
            == buttons[1][i]["text"]
            == buttons[2][i]["text"]
            != ""
        ):
            return True

    # Check diagonals
    if buttons[0][0]["text"] == buttons[1][1]["text"] == buttons[2][2]["text"] != "":
        return True
    if buttons[0][2]["text"] == buttons[1][1]["text"] == buttons[2][0]["text"] != "":
        return True

    # Check for tie or unfinished game
    return (
        "Tie"
        if all(
            buttons[row][col]["text"] != ""
            for row in range(SIZE)
            for col in range(SIZE)
        )
        else False
    )


board = tkinter.Tk()
board.title("Tic-Tac-Toe")
characters: list[Literal["X", "O"]] = ["X", "O"]

player = random.choice(characters)

label = tkinter.Label(text=f"Player {player}'s turn", font=("consolas", 30))
label.pack(side=tkinter.TOP)

new_game_button = tkinter.Button(
    text="New Game", command=restart, font=("consolas", 20)
)
new_game_button.pack(side=tkinter.TOP)

frame = tkinter.Frame(board)
frame.pack()

buttons: list[list[tkinter.Button]] = [[""] * SIZE for _ in range(SIZE)]  # type: ignore

for row, col in itertools.product(range(SIZE), range(SIZE)):
    buttons[row][col] = tkinter.Button(
        frame,
        text="",
        font=("consolas", 40),
        width=5,
        height=2,
        command=lambda row=row, col=col: next_turn(row, col),
    )
    buttons[row][col].grid(row=row, column=col)

board.mainloop()
