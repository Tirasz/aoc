import { Result, Solution } from '../types';

class DAG {
  private adjacencyList: Map<string, string[]> = new Map<string, string[]>();

  addNode(node: string) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }

  addRule(from: string, to: string) {
    this.addNode(from);
    this.addNode(to);
    this.adjacencyList.get(from)!.push(to);
  }

  topologicalSort(): string[] {
    const visited = new Set<string>();
    const result: string[] = [];
    const visiting = new Set<string>();

    const visit = (node: string): void => {
      console.log('Visiting: ', node)
      if (visiting.has(node)) {
        return
        //throw new Error(`Graph contains a cycle, so topological sorting is not possible. ${node}`);
      }
      if (!visited.has(node)) {
        visiting.add(node);
        const neighbors = this.adjacencyList.get(node) || [];
        for (const neighbor of neighbors) {
          visit(neighbor);
        }
        visiting.delete(node);
        visited.add(node);
        result.push(node);
      }
    };

    for (const node of this.adjacencyList.keys()) {
      if (!visited.has(node)) {
        visit(node);
      }
    }
    return result.reverse();
  }

  isOrderValid(order: string[]): boolean {
    const filtered = order.filter(s => this.adjacencyList.get(s));
    for (let i = 1; i < filtered.length; i++) {
      for (let k = i - 1; k >= 0; k--) {
        if (this.adjacencyList.get(filtered[i])!.includes(filtered[k])) {
          return false;
        }
      }
    }
    return true;
  }

  sort(a: string, b: string) {
    const isAbeforeB = this.adjacencyList.get(a)!.includes(b);
    const isBbeforeA = this.adjacencyList.get(b)!.includes(a);
    return isAbeforeB ? -1 : isBbeforeA ? 1 : 0;
  }
}

export default class DayFive extends Solution {

  private processInput(input: string) {
    const rules: { from: string, to: string }[] = [];
    const updates: string[] = [];
    let isRules = true;
    for (const line of input.split('\n').map(line => line.trim())) {
      if (line === '') {
        isRules = false;
        continue;
      }
      if (isRules) {
        const [from, to] = line.split('|').map(str => str.trim());
        rules.push({ from, to });
      } else {
        updates.push(line);
      }
    }
    return { rules, updates };
  }

  firstHalf(input: string): Result {
    const { rules, updates } = this.processInput(input);
    const graph = new DAG();
    rules.forEach(rule => graph.addRule(rule.from, rule.to));
    return updates
      .map(update => update.split(',').map(s => s.trim()).filter(Boolean))
      .filter(update => graph.isOrderValid(update))
      .map(update => update.map(n => Number(n)))
      .reduce((acc, update) => {
        return acc + update[Math.floor(update.length / 2)];
      }, 0);
  }

  secondHalf(input: string): Result {
    const { rules, updates } = this.processInput(input);
    const graph = new DAG();
    rules.forEach(rule => graph.addRule(rule.from, rule.to));

    return updates
      .map(updates => updates.split(',').map(s => s.trim()).filter(Boolean))
      .filter(update => !graph.isOrderValid(update))
      .map(update => update.sort((a, b) => graph.sort(a, b)))
      // They just had to put a cycle in there lol
      // .map(update => {
      //   const newOrder: string[] = [];
      //   for (let i = 0; i < correctOrder.length; i++) {
      //     while (update.includes(correctOrder[i])) {
      //       newOrder.push(correctOrder[i]);
      //       update.splice(update.indexOf(correctOrder[i]), 1);
      //     }
      //   }
      //   return newOrder;
      // })
      .map(update => update.map(n => Number(n)))
      .reduce((acc, update) => {
        return acc + update[Math.floor(update.length / 2)];
      }, 0);
  }
}