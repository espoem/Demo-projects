async function part1(): Promise<number> {
  const inputFile = Bun.file("../input.txt");
  const fileContents = await inputFile.text();
  const lines = fileContents.split("\n");
  let total = 0;

  for (const line of lines) {
    const digits = line.match(/\d/g);
    if (digits) {
      total += Number.parseInt(`${digits[0]}${digits[digits.length - 1]}`);
    }
  }

  return total;
}

async function part2(): Promise<number> {
  const inputFile = Bun.file("../input.txt");
  const fileContents = await inputFile.text();
  const lines = fileContents.split("\n");
  let total = 0;
  const wordsToDigits: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero: "0",
  };

  const numbers: number[] = lines.map((line) => {
    const digits: string[] = [];
    let i = 0;
    while (i < line.length) {
      for (const [word, digit] of Object.entries(wordsToDigits)) {
        if (line.startsWith(word, i)) {
          digits.push(digit);
          break;
        }
      }
      if (line[i].match(/\d/)) {
        digits.push(line[i]);
      }
      i++;
    }

    return Number.parseInt(digits[0] + digits[digits.length - 1]);
  });

  return numbers.reduce((sum, number) => sum + number, 0);
}

async function main() {
  const res1 = await part1();
  console.log(res1, res1 === 54667);

  const res2 = await part2();
  console.log(res2, res2 === 54203);
}

main();
