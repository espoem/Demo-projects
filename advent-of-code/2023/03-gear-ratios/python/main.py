import dataclasses
import math
import re
from collections import defaultdict
from typing import NamedTuple


class Coord(NamedTuple):
    x: int
    y: int


class CoordSpan(NamedTuple):
    start: Coord
    end: Coord


@dataclasses.dataclass
class Number:
    value: int
    span: CoordSpan
    board: list[str] = dataclasses.field(repr=False)
    _neighborhood: CoordSpan = dataclasses.field(init=False, repr=False, default=None)  # type: ignore

    @property
    def neighborhood(self) -> CoordSpan:
        if self._neighborhood is None:
            start_x = max(self.span.start.x - 1, 0)
            end_x = self.span.end.x + 1
            start_y = max(self.span.start.y - 1, 0)
            end_y = min(self.span.end.y + 2, len(self.board))
            self._neighborhood = CoordSpan(
                start=Coord(x=start_x, y=start_y),
                end=Coord(x=end_x, y=end_y),
            )
        return self._neighborhood

    @staticmethod
    def parse(
        lines: list[str],
        start: Coord,
        end: Coord,
    ) -> "Number":
        value = int("".join(lines[start.y][start.x : end.x]))
        return Number(value=value, span=CoordSpan(start=start, end=end), board=lines)

    @property
    def is_part_number(self):
        return any(
            char not in "0123456789."
            for row in self.board[self.neighborhood.start.y : self.neighborhood.end.y]
            for char in row[self.neighborhood.start.x : self.neighborhood.end.x]
        )

    @property
    def star_position(self):
        for r_off, row in enumerate(
            self.board[self.neighborhood.start.y : self.neighborhood.end.y]
        ):
            for c_off, char in enumerate(
                row[self.neighborhood.start.x : self.neighborhood.end.x]
            ):
                if char == "*":
                    return Coord(
                        x=self.neighborhood.start.x + c_off,
                        y=self.neighborhood.start.y + r_off,
                    )

        return None


def solution():
    with open("../input.txt", "r") as f:
        lines = [line.strip() for line in f.readlines()]

    numbers = [
        Number(
            value=int(match.group()),
            span=CoordSpan(
                start=Coord(x=match.start(), y=row), end=Coord(x=match.end(), y=row)
            ),
            board=lines,
        )
        for row, line in enumerate(lines)
        for match in re.finditer(r"\d+", line)
    ]
    part_numbers = [n for n in numbers if n.is_part_number]
    # Part 1
    result = sum(n.value for n in part_numbers)
    print(result, result == 532331)
    # Part 2
    star_positions = defaultdict(list)
    for n in part_numbers:
        if n.star_position is None:
            continue
        star_positions[n.star_position].append(n.value)
    result = sum(math.prod(x) for x in star_positions.values() if len(x) == 2)
    print(result, result == 82301120)


if __name__ == "__main__":
    solution()
