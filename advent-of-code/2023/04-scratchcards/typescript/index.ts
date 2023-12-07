class Card {
  matchesCount: number;
  points: number;

  constructor(
    public id: number,
    public winningNumbers: Set<number>,
    public numbers: Set<number>
  ) {
    this.matchesCount = [...this.winningNumbers].filter((x) =>
      this.numbers.has(x)
    ).length;
    this.points =
      this.matchesCount === 0 ? 0 : Math.pow(2, this.matchesCount - 1);
  }

  static parse(line: string): Card {
    const [idPart, numbersPart] = line.split(":");
    const id = Number.parseInt(idPart.split(" ").pop()!);
    const [winningNumbersStr, numbersStr] = numbersPart.split("|");
    const winnningNumbers = new Set(
      winningNumbersStr.match(/\d+/g)!.map(Number)
    );
    const numbers = new Set(numbersStr.match(/\d+/g)!.map(Number));

    return new Card(id, winnningNumbers, numbers);
  }
}

async function solution(): Promise<void> {
  const lines = (await Bun.file("../input.txt").text()).split("\n");
  const cards = lines.map((line) => Card.parse(line));

  // Part 1
  const totalPoints = cards.reduce((sum, card) => sum + card.points, 0);
  console.log(totalPoints, totalPoints === 25231);

  // Part 2
  const counts = Array(cards.length).fill(1);

  cards.forEach((card, i) => {
    const range = Math.min(card.matchesCount, cards.length - i);
    counts.slice(i + 1, i + 1 + range).forEach((_, idx) => {
      counts[i + 1 + idx] += counts[i];
    });
  });

  const totalCounts = counts.reduce((sum, count) => sum + count, 0);
  console.log(totalCounts, totalCounts === 9721255);
}

solution();
