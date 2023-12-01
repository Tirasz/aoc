from anytree import Node, RenderTree, NodeMixin, find, LevelOrderIter

ROOT = Node("root")
CURRENT_NODE = ROOT

def cd(dir):
    global ROOT, CURRENT_NODE

    if dir == "..":
        CURRENT_NODE = CURRENT_NODE.parent
        return

    child = find(CURRENT_NODE, lambda node: node.name == dir and node.parent == CURRENT_NODE)
    if not child:
        new_dir = Node(dir, parent=CURRENT_NODE)
        CURRENT_NODE = new_dir
        return

    CURRENT_NODE = child


def calc_size(dir_node : Node):
    if dir_node.is_leaf:
        return dir_node.size

    sum = 0
    for child in dir_node.children:
        sum += calc_size(child)
    dir_node.size = sum
    return sum


with open('input.txt') as f:
    for line in f:
        if line.startswith('$ cd'):
            cd(line.strip().split(' ')[-1])
        if line.startswith('dir'):
           Node(line.strip().split(' ')[-1], parent=CURRENT_NODE)
        elif not line.startswith('$'):
            size, name = line.strip().split(' ')
            new_file = Node(name, parent=CURRENT_NODE)
            new_file.size = int(size)

calc_size(ROOT)

sum = 0
for node in LevelOrderIter(ROOT):
    if not node.is_leaf and node.size <= 100000:
        sum += node.size

print(f"1: {sum}")

TO_DELETE = 30000000 - (70000000 - ROOT.size)
smallest = ROOT
for node in LevelOrderIter(ROOT):
    if (not node.is_leaf) and node.size >= TO_DELETE and node.size < smallest.size:
        smallest = node

print(f"2: {smallest.size}")