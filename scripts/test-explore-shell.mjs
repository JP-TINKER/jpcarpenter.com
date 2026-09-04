import assert from 'node:assert/strict';
import test from 'node:test';
import { applyExploreOpen } from '../src/scripts/explore-branch.ts';

function mockEl() {
  const attrs = /** @type {Record<string, string>} */ ({});
  const classSet = new Set();
  return {
    classList: {
      toggle(name, on) {
        if (on) classSet.add(name);
        else classSet.delete(name);
      },
      contains(name) {
        return classSet.has(name);
      },
    },
    hidden: false,
    focused: false,
    setAttribute(k, v) {
      attrs[k] = String(v);
    },
    getAttribute(k) {
      return Object.hasOwn(attrs, k) ? attrs[k] : null;
    },
    removeAttribute(k) {
      delete attrs[k];
    },
    toggleAttribute(k, on) {
      if (on) attrs[k] = '';
      else delete attrs[k];
    },
    hasAttribute(k) {
      return Object.hasOwn(attrs, k);
    },
    focus() {
      this.focused = true;
    },
    _attrs: attrs,
    _classSet: classSet,
  };
}

test('spec-w3-01: closing the drawer removes field inert and restores Menu focus', () => {
  const root = mockEl();
  const explore = mockEl();
  const toggle = mockEl();
  const close = mockEl();
  const backdrop = mockEl();
  const field = mockEl();

  applyExploreOpen(true, {
    root,
    explore,
    toggle,
    close,
    backdrop,
    field,
    mobile: true,
  });
  assert.equal(field.hasAttribute('inert'), true);
  assert.equal(close.focused, true);

  field.focused = false;
  close.focused = false;
  applyExploreOpen(false, {
    root,
    explore,
    toggle,
    close,
    backdrop,
    field,
    mobile: true,
  });
  assert.equal(field.hasAttribute('inert'), false);
  assert.equal(toggle.focused, true);
  assert.equal(root._classSet.has('explore-open'), false);
});

test('spec-w3-01: leaving the phone breakpoint clears field inert without stealing focus', () => {
  const root = mockEl();
  const explore = mockEl();
  const toggle = mockEl();
  const close = mockEl();
  const backdrop = mockEl();
  const field = mockEl();

  applyExploreOpen(true, {
    root,
    explore,
    toggle,
    close,
    backdrop,
    field,
    mobile: true,
  });
  toggle.focused = false;
  close.focused = false;

  applyExploreOpen(false, {
    root,
    explore,
    toggle,
    close,
    backdrop,
    field,
    mobile: false,
  }, { focus: false });

  assert.equal(field.hasAttribute('inert'), false);
  assert.equal(explore.hasAttribute('inert'), false);
  assert.equal(toggle.focused, false);
});
