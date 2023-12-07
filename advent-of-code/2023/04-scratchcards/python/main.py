import dataclasses
import re


@dataclasses.dataclass
class Card:
    id: int
    winning_numbers: set[int]
    numbers: set[int]
    matches_count: int = dataclasses.field(init=False, default=0)
    points: int = dataclasses.field(init=False)  # type: ignore

    def __post_init__(self):
        self.matches_count = len(self.winning_numbers.intersection(self.numbers))
        self.points = 0 if self.matches_count == 0 else 1 << (self.matches_count - 1)

    @staticmethod
    def parse(line: str) -> "Card":
        id_part, numbers_part = line.split(":")
        card_id = int(id_part.split(" ")[-1])
        winning_numbers, numbers = numbers_part.split("|")
        winning_numbers = {int(num) for num in re.findall(r"\d+", winning_numbers)}
        numbers = {int(num) for num in re.findall(r"\d+", numbers)}

        return Card(id=card_id, winning_numbers=winning_numbers, numbers=numbers)


def solution():
    with open("../input.txt", "r") as file:
        cards = [Card.parse(line.strip()) for line in file]

    # Part 1
    total_points = sum(card.points for card in cards)
    print(total_points, total_points == 25231)

    # Part 2
    counts = [1] * len(cards)

    for i, card in enumerate(cards):
        for count in range(1, min(card.matches_count + 1, len(cards) - i)):
            counts[i + count] += counts[i]

    total_counts = sum(counts)
    print(total_counts, total_counts == 9721255)


if __name__ == "__main__":
    solution()
