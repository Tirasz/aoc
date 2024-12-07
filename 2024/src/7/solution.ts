import { Result, Solution } from '../types';

export class Node {
  value: number;
  parent: Node | null = null;
  children: Node[] | null = null;
  hitTarget: boolean = false;


  constructor(value: number, parent: Node | null = null) {
    this.value = value;
    this.parent = parent;
  }

  addChildrenPartOne(child: number) {
    const [left, right] = [this.value + child, this.value * child];
    this.children = [new Node(left, this), new Node(right, this)];
  }

  markAsHitTarget() {
    let current: Node | null = this;
    while (current) {
      current.hitTarget = true;
      current = current.parent;
    }
  }
}

function childrenPartOne(node: Node, value: number) {
  const [left, right] = [node.value + value, node.value * value];
  return [new Node(left, node), new Node(right, node)];
}

function childrenPartTwo(node: Node, value: number) {
  const results = childrenPartOne(node, value);
  results.push(new Node(Number(node.value.toString() + value.toString()), node));
  return results;
}

function buildTree(root: Node, values: number[], target: number, childrenFn: (node: Node, value: number) => Node[]) {
  const nodesToAddChildren: Node[][] = [[root]];
  const arrayCopy = [...values];
  let currentValue: number | undefined = arrayCopy.shift()!;
  while (nodesToAddChildren.length && currentValue) {
    const currentNodes = nodesToAddChildren.shift();
    const toAdd: Node[] = []

    currentNodes!.forEach(node => {
      node!.children = childrenFn(node!, currentValue!);
      node!.children?.filter(child => child.value <= target).forEach(child => toAdd.push(child));
      node!.children?.filter(child => child.value === target).forEach(child => {
        if (arrayCopy.length === 0) {
          child.markAsHitTarget()
        }
      });
    })

    nodesToAddChildren.push(toAdd);
    currentValue = arrayCopy.shift();
  }
  return root;
}


export default class DaySeven extends Solution {

  private processInput(input: string): { target: number, numbers: number[] }[] {
    return input.split('\n').map(line => {
      const [targetStr, numbersStr] = line.trim().split(':');
      const target = Number(targetStr);
      const numbers = numbersStr.split(' ').map(line => line.trim()).filter(line => line.length).map(Number);
      return { target, numbers };
    })
  }

  firstHalf(input: string): number {
    const equations = this.processInput(input);
    return equations.map(({ target, numbers }) => {
      const root = new Node(numbers.shift()!);
      buildTree(root, numbers, target, childrenPartOne);
      return { root, target };
    }).reduce((sum, { root, target }) => {
      if (root.hitTarget) {
        return sum + target;
      }
      return sum;
    }, 0);
  }

  secondHalf(input: string): Result {
    // Whats wrong with this AAAAAAAA
    const equations = this.processInput(input);
    return equations.map(({ target, numbers }) => {
      const root = new Node(numbers.shift()!);
      buildTree(root, numbers, target, childrenPartTwo);
      return { root, target };
    }).reduce((sum, { root, target }) => {
      if (root.hitTarget) {
        return sum + target;
      }
      return sum;
    }, 0);
  }
}