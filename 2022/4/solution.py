from intervaltree import Interval

# Actually had to modify the Interval class's 'overlaps' method:
    # return begin < self.end and end > self.begin 
    # return begin <= self.end and end >= self.begin

with open('input.txt') as f:
    sum = 0
    sum_2 = 0
    for line in f:
        iv_1, iv_2 = line.strip().split(',')
        iv_1 = tuple(int(c) for c in iv_1.split('-'))
        iv_2 = tuple(int(c) for c in iv_2.split('-'))

        iv_1 = Interval(*iv_1)
        iv_2 = Interval(*iv_2)
        if(iv_1.contains_interval(iv_2) or iv_2.contains_interval(iv_1)):
            sum += 1
        if(iv_1.overlaps(iv_2)):
            sum_2 += 1

print(sum)
print(sum_2)
       
        
