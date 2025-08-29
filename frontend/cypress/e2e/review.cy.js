beforeEach(() => {
  cy.viewport(1440, 700);
  cy.loginAsManager();
  cy.visit("http://localhost:5173/approval");
});

it("approve one by one", () => {
  // 第一筆拒絕
  cy.get('[data-testid="review"]').first().click();
  cy.contains("Employee Name").should("be.visible");
  cy.contains("特休").should("be.visible");
  cy.contains("國旅一天").should("be.visible");
  cy.get("#reject").click();
  cy.get("#description").type("人力不足");
  cy.contains("送出").click();
  cy.contains("系統將寄信通知申請者", { timeout: 10000 }).should("exist");

  // 第二筆同意
  cy.get('[data-testid="review"]').first().click();
  cy.contains("Employee Name").should("be.visible");
  cy.contains("病假").should("be.visible");
  cy.contains("感冒看醫生").should("be.visible");
  cy.get("#approve").click();
  cy.get("#description").type("保重");
  cy.contains("送出").click();
  cy.contains("系統將寄信通知申請者", { timeout: 10000 }).should("exist");

  // 第三筆同意
  cy.get('[data-testid="review"]').first().click();
  cy.contains("Employee Name").should("be.visible");
  cy.contains("病假").should("be.visible");
  cy.contains("感冒").should("be.visible");
  cy.get("#approve").click();
  cy.get("#description").type("保重");
  cy.contains("送出").click();
  cy.contains("系統將寄信通知申請者", { timeout: 10000 }).should("exist");
});

it("check those leave records exist", () => {
  cy.visit("http://localhost:5173/employee-overview");

  // 檢查員工帳號的假別卡更新
  cy.get('[data-testid="employee-select"]').click({ force: true });
  cy.contains("EMPEmployee-Employee Name").click({ force: true });
  cy.contains("0900000000").should("be.visible");
  cy.contains("employee@company.com").should("be.visible");

  cy.get('[data-testid="特休-card"]').contains("0 / 80").should("be.visible");
  cy.get('[data-testid="特休-card"]')
    .contains("剩餘 10 天 0 小時")
    .should("exist");

  cy.get('[data-testid="病假-card"]').contains("8 / 40").should("be.visible");
  cy.get('[data-testid="病假-card"]')
    .contains("剩餘 4 天 0 小時")
    .should("exist");

  // 檢查請假紀錄更新
  cy.get('[data-testid="leave-record"]');
  cy.get('[data-testid="leave-record"]')
    .contains("特休")
    .parents("tr")
    .within(() => {
      cy.contains("Agent Name").should("exist");
      cy.contains("國旅一天").should("exist");
      cy.contains("已退回").should("exist");
    });

  cy.get('[data-testid="leave-record"]')
    .contains("感冒看醫生")
    .parents("tr")
    .within(() => {
      cy.contains("病假").should("exist");
      cy.contains("Agent Name").should("exist");
      cy.contains("已核准").should("exist");
    });

  cy.get('[data-testid="leave-record"]')
    .contains("感冒")
    .parents("tr")
    .within(() => {
      cy.contains("病假").should("exist");
      cy.contains("Agent Name").should("exist");
      cy.contains("已核准").should("exist");
    });
});
