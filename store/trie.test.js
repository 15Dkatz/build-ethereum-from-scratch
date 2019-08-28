const Trie = require('./trie');
const { keccakHash } = require('../util');

describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('has a rootHash', () => {
    expect(trie.rootHash).not.toBe(undefined);
  });

  describe('put()', () => {
    it('stores a value under a key', () => {
      const key = 'foo';
      const value = 'bar';
      trie.put({ key, value });

      expect(trie.get({ key })).toEqual(value);
    });

    it('generates a new root hash after entering the value', () => {
      const originalRootHash = trie.rootHash;

      trie.put({ key: 'foo', value: 'bar' });

      expect(trie.rootHash).not.toEqual(originalRootHash);
    });
  });

  describe('get()', () => {
    it('returns a copy of the stored value', () => {
      const key = 'foo';
      const value = { one: 1 };
      trie.put({ key, value });
      const gottenValue = trie.get({ key });
      value.one = 2;

      expect(gottenValue).toEqual({ one: 1 });
    });
  });

  describe('buildTrie()', () => {
    it('builds a trie where the items are accessible with their hashes', () => {
      const item1 = { foo: 'bar' };
      const item2 = { foo2: 'bar2' };

      trie = Trie.buildTrie({ items: [item1, item2] });

      expect(trie.get({ key: keccakHash(item1) })).toEqual(item1);
      expect(trie.get({ key: keccakHash(item2) })).toEqual(item2);
    });
  });
});