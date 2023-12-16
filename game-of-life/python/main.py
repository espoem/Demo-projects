import itertools
import random
import tkinter as tk
from typing import Literal

WIDTH = 1024
HEIGHT = 768
GRID_CELL_SIZE = 20

ROWS = HEIGHT // GRID_CELL_SIZE
COLS = WIDTH // GRID_CELL_SIZE


def update_grid():
    if running.get():
        new_grid = [
            [
                1
                if (grid[i][j] == 1 and 2 <= count_neighbors(i, j) <= 3)
                or count_neighbors(i, j) == 3
                else 0
                for j in range(COLS)
            ]
            for i in range(ROWS)
        ]
        grid[:] = new_grid
        draw_grid()
    window.after(int(speed.get()), update_grid)


def draw_grid():
    canvas.delete("all")
    for row, col in itertools.product(range(ROWS), range(COLS)):
        x1, y1 = col * GRID_CELL_SIZE, row * GRID_CELL_SIZE
        x2, y2 = (col + 1) * GRID_CELL_SIZE, (row + 1) * GRID_CELL_SIZE
        fill_color: Literal["black", "white"] = (
            "black" if grid[row][col] == 1 else "white"
        )
        canvas.create_rectangle(x1, y1, x2, y2, fill=fill_color)


def count_neighbors(x, y):
    return sum(
        grid[nx][ny] == 1
        for i in range(-1, 2)
        for j in range(-1, 2)
        if (i or j) and 0 <= (nx := x + i) < ROWS and 0 <= (ny := y + j) < COLS
    )


def randomize_grid():
    grid[:] = [[random.choice([0, 1]) for _ in row] for row in grid]
    draw_grid()


def toggle_running():
    running.set(not running.get())
    pause_button.config(text="Pause" if running.get() else "Resume")


# Create the main window
window = tk.Tk()
window.title("Game of Life")

grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
speed = tk.DoubleVar(value=150)
running = tk.BooleanVar(value=True)

# Create the canvas
canvas = tk.Canvas(window, width=WIDTH, height=HEIGHT)
canvas.pack()

# Create sliders
slider_frame = tk.Frame(window)
slider_frame.pack()
speed_slider = tk.Scale(
    slider_frame,
    from_=10,
    to=1000,
    orient=tk.HORIZONTAL,
    length=WIDTH // 4,
    label="Render speed (ms)",
    variable=speed,
)
speed_slider.pack()

# Create the buttons
button_frame = tk.Frame(window)
button_frame.pack()
pause_button = tk.Button(button_frame, text="Pause", command=toggle_running)
pause_button.pack(side=tk.LEFT)
pause_button.config(text="Pause" if running.get() else "Resume")
stop_button = tk.Button(button_frame, text="Stop", command=window.destroy)
stop_button.pack(side=tk.LEFT)
randomize_button = tk.Button(button_frame, text="Randomize", command=randomize_grid)
randomize_button.pack(side=tk.LEFT)

# Start the game
randomize_grid()
update_grid()

# Start the main loop
window.mainloop()
