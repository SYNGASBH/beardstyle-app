const catalog = require('../data/styleIdentity.json');
const byAlias = new Map(catalog.flatMap(style => [style.id, style.slug, ...style.aliases].map(alias => [alias, style])));
function resolveStyle(value) { return byAlias.get(value); }
function requireStyle(value) {
  const style = resolveStyle(value);
  if (!style) { const error = new Error('Unknown beard style'); error.status = 400; throw error; }
  return style;
}
module.exports = { catalog, resolveStyle, requireStyle };
