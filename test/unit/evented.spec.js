import { Evented } from '../../src/js/evented.js';

describe('Evented', () => {
  let testEvent, testOnTriggered;

  beforeEach(() => {
    testEvent = new Evented();
    testEvent.on('testOn', () => testOnTriggered = true);
    testOnTriggered = false;
  });

  describe('on()', () => {
    it('adds a new event binding', () => {
      expect(testEvent.bindings.testOn, 'custom event added').toBeTruthy();
    });
  });

  describe('trigger()', () => {
    it('triggers a created event', () => {
      testEvent.trigger('testOn');
      expect(testOnTriggered, 'true is returned from event trigger').toBeTruthy();
    });
  });

  describe('off()', () => {
    it('removes a generic event binding when no handler passed', () => {
      testEvent.off('testOn');
      expect(testEvent.bindings.testOn, 'custom event removed').toBeUndefined();
    });

    it('removes a specific event binding when handler is passed', () => {
      const handler = () => {};
      testEvent.on('testOn', handler);
      expect(testEvent.bindings.testOn.length, '2 event listeners for testOn').toBe(2);
      testEvent.off('testOn', handler);
      expect(testEvent.bindings.testOn.length, '1 event listener for testOn').toBe(1);
    });

    it('does not remove uncreated events', () => {
      expect(testEvent.off('testBlank'), 'returns false for non created events').toBeFalsy();
    });
  });

  describe('once()', () => {
    it('adds a new event binding that only triggers once', () => {
      testEvent.once('testOnce', () => true);
      testEvent.trigger('testOnce');
      expect(testEvent.bindings.testOnce, 'custom event removed after one trigger').toBeTruthy();
    });
  });
});
