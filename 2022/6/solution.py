MOST_RECENT = []
MARKER_LENGTH = 14 # 4 

with open('input.txt') as f:
    datastr = f.readline()
    for i in range(len(datastr)):
        if len(MOST_RECENT) < MARKER_LENGTH:
            MOST_RECENT.append(datastr[i])
        else:
            MOST_RECENT[i%MARKER_LENGTH] = datastr[i]
        if len(set(MOST_RECENT)) == MARKER_LENGTH:
            break
    print(i + 1)
    
        

