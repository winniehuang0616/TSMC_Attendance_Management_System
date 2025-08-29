beforeEach(() => {
  cy.viewport(1440, 700);
  cy.loginAsEmployee();
  cy.visit("http://localhost:5173/apply-form");
});

it("should reject if leave exceeds balance", () => {
  // 選擇開始日期
  cy.get('[data-testid="start-date"]').click();
  cy.get('[data-testid="start-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^1$/).click();
    });

  // 選擇結束日期
  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^9$/).click();
    });

  // 輸入開始與結束時間（幾點）
  cy.get('[data-testid="startHour"]').clear().type("8");
  cy.get('[data-testid="endHour"]').clear().type("8");

  // 選擇假別
  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("病假").click({ force: true });

  // 選擇代理人
  cy.get('[data-testid="agent"]').click({ force: true });
  cy.get('[role="option"]')
    .contains("EMPAgent-Agent Name")
    .click({ force: true });

  // 輸入請假原因
  cy.get('[data-testid="reason"]').type("超額測試");

  cy.contains("送出").click();

  // 測試後端驗證成功
  cy.contains("請假時數超過可用額度").should("exist");
});

it("submit no. 1 (type == 特休)", () => {
  // 選擇開始日期
  cy.get('[data-testid="start-date"]').click();
  cy.get('[data-testid="start-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^15$/).click();
    });

  // 選擇結束日期
  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^16$/).click();
    });

  // 輸入開始與結束時間（幾點）
  cy.get('[data-testid="startHour"]').clear().type("8");
  cy.get('[data-testid="endHour"]').clear().type("8");

  // 選擇假別
  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("特休").click({ force: true });

  // 選擇代理人
  cy.get('[data-testid="agent"]').click({ force: true });
  cy.get('[role="option"]')
    .contains("EMPAgent-Agent Name")
    .click({ force: true });

  // 輸入請假原因
  cy.get('[data-testid="reason"]').type("旅遊");

  // 上傳附件
  cy.get('[data-testid="file"]').selectFile("cypress/fixtures/image.jpg", {
    force: true,
  });

  cy.contains("送出").click();

  // 測試假別卡資料更新
  cy.get('[data-testid="特休-card"]').should("exist");
  cy.get('[data-testid="特休-card"]')
    .contains("8 / 80", { timeout: 10000 })
    .should("be.visible");
  cy.get('[data-testid="特休-card"]')
    .contains("剩餘 9 天 0 小時", { timeout: 10000 })
    .should("exist");

  // 測試請假紀錄會新增一筆
  cy.visit("http://localhost:5173/personal-overview");
  cy.get('[data-testid="leave-record"]');
  cy.get('[data-testid="leave-record"]')
    .contains("特休")
    .parents("tr")
    .within(() => {
      cy.contains("2025/09/15").should("exist");
      cy.contains("2025/09/16").should("exist");
      cy.contains("Agent Name").should("exist");
      cy.contains("審核中").should("exist");
    });
});

it("apply for other 3 leaves", () => {
  // 病假 7/1 8. ~ 7/1 12. 感冒
  cy.get('[data-testid="start-date"]').click();
  cy.get('[data-testid="start-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="previous-month"]').click({ force: true });
      cy.contains(/^1$/).click();
    });

  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="previous-month"]').click({ force: true });
      cy.contains(/^1$/).click();
    });

  cy.get('[data-testid="startHour"]').clear().type("8");
  cy.get('[data-testid="endHour"]').clear().type("12");

  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("病假").click({ force: true });

  cy.get('[data-testid="agent"]').click({ force: true });
  cy.get('[role="option"]')
    .contains("EMPAgent-Agent Name")
    .click({ force: true });

  cy.get('[data-testid="reason"]').type("感冒");

  cy.contains("送出").click();

  // 病假 9/1 8. ~ 9/1 12. 感冒看醫生
  cy.get('[data-testid="start-date"]').click();
  cy.get('[data-testid="start-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^1$/).click();
    });

  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^1$/).click();
    });

  cy.get('[data-testid="startHour"]').clear().type("8");
  cy.get('[data-testid="endHour"]').clear().type("12");

  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("病假").click({ force: true });

  cy.get('[data-testid="agent"]').click({ force: true });
  cy.get('[role="option"]')
    .contains("EMPAgent-Agent Name")
    .click({ force: true });

  cy.get('[data-testid="reason"]').type("感冒看醫生");

  cy.contains("送出").click();

  // 特休 9/8 8. ~ 9/9 8. 國旅一天
  cy.get('[data-testid="start-date"]').click();
  cy.get('[data-testid="start-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^8$/).click();
    });

  cy.get('[data-testid="end-date"]').click();
  cy.get('[data-testid="end-calendar"]')
    .should("be.visible")
    .within(() => {
      cy.get('button[name="next-month"]').click({ force: true });
      cy.contains(/^9$/).click();
    });

  cy.get('[data-testid="startHour"]').clear().type("8");
  cy.get('[data-testid="endHour"]').clear().type("8");

  cy.get('[data-testid="type"]').click({ force: true });
  cy.get('[role="option"]').contains("特休").click({ force: true });

  cy.get('[data-testid="agent"]').click({ force: true });
  cy.get('[role="option"]')
    .contains("EMPAgent-Agent Name")
    .click({ force: true });

  cy.get('[data-testid="reason"]').type("國旅一天");

  cy.contains("送出").click();
});
