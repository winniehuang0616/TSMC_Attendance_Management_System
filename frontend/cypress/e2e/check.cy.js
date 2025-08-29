beforeEach(() => {
  cy.viewport(1440, 700); // 或 1920x1080、375x667 等等
  cy.loginAsEmployee();
  cy.visit("http://localhost:5173/personal-overview");
});

it("check approval status", () => {
  // 查閱被退回的假單
  cy.get('[data-testid="view"]').click();
  cy.contains("特休").should("exist");
  cy.contains("國旅一天").should("exist");
  cy.get("#description").should("have.value", "人力不足");
  cy.get('button[type="button"]').last().click();

  // 撤回已核准的假單
  cy.get('[data-testid="delete"]').first().click();
  cy.contains("病假").should("exist");
  cy.contains("感冒看醫生").should("exist");
  cy.get("#description").should("have.value", "保重");
  cy.contains("刪除").click();
  cy.contains("已向主管發送撤回信件", { timeout: 10000 }).should("be.visible");

  // 撤回已核准的假單失敗
  cy.get('[data-testid="delete"]').first().click();
  cy.contains("病假").should("exist");
  cy.contains("感冒").should("exist");
  cy.get("#description").should("have.value", "保重");
  cy.contains("刪除").click();
  cy.contains("假單已過期，無法撤回", { timeout: 10000 }).should("be.visible");
});
