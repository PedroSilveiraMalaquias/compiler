import { BlockElement } from '../Semantic/tokenClasses';

export class Scope {
	private blocks: BlockElement[] = [];
	private blockTail: BlockElement[];
	private currLevel: number;
	private labelId: number;
	public nFuncs: number = 0;

	constructor() {
		this.currLevel = 0;
		this.labelId = 0;
	}

	search(id: number): BlockElement | null {
		let block: BlockElement | null = this.blocks[this.currLevel];
		while (block !== null) {
			if (block.id === id) {
				return block;
			} else {
				block = block.next || null;
			}
		}
		return null;
	}

	find(id: number): BlockElement | null {
		let block: BlockElement | null;
		for (let i = 0; i < this.currLevel + 1; i++) {
			block = this.search(id);
			if (block !== null) {
				return block;
			}
		}
		return null;
	}

	define(id: number): BlockElement {
		let blockElement = new BlockElement(id);
		if (!this.blocks[this.currLevel]) {
			this.blocks[this.currLevel] = blockElement;
			this.blockTail[this.currLevel] = blockElement;
		} else {
			this.blockTail[this.currLevel].next = blockElement;
			this.blockTail[this.currLevel] = blockElement;
		}
		return blockElement;
	}

	newBlock(): number {
		this.currLevel++;
		return this.currLevel;
	}

	endBlock(): number {
		this.blocks.pop();
		this.blockTail.pop();
		this.currLevel--;
		return this.currLevel;
	}

	newLabel(): number {
		return this.labelId++;
	}
}
