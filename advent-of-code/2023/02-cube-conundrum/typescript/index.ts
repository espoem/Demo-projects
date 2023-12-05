type Color = "red" | "green" | "blue";

class CubeSet {
  constructor(public color: Color, public count: number) {}

  static parse(input: string): CubeSet {
    const [count, color] = input.split(" ");
    return new CubeSet(color as Color, Number.parseInt(count));
  }
}

class GameSet {
  constructor(public cubes: CubeSet[]) {}

  static parse(input: string): GameSet {
    const cubes = input.split(",").map((cube) => CubeSet.parse(cube.trim()));
    return new GameSet(cubes);
  }
}

class Game {
  constructor(public id: number, public sets: GameSet[]) {}

  static parse(input: string): Game {
    const parts = input.split(":");
    const id = Number.parseInt(parts[0].split(" ")[1]);
    const sets = parts[1]
      .split(";")
      .map((cubes) => GameSet.parse(cubes.trim()));
    return new Game(id, sets);
  }
}

async function parseInput(): Promise<Game[]> {
  const games: Game[] = [];
  const input = Bun.file("../input.txt");
  const lines = (await input.text()).split("\n");
  for (const line of lines) {
    games.push(Game.parse(line));
  }
  return games;
}

function gameColorMaxCounts(game: Game): Record<Color, number> {
  const maxCounts: Record<Color, number> = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const set of game.sets) {
    for (const cube of set.cubes) {
      if (cube.color === "red") {
        maxCounts.red = Math.max(maxCounts.red, cube.count);
      } else if (cube.color === "green") {
        maxCounts.green = Math.max(maxCounts.green, cube.count);
      } else if (cube.color === "blue") {
        maxCounts.blue = Math.max(maxCounts.blue, cube.count);
      }
    }
  }

  return maxCounts;
}

function isPossibleGamePart1(game: Game): boolean {
  const counts = gameColorMaxCounts(game);
  return counts.red <= 12 && counts.green <= 13 && counts.blue <= 14;
}

function gameSetPower(game: Game): number {
  const counts = gameColorMaxCounts(game);
  return counts.red * counts.green * counts.blue;
}

async function solutionPart1() {
  const games = await parseInput();
  const sum = games
    .filter(isPossibleGamePart1)
    .reduce((sum, game) => sum + game.id, 0);
  console.log(sum, sum === 2105);
}

async function solutionPart2() {
  const games = await parseInput();
  const totalPower = games.reduce((sum, game) => sum + gameSetPower(game), 0);
  console.log(totalPower, totalPower === 72422);
}

async function main() {
  await solutionPart1();
  await solutionPart2();
}

main();
