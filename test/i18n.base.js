// Run $ npm test
const assert = require('assert');
const I18n = require('../i18n');

describe('i18n-2 base functionality', () => {
  it('check base', () => {
    const i18n = new I18n({
      locales: ['at-de'],
      base: function(locale) { return locale.slice(-2); }
    });

    i18n.setLocale('at-de');
    assert.equal(i18n.__('Hello'), 'Hallo');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus'), 'Hallo Marcus, wie geht es dir heute? Wie war Ihre Reise nach Wien.');
  });

  it('check base - returning nothing reads locale safely', () => {
    const i18n = new I18n({
      locales: ['at-de'],
      base: function() {}
    });

    i18n.setLocale('at-de');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus'), 'Hallo Marcus, wie geht es dir heute? Wie war Ihre Reise nach Wien.');
  });

  it('check base - returning not a string reads locale safely', () => {
    const i18n = new I18n({
      locales: ['at-de'],
      base: function() { return {}; }
    });

    i18n.setLocale('at-de');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus'), 'Hallo Marcus, wie geht es dir heute? Wie war Ihre Reise nach Wien.');
  });

  it('check base - throwing exception reads locale safely', () => {
    const i18n = new I18n({
      locales: ['at-de'],
      base: function() { throw new Error(); }
    });

    i18n.setLocale('at-de');
    assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus'), 'Hallo Marcus, wie geht es dir heute? Wie war Ihre Reise nach Wien.');
  });
});
