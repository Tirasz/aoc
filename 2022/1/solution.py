# https://adventofcode.com/2022/day/1

CALORIES = {}
ELVES = 0
CALORIES[0] = 0

with open('input.txt') as f:
    for line in f:
        if not line.strip():
            ELVES += 1
            CALORIES[ELVES] = 0
            continue
        CALORIES[ELVES] += int(line)


sorted = list(CALORIES.values())
sorted.sort()
print(sorted[-1])
print(sorted[-1] + sorted[-2] + sorted[-3])
