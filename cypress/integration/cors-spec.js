describe('server API CORS', () => {
  it('returns expected headers for OPTIONS', () => {
    cy.request('OPTIONS', 'http://localhost:3000').then((res) => {
      expect(res, 'status').to.have.property('status', 204)
      expect(res.headers).to.include({
        'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'access-control-allow-origin': '*',
      })
    })
  })
})
