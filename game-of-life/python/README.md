# Game of Life

This is a Python implementation of Conway's Game of Life.

## Description

The `main.py` file contains the main logic for running the Game of Life simulation. It includes functions for initializing the grid, updating the grid based on the rules of the game, and drawing the grid on a canvas.

## Rules

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
