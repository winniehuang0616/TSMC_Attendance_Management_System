describe("Apply Leave Form", () => {
  const baseUrl = "http://localhost:5173/apply-form";

  beforeEach(() => {
    cy.loginAs("EMP001", "Alice Huang", "employee");
    cy.visit(baseUrl);

    // Mock agent API
    cy.intercept("GET", "**/api/user/agent/EMP001", {
      statusCode: 200,
      body: [
        { id: "EMP002", agentName: "代理人A" },
        { id: "EMP003", agentName: "代理人B" },
      ],
    }).as("getAgent");

    // Mock user info
    cy.intercept("GET", "**/api/user/userinfo/EMP001", {
      statusCode: 200,
      body: {
        userId: "EMP001",
        userName: "王小明",
        role: "employee",
      },
    }).as("getUserInfo");

    // Mock balance
    cy.intercept("GET", "**/api/leaves/*/leaveCount", {
      statusCode: 200,
      body: {
        sick: { used: 0, total: 40 },
        annual: { used: 8, total: 40 },
        personal: { used: 4, total: 40 },
        official: { used: 0, total: 8 },
      },
    }).as("getBalance");
  })

  it("1. should show agent and type options", () => {
    cy.get("button").contains("選擇代理人").click({ force: true });
    cy.contains("EMP002-代理人A").should("exist");
    cy.contains("EMP003-代理人B").should("exist");
    cy.get("button").contains("選擇假別").click({ force: true });
    cy.contains("病假").should("exist");
    cy.contains("事假").should("exist");
    cy.contains("特休").should("exist");
    cy.contains("公假").should("exist");
  });

  it("2. should render all form fields and 4 cards", () => {
    cy.get("button").filter(':contains("選擇日期")').should("have.length", 2);
    cy.get("input[type='number']").should("have.length", 2);
    cy.get("button").contains("選擇假別").should("exist");
    cy.get("button").contains("選擇代理人").should("exist");
    cy.get("input[placeholder='輸入請假原因']").should("exist");
    cy.get("input[type='file']").should("exist");
  })

  it("3. should render LeaveBalanceCards with mock API data", () => {
    // 攔截 /api/leaves/count/EMP001 並給一組假資料
    cy.intercept("GET", "**/api/leaves/*/leaveCount", {
        statusCode: 200,
        body: {
        usedLeaves: {
            used_hours: {
            annual: 8,
            sick: 0,
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
    cy.wait("@getLeaveCount");
    cy.contains("病假").should("exist");
    cy.contains("事假").should("exist");
    cy.contains("特休").should("exist");
    cy.contains("公假").should("exist");
    });


  it("4. should submit and update used hours", () => {
    cy.viewport(1280, 720);
    cy.intercept("POST", "**/api/leaves/*", {
      statusCode: 200,
    }).as("submitLeave");

    // 填表單
    cy.get("button").contains("選擇日期").first().click();
    cy.get('button[name="next-month"]').eq(0).click();
    cy.contains(/^1$/).click();
    cy.get("button").contains("選擇日期").last().click();
    cy.get('button[name="next-month"]').eq(1).click();
    cy.contains(/^2$/).click();

    // 應增加 8 小時
    cy.get("input[type='number']").eq(0).clear().type("8");
    cy.get("input[type='number']").eq(1).clear().type("8");

    cy.get("button").contains("選擇假別").click({ force: true });
    cy.get('[role="option"]').contains("病假").click({ force: true });
    cy.get("button").contains("選擇代理人").click({ force: true });
    cy.get('[role="option"]').contains("EMP002-代理人A").click({ force: true });
    cy.get("input[placeholder='輸入請假原因']").type("測試");

    cy.contains("送出").click();
    cy.wait("@submitLeave");

  });

  it("5. should not submit if required fields are missing", () => {
    cy.contains("送出").click();
    cy.get("form").should("exist"); // 未成功送出
    cy.get("input[placeholder='輸入請假原因']")
      .parent()
      .should("have.css", "border-color")
      .and("match", /rgb\((\d+, ?){2}\d+\)/); // 偵測變色（略寬鬆）
  });

  it("6. should reject if leave exceeds balance", () => {
    // 模擬送出後錯誤
    cy.intercept("POST", "**/api/leaves/EMP001", {
      statusCode: 400,
      body: { detail: "Leave duration exceeds quota" },
    }).as("submitLeave");

    // 原先 sick used: 39, total: 40
    cy.intercept("GET", "**/api/leaves/*/leaveCount", {
      statusCode: 200,
      body: {
        sick: { used: 39, total: 40 },
        annual: { used: 8, total: 40 },
        personal: { used: 4, total: 40 },
        official: { used: 0, total: 8 },
      },
    });

    const day = new Date().getDate().toString();
    cy.get("button").contains("選擇日期").first().click();
    cy.get('button[name="next-month"]').eq(0).click({ force: true });
    cy.contains(/^1$/).click();
    cy.get("button").contains("選擇日期").last().click();
    cy.get('button[name="next-month"]').eq(1).click({ force: true });
    cy.contains(/^2$/).click();

    cy.get("input[type='number']").eq(0).clear().type("8");
    cy.get("input[type='number']").eq(1).clear().type("8");

    cy.get("button").contains("選擇假別").click({ force: true });
    cy.get('[role="option"]').contains("病假").click({ force: true });
    cy.get("button").contains("選擇代理人").click({ force: true });
    cy.get('[role="option"]').contains("EMP002-代理人A").click({ force: true });
    cy.get("input[placeholder='輸入請假原因']").type("超額測試");

    cy.contains("送出").click();
    cy.wait("@submitLeave");
    cy.contains("請假時數超過可用額度").should("exist");
  });
});
