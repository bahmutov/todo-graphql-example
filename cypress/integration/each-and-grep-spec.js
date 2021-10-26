it('is compatible with cypress-grep', () => {
  expect(it.each).to.be.a('function')
})

it.each([1, 2, 3])('%s', (num) => {
  expect(num).to.be.a('number')
})
