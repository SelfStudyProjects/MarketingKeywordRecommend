const Intelligent = require('./intelligentKeywordExpander');

test('expandKeywords returns array', async () => {
  const expander = new Intelligent();
  const result = await expander.expandKeywords(['테스트 키워드'], { maxKeywords: 10, includeTrends: false });
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThanOrEqual(1);
});
