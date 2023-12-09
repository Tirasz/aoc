import { Result, Solution } from '../types';


class Node {
  value: string;
  left: Node | null = null;
  right: Node | null = null;
  childStr: string[];

  constructor(value: string, childStr: string[]) {
    this.value = value;
    this.childStr = childStr;
  }
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export default class DayEight extends Solution {

  nodeMap = new Map<string, Node>();
  instructions: string = '';

  init(input: string) {
    const lines = input.split('\n')
    this.instructions = lines[0].trim();
    const nodesStr = lines.splice(2);

    nodesStr.forEach(line => {
      const [nodeValue, childrenStr] = line.split('=').map(s => s.trim());
      const children = childrenStr.slice(1, childrenStr.length - 1).split(',').map(s => s.trim())
      this.nodeMap.set(nodeValue, new Node(nodeValue, children));
    });

    this.nodeMap.forEach((node, str) => {
      const [leftValue, rightValue] = node.childStr;
      node.left = this.nodeMap.get(leftValue)!;
      node.right = this.nodeMap.get(rightValue)!;
    });
  }

  getStepsToFulfill(fromNode: Node, condition: (node: Node) => boolean) {
    let currentNode = fromNode;
    let steps = 0;
    while (!condition(currentNode)) {
      const currentInstruction = steps % this.instructions.length;
      currentNode = this.instructions[currentInstruction] === 'R' ? currentNode.right! : currentNode.left!;
      steps++;
    }
    return steps;
  }

  firstHalf(input: string): Result {
    this.init(input);
    const condition = (node) => node.value === 'ZZZ';
    return this.getStepsToFulfill(this.nodeMap.get('AAA')!, condition);
  }

  secondHalf(input: string): Result {
    this.init(input);
    const currentNodes: Node[] = Array.from(this.nodeMap.keys()).filter(key => key.endsWith('A')).map(key => this.nodeMap.get(key)!);
    const stepsMap = new Map<Node, number>();
    const condition = (node: Node) => node.value.endsWith('Z');

    currentNodes.forEach(node => {
      stepsMap.set(node, this.getStepsToFulfill(node, condition));
    })

    const [head, ...tail] = Array.from(stepsMap.values());
    return tail.reduce((result, num) => lcm(result, num), head);
  }


}