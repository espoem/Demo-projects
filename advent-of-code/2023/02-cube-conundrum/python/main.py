import typing
import dataclasses

Color = typing.Literal["red", "green", "blue"]


@dataclasses.dataclass
class CubeSet:
    color: Color
    count: int

    @staticmethod
    def parse(input_string: str) -> "CubeSet":
        count, color = input_string.split(" ")
        return CubeSet(color=color, count=int(count))  # type: ignore


@dataclasses.dataclass
class GameSet:
    cubes: list[CubeSet]

    @staticmethod
    def parse(input_string: str) -> "GameSet":
        cubes = [CubeSet.parse(cube.strip()) for cube in input_string.split(",")]
        return GameSet(cubes=cubes)


@dataclasses.dataclass
class Game:
    id: int
    game_sets: list[GameSet]

    @staticmethod
    def parse(input_string: str) -> "Game":
        parts = input_string.split(":")
        game_id = parts[0].split(" ")[-1]
        sets = [GameSet.parse(cubes.strip()) for cubes in parts[1].split(";")]
        return Game(id=int(game_id), game_sets=sets)


def parse_input() -> list[Game]:
    games: list[Game] = []
    with open("../input.txt", "r") as f:
        games.extend(Game.parse(line) for line in f)

    return games


def game_color_max_counts(game: Game) -> dict[Color, int]:
    return {
        color: max(
            (
                cube.count
                for game_set in game.game_sets
                for cube in game_set.cubes
                if cube.color == color
            ),
            default=0,
        )
        for color in ("blue", "green", "red")
    }


def is_possible_game_part1(game: Game) -> bool:
    max_counts = game_color_max_counts(game)
    return (
        max_counts["red"] <= 12
        and max_counts["green"] <= 13
        and max_counts["blue"] <= 14
    )


def set_power(game: Game) -> int:
    max_counts = game_color_max_counts(game)
    return max_counts["red"] * max_counts["green"] * max_counts["blue"]


def solution_part1():
    games = parse_input()
    id_sum = sum(game.id for game in games if is_possible_game_part1(game))
    print(id_sum)
    assert id_sum == 2105


def solution_part2():
    games = parse_input()
    total_power = sum(set_power(game) for game in games)
    print(total_power)
    assert total_power == 72422


if __name__ == "__main__":
    solution_part1()
    solution_part2()
