export class TokenClass {}

export class Var implements TokenClass {
  constructor(public name: string) {}
}

export class tAttribute {
  constructor(public type: TokenClass, public size?: number) {}
}

// class object:
//     def __init__(self, nName = None, pNext = None, eKind = None, _ = None):
//         self.nName = nName
//         self.pNext = pNext
//         self.eKind = eKind
//         self._ = None

export class objectType implements TokenClass {
  constructor(
    public id: number,
    public next: objectType,
    public kind: string,
    public obj: TokenClass
  ) {}
}
