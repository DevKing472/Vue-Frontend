/* eslint no-undef: 0 */
describe('add to compare', () => {
  it('Two products should be added to comparison table', () => {
    cy.visit('/c/jackets-23');
    cy.get('[alt="Olivia 1/4 Zip Light Jacket"]')
      .eq(0)
      .click();
    cy.get('.py40 > :nth-child(2) > .p0').click();
    cy.go('back');
    cy.get('[data-testid="productImage"]')
      .eq(1)
      .click();
    cy.get('[data-testid="addToCompare"]').click();
    cy.scrollTo(0, 0);
    cy.get('.compare-icon').click();
    cy.get('[data-testid="comparedProduct"]').eq(0);
    cy.get('[data-testid="comparedProduct"]').eq(1);
  });
});
