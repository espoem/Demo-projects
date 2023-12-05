import re


def part_1():
    total = 0
    digit_pattern = re.compile(r"\d")
    with open("../input.txt", "r") as f:
        for line in f:
            if digits := digit_pattern.findall(line):
                total += int(digits[0] + digits[-1])
    return total


def part_2():
    words_to_digits = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9",
        "zero": "0",
    }

    with open("../input.txt", "r") as f:
        lines = f.readlines()

    numbers = []
    for line in lines:
        digits = []
        i = 0
        while i < len(line):
            for word, digit in words_to_digits.items():
                if line.startswith(word, i):
                    digits.append(digit)
                    break
            else:
                if line[i].isdigit():
                    digits.append(line[i])
            i += 1

        numbers.append(int(digits[0] + digits[-1]))

    return sum(numbers)


if __name__ == "__main__":
    res_1 = part_1()
    print(res_1)

    res_2 = part_2()
    print(res_2)
