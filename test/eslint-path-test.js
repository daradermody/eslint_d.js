/*eslint-env mocha*/
'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const resolver = require('../lib/resolver');
const eslint_path = require('../lib/eslint-path');

describe('eslint-path', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('without eslint_path', () => {

    it('resolves eslint using the given cwd', () => {
      sinon.replace(resolver, 'resolve', sinon.fake.returns('/some/eslint'));

      const result = eslint_path.resolve('some/cwd');

      assert.calledOnceWith(resolver.resolve, 'eslint', {
        paths: ['some/cwd']
      });
      assert.equals(result, '/some/eslint');
    });

    it('resolves eslint without given cwd if that failed', () => {
      sinon.replace(resolver, 'resolve', sinon.fake((_, options) => {
        if (options) {
          throw new Error('Module not found');
        }
        return '/some/eslint';
      }));

      const result = eslint_path.resolve('some/cwd');

      assert.calledTwice(resolver.resolve);
      assert.calledWith(resolver.resolve, 'eslint', { paths: ['some/cwd'] });
      assert.calledWithExactly(resolver.resolve, 'eslint');
      assert.equals(result, '/some/eslint');
    });

  });

  describe('with eslint_path', () => {

    it('resolves eslint using the given cwd', () => {
      sinon.replace(resolver, 'resolve',
        sinon.fake.returns('/some/other-eslint-path'));

      const result = eslint_path.resolve('some/cwd', './other-eslint-path');

      assert.calledOnceWith(resolver.resolve, './other-eslint-path', {
        paths: ['some/cwd']
      });
      assert.equals(result, '/some/other-eslint-path');
    });

    it('resolves eslint without given cwd if that failed', () => {
      sinon.replace(resolver, 'resolve', sinon.fake((_, options) => {
        if (options) {
          throw new Error('Module not found');
        }
        return '/some/other-eslint-path';
      }));

      const result = eslint_path.resolve('some/cwd', './other-eslint-path');

      assert.calledTwice(resolver.resolve);
      assert.calledWith(resolver.resolve, './other-eslint-path', {
        paths: ['some/cwd']
      });
      assert.calledWithExactly(resolver.resolve, './other-eslint-path');
      assert.equals(result, '/some/other-eslint-path');
    });

  });
});
