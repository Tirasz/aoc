# Lowercase item types a through z have priorities 1 through 26.
# Uppercase item types A through Z have priorities 27 through 52.
# a-z: 97 - 122
# A-Z: 65 - 90

def priority(c):
    code = ord(c)
    return (code - 38) if code <= 90 else (code - 96)

with open('input.txt') as f:
    sum = 0
    for line in f:
        line = line.strip()
        
        half = int((len(line) / 2))
        set_1 = set(line[0:half])
        set_2 = set(line[half:])
        
        common = set_1 & set_2
        for c in common:
            sum = sum + priority(c)

with open('input.txt') as f:
    sum_2 = 0
    common = []
    count = 0
    for line in f:
        count += 1
        line = line.strip()
        if(count % 3 == 1):
            common.append(set(line))
        else:
            common[-1] = set(line).intersection(common[-1])

    for s in common:
        for c in s:
            sum_2 += priority(c)
        
        


        


print(f"1: {sum}")
print(f"2: {sum_2}")