
STACKS = {}

def move(amount, _from, to):
    amount = int(amount)
    _from = int(_from)
    to = int(to)
    for _ in range(amount):
        _move(_from-1, to-1)

def _move(_from, to):
    element = STACKS[_from].pop()
    STACKS[to].append(element)

def move_2(amount, _from, to):
    amount = int(amount)
    _from = int(_from) - 1
    to = int(to) - 1

    elements = []
    for _ in range(amount):
        elements.append(STACKS[_from].pop())
    for i in range(len(elements)-1, -1, -1):
        STACKS[to].append(elements[i])



with open('input.txt') as f:
    crates = []
    curr_line = f.readline()
    while curr_line != "\n":
        crates.append(curr_line.rstrip('\n'))
        curr_line = f.readline()

    for i in range(len(crates)-2, -1, -1):
        stack_rows = (crates[i].replace('[', ' ').replace(']', ' ')[1:])[:-1]
        stacks = stack_rows.split('   ')
        for i in range(len(stacks)):
            if not i in STACKS.keys():
                STACKS[i] = []
            if stacks[i].strip() != '':
                STACKS[i].append(stacks[i].strip())

    curr_line = f.readline()
    while len(curr_line) != 0:
        _, amount, _, _from, _, to = curr_line.split(' ')
        move_2(amount, _from, to)
        curr_line = f.readline()

tops = ''
for key, value in STACKS.items():
    print(f"Top of stack {key+1}: {value[-1]}")
    tops += value[-1]
print(tops)