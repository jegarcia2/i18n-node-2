// Run $ npm test
const fs = require('fs');
const assert = require('assert');
const yaml = require('js-yaml');
const I18n = require('../i18n');

describe('i18n-2', () => {
  it('check version', () => {
    assert.equal(I18n.version, '0.4.7');
  });

  it('check set/getLocale', () => {
    const i18n = new I18n({
      locales: ['en', 'de']
    });

    assert.equal('en', i18n.getLocale(), 'should return default setting');
    assert.equal('de', i18n.setLocale('de'), 'should return the new setting');
    assert.equal('de', i18n.getLocale(), 'should return the new setting');
    assert.equal('de', i18n.getLocale(), 'should return the previous default setting');
  });

  it('check singular', () => {
    const i18n = new I18n({
      locales: ['en', 'de']
    });

    i18n.setLocale('en');
    assert.equal(i18n.__('Hello'), 'Hello');
    assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hello Marcus, how are you today?');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hello Marcus, how are you today? How was your weekend.');

    i18n.setLocale('de');
    assert.equal(i18n.__('Hello'), 'Hallo');
    assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hallo Marcus, wie geht es dir heute?');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hallo Marcus, wie geht es dir heute? Wie war dein Wochenende.');
  });

  it('check plural', () => {
    const i18n = new I18n({
      locales: ['en', 'de']
    });

    i18n.setLocale('en');
    let singular = i18n.__n('%s cat', '%s cats', 1);
    let plural = i18n.__n('%s cat', '%s cats', 3);
    assert.equal(singular, '1 cat');
    assert.equal(plural, '3 cats');

    i18n.setLocale('de');
    singular = i18n.__n('%s cat', '%s cats', 1);
    plural = i18n.__n('%s cat', '%s cats', 3);
    assert.equal(singular, '1 Katze');
    assert.equal(plural, '3 Katzen');
  });

  it('check nested plural', () => {
    const i18n = new I18n({
      locales: ['en', 'de']
    });

    i18n.setLocale('en');
    let singular = i18n.__n('There is one monkey in the %%s', 'There are %d monkeys in the %%s', 1, i18n.__('tree'));
    let plural = i18n.__n('There is one monkey in the %%s', 'There are %d monkeys in the %%s', 3, i18n.__('tree'));
    assert.equal(singular, 'There is one monkey in the tree');
    assert.equal(plural, 'There are 3 monkeys in the tree');

    i18n.setLocale('de');
    singular = i18n.__n('There is one monkey in the %%s', 'There are %d monkeys in the %%s', 1, i18n.__('tree'));
    plural = i18n.__n('There is one monkey in the %%s', 'There are %d monkeys in the %%s', 3, i18n.__('tree'));
    assert.equal(singular, 'Im Baum sitzt ein Affe');
    assert.equal(plural, 'Im Baum sitzen 3 Affen');
  });

  it('check variables', () => {
    const i18n = new I18n({
      locales: ['en', 'de']
    });

    let i = 0;
    i18n.setLocale('en');
    const greetings = ['Hi', 'Hello', 'Howdy'];
    for (i = 0; i < greetings.length; i++) {
      assert.equal(greetings[i], i18n.__(greetings[i]));
    }

    i18n.setLocale('de');
    const greetingsDE = ['Hi', 'Hallo', 'Hallöchen'];
    for (i = 0; i < greetings.length; i++) {
      assert.equal(greetingsDE[i], i18n.__(greetings[i]));
    }
  });

  it('check without files', () => {
    const i18n = new I18n({
      devMode: false,
      locales: {
        en: {
          Hello: "Hello",
          "Hello %s, how are you today?": "Hello %s, how are you today?",
          weekend: "weekend"
        },
        de: {
          Hello: "Hallo",
          "Hello %s, how are you today?": "Hallo %s, wie geht es dir heute?",
          weekend: "Wochenende",
          nested: {
            foo: "bar"
          },
          "%s cat": {
            one: "%s cat",
            other: "%s cats"
          }
        }
      }
    });

    i18n.setLocale('de');

    assert.equal('Hallo', i18n.__('Hallo'));
    assert.equal('bar', i18n.__('nested.foo'));
    assert.equal('0 cat', i18n.__n('%s cat', 0));
    assert.equal('1 cat', i18n.__n('%s cat', 1));
    assert.equal('2 cats', i18n.__n('%s cat', 2));
  });

  it('check parse', () => {
    const i18n = new I18n({
      locales: ['en', 'de'],
      extension: '.yml',
      parse: function (data) {
        return yaml.load(data);
      },
      dump: function (data) {
        return yaml.dump(data);
      }
    });

    i18n.setLocale('en');
    assert.equal(i18n.__('Hello'), 'Hello');
    assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hello Marcus, how are you today?');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hello Marcus, how are you today? How was your weekend.');
  });

  it('check dump', () => {
    const i18n = new I18n({
      locales: ['en', 'de'],
      extension: '.yml',
      parse: function (data) {
        return yaml.load(data);
      },
      dump: function (data) {
        return yaml.dump(data);
      }
    });

    i18n.setLocale('de');
    assert.equal(i18n.__('Hello'), 'Hallo');
    assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hallo Marcus, wie geht es dir heute?');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hallo Marcus, wie geht es dir heute? Wie war dein Wochenende.');

    assert.deepEqual(yaml.load(fs.readFileSync('./locales/de.yml')), i18n.locales.de);
  });

  it('check strings save', () => {
    const i18n = new I18n({
      locales: ['en', 'de'],
      devMode: true
    });
    i18n.setLocale('en');

    const testString = 'New string';

    assert.equal(undefined, i18n.locales.en[testString]);
    i18n.__(testString);
    assert.equal(testString, i18n.locales.en[testString]);

    // Remove the new string
    delete i18n.locales.en[testString];
    i18n.writeFile('en');
  });
});
