beforeEach(() => {
  cy.viewport(1440, 700);
  cy.loginAsEmployee();
  cy.visit("http://localhost:5173/personal-overview");
});

it("edit should be rejected if leave exceeds balance", () => {
  // 點 pencil icon 開始編輯 ( 第一筆 )
  cy.get('[data-testid="edit"]').first().click();

  // 選擇結束日期
  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^20$/).click();
    });

  // 選擇假別
  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("事假").click({ force: true });

  cy.contains("更新").click();

  // 測試後端驗證成功
  cy.contains("請假時數超過可用額度", { timeout: 10000 }).should("exist");
});

it("edit should be succeed", () => {
  // 點 pencil icon 開始編輯
  cy.get('[data-testid="edit"]').first().click();

  // 選擇結束日期
  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^16$/).click();
    });

  // 選擇假別
  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("事假").click({ force: true });

  cy.contains("更新").click();

  // 測試假別卡資料更新
  cy.get('[data-testid="特休-card"]').should("exist");
  cy.get('[data-testid="特休-card"]')
    .contains("8 / 80", { timeout: 10000 })
    .should("be.visible");
  cy.get('[data-testid="特休-card"]')
    .contains("剩餘 9 天 0 小時", { timeout: 10000 })
    .should("exist");

  cy.get('[data-testid="事假-card"]').should("exist");
  cy.get('[data-testid="事假-card"]')
    .contains("8 / 24", { timeout: 10000 })
    .should("be.visible");
  cy.get('[data-testid="事假-card"]')
    .contains("剩餘 2 天 0 小時", { timeout: 10000 })
    .should("exist");
});

it("cancel should be succeed", () => {
  // 點 pencil icon 後撤回
  cy.get('[data-testid="edit"]').first().click();
  cy.contains("撤回").click();

  // 測試後端驗證成功
  cy.contains("已向主管發送撤回信件", { timeout: 10000 }).should("exist");

  // 更新假別卡資料
  cy.get('[data-testid="事假-card"]').should("exist");
  cy.get('[data-testid="事假-card"]')
    .contains("0 / 24", { timeout: 10000 })
    .should("be.visible");
  cy.get('[data-testid="事假-card"]')
    .contains("剩餘 3 天 0 小時", { timeout: 10000 })
    .should("exist");
});
