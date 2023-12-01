# https://adventofcode.com/2022/day/2

MOVES = {
    'A' : 'R',
    'B' : 'P',
    'C' : 'S',
    'X' : 'R',
    'Y' : 'P',
    'Z' : 'S'
}

SCORES = {
    'R' : 1,
    'P' : 2,
    'S' : 3
}

WIN_MOVE = {
    'R': 'P',
    'P' : 'S',
    'S' : 'R'
}

def outcome_score(opponent, you):
    print(opponent, you)
    match (you, opponent):
        case ('R', 'S') | ('S', 'P') | ('P', 'R'):
            return 6 + SCORES[you]
        case _ if opponent == you:
            return 3 + SCORES[you]
        case _:
            return SCORES[you]

def outcome_score_2(opponent, strategy):
    _opponent = MOVES[opponent]
    match strategy:
        case 'Z':
            you = WIN_MOVE[_opponent]
            print("WIN")
        case 'Y':
            you = _opponent
            print("DRAW")
        case _:
            print("LOSE")
            you = [move for move in SCORES.keys() if (move != WIN_MOVE[_opponent] and move != _opponent)][0]

    return outcome_score(_opponent, you)
    

with open('input.txt') as f:
    total_score = 0
    total_score_2 = 0
    for line in f:
        (opponent, you) = line.strip().split(" ")
        total_score = total_score + outcome_score(MOVES[opponent], MOVES[you])
        total_score_2 = total_score_2 + outcome_score_2(opponent, you)


print(total_score_2)