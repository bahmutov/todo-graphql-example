describe('each and grep', () => {
  it('is compatible with cypress-grep', () => {
    expect(it.each).to.be.a('function')
  })

  it.each([1, 2, 3])('number is %s', (num) => {
    expect(num).to.be.a('number')
  })
})
