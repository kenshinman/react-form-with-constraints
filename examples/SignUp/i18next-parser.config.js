module.exports = {
  locales: ['fr'],
  output: 'locales/$LOCALE/$NAMESPACE.json',

  // See https://github.com/i18next/i18next-parser/issues/129
  namespaceSeparator: '__NS',
  keySeparator: '__KS'
};