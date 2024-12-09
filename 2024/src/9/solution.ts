import { Result, Solution } from '../types';

class Block {
  size: number;
  id: undefined | number = undefined;

  constructor(size: number, id?: number) {
    this.size = size;
    this.id = id;
  }

  isFile(): boolean {
    return this.id !== undefined && this.size > 0;
  }

}

class Disk {
  blocks: Block[];

  private parseInput(input: string): Block[] {
    return input.trim().split('').map(Number).map((size, i) => {
      const isFile = i % 2 === 0;
      return new Block(size, isFile ? i / 2 : undefined);
    });
  }

  constructor(input: string) {
    this.blocks = this.parseInput(input);
  }

  fillEmpty(emptyIndex: number, fileIndex: number) {
    const emptyBlock = this.blocks[emptyIndex];
    const fileBlock = this.blocks[fileIndex];
    if (this.blocks[emptyIndex].id !== undefined) {
      throw new Error(`Block ${emptyBlock} is not empty`);
    }

    if (emptyBlock.size === fileBlock.size) {
      //console.log('Filling ', emptyBlock, ' with ', fileBlock, "SWAP");
      swap(emptyIndex, fileIndex, this.blocks);
    } else if (emptyBlock.size > fileBlock.size) {
      const remainingEmptyBlockSize = emptyBlock.size - fileBlock.size;
      //console.log('Filling ', emptyBlock, ' with ', fileBlock, "remainingEmptyBlockSize:", remainingEmptyBlockSize);
      this.blocks[emptyIndex].size = fileBlock.size;
      swap(emptyIndex, fileIndex, this.blocks);
      this.blocks.splice(emptyIndex + 1, 0, new Block(remainingEmptyBlockSize));
    } else {
      const remainingFileBlockSize = fileBlock.size - emptyBlock.size;
      //console.log('Filling ', emptyBlock, ' with ', fileBlock, "remainingFileBlockSize:", remainingFileBlockSize);
      swap(emptyIndex, fileIndex, this.blocks);
      this.blocks[emptyIndex].size = emptyBlock.size;
      this.blocks.splice(fileIndex, 0, new Block(remainingFileBlockSize, fileBlock.id));
    }

  }

  firstEmptyIndex() {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].id === undefined && this.blocks[i].size > 0) {
        return i;
      }
    }
    return -1;
  }

  lastFileIndex() {
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      if (this.blocks[i].id !== undefined) {
        return i;
      }
    }
    return -1;
  }

  isCompact() {
    return this.firstEmptyIndex() === this.lastFileIndex() + 1;
  }

  debug() {
    //console.log(this.blocks.map((b, i) => [i, b]));
    console.log(decompress(this.blocks));
  }
}

function swap<T>(i: number, j: number, arr: T[]) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}


function decompress(blocks: Block[]) {
  const str: string[] = [];
  blocks.forEach(b => {
    for (let i = 0; i < b.size; i++) {
      str.push(b.id !== undefined ? b.id.toString() : '.');
    }
  })
  return str.join('');
}

export default class DayEight extends Solution {

  blocks: Block[] = [];



  firstHalf(input: string): number {
    const disk = new Disk(input);
    while (!disk.isCompact()) {
      const firstEmpty = disk.firstEmptyIndex();
      const lastFile = disk.lastFileIndex();
      disk.fillEmpty(firstEmpty, lastFile);
    }

    return disk.blocks
      .filter(b => b.isFile())
      .map(b => Array.from({ length: b.size }, () => b.id!))
      .flat()
      .reduce((sum, id, index) => {
        return sum + id * index;
      })
  }

  secondHalf(input: string): Result {
    return 0;
  }
}