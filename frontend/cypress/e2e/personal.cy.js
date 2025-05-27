describe("Personal Overview Page - Full Flow Test", () => {
  const baseUrl = "http://localhost:5173/personal-overview";
  const leaveTypeLabel = {
  annual: "特休",
  sick: "病假",
  personal: "事假",
  official: "公假",
};

  it("should test full flow from LEAVES_COUNT to leave edit and delete", () => {
    cy.loginAs("EMP001", "Alice Huang", "manager");
    cy.visit(baseUrl);

    // Mock leave balance
    cy.intercept("GET", "**/api/leaves/*/leaveCount", {
      statusCode: 200,
      body: {
        usedLeaves: {
          used_hours: {
            annual: 8,
            sick: 38,
            personal: 4,
            official: 0,
          },
        },
        allocatedLeaves: {
          allocated_hours: {
            annual: 40,
            sick: 40,
            personal: 40,
            official: 8,
          },
        },
      },
    }).as("getLeaveCount");

    // Mock leave records
    const today = new Date().toISOString().split("T")[0];
    cy.intercept("GET", "**/api/leaves/*", {
      statusCode: 200,
      body: [
        {
          id: "r1",
          name: "王小明",
          type: "sick",
          startDate: "2025-06-09",
          endDate: "2025-06-10",
          agentName: "EMP001-代理人a",
          reason: "感冒",
          status: "pending",
          attachment: "",
        },
        {
          id: "r2",
          name: "王小明",
          type: "annual",
          startDate: "2025-05-01",
          endDate: "2025-05-02",
          agentName: "EMP003-代理人b",
          reason: "旅遊",
          status: "approved",
          attachment: "",
        },
        {
          id: "r3",
          name: "王小明",
          type: "personal",
          startDate: "2025-06-03",
          endDate: "2025-06-04",
          agentName: "EMP003-代理人b",
          reason: "私事",
          status: "rejected",
          attachment: "",
        },
        {
          id: "r4",
          name: "王小明",
          type: "official",
          startDate: "2025-06-03",
          endDate: "2025-06-04",
          agentName: "EMP003-代理人b",
          reason: "公務",
          status: "approved",
          attachment: "",
        },
      ],
    }).as("getLeaveRecords");

    cy.wait("@getLeaveCount");
    cy.wait("@getLeaveRecords");

    // Mock agent API
    cy.intercept("GET", "**/api/user/agent/EMP001");
    cy.wait("@getAgent");

    // 驗證卡片出現
    cy.contains("病假").should("exist");
    cy.contains("事假").should("exist");
    cy.contains("特休").should("exist");
    cy.contains("公假").should("exist");

    

    // 點擊 pencil icon 編輯失敗 ➜ 額度不足
    cy.get("[data-testid='edit']").click();
    cy.get("button").contains("2025/06/10").click();
    cy.get('button[name="next-month"]').click();
    cy.contains(/^20$/).click();
    cy.intercept("PUT", "**/api/leaves/r1").as("putAPI");
    cy.get("button").contains("更新").click();
    cy.wait("@putAPI").then((xhr) => {
        expect(xhr.response.statusCode).to.equal(400);
    });
    cy.contains("更新失敗").should("exist");

    // 修改假別、代理人、上傳圖片後成功送出
    cy.get("[data-testid='edit']").click();
    cy.get("button").contains("選擇假別").click({ force: true });
    cy.get('[role="option"]').contains("事假").click({ force: true });
    cy.get("button").contains("選擇代理人").click({ force: true });
    cy.get('[role="option"]').contains("EMP003-代理人b").click({ force: true });
    cy.get("input[type='file']").selectFile("cypress/fixtures/sample.png", { force: true });
    cy.intercept("PUT", "**/api/leaves/r1").as("putAPI");
    cy.get("button").contains("儲存").click();
    cy.wait("@putAPI").then((xhr) => {
        expect(xhr.response.statusCode).to.equal(200);
    });
    cy.contains("更新成功").should("exist");

    // 刪除第一筆失敗
    cy.get("[data-testid='delete-r2']").click();
    cy.intercept("DELETE", "**/api/leaves/r2").as("deleteAPI");
    cy.contains("確認").click();
    cy.wait("@deleteAPI").then((xhr) => {
        expect(xhr.response.statusCode).to.equal(400);
    });
    cy.contains("撤回失敗").should("exist");

    // 刪除另一筆成功
    cy.get("[data-testid='delete-r4']").click();
    cy.intercept("DELETE", "**/api/leaves/r4").as("deleteAPI");
    cy.contains("確認").click();
    cy.wait("@deleteAPI").then((xhr) => {
        expect(xhr.response.statusCode).to.equal(200);
    });
    cy.contains("刪除成功").should("exist");

    // 預覽功能
    cy.get("[data-testid='view-r3']").click();
    cy.contains("私事").should("exist");
    cy.contains("王小明").should("exist");
    cy.contains("rejected").should("exist");
  });
});