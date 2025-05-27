describe("Login Page", () => {
  const baseUrl = "http://localhost:5173"; // 或你實際的開發環境 URL

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("should render login form elements", () => {
    cy.get('input#employeeId').should("exist");
    cy.get('input#password').should("exist");
    cy.get('button[type="submit"]').contains("登入").should("exist");
    cy.get('label[for="rememberPassword"]').should("contain", "記住密碼");
  });

  it("should show error message on failed login", () => {
    cy.intercept("POST", "**/api/login", {
      statusCode: 401,
      body: {},
    }).as("loginRequest");

    cy.get("#employeeId").type("emp001");
    cy.get("#password").type("pwd124");
    cy.get("button[type=submit]").click();

    cy.wait("@loginRequest");

    cy.contains("登入失敗").should("be.visible");
    cy.contains("請確認您的員工編號和密碼是否正確").should("be.visible");
  });

  it("should log in and redirect user based on role", () => {
    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
    }).as("loginRequest");

    cy.intercept("GET", `**/api/user/userinfo/EMP001`, {
      statusCode: 200,
      body: {
        userId: "EMP001",
        userName: "Alice Huang",
        role: "manager",
      },
    }).as("userInfo");

    cy.get("#employeeId").type("EMP001");
    cy.get("#password").type("pwd123");
    cy.get("button[type=submit]").click();

    cy.wait("@loginRequest");
    cy.wait("@userInfo");

    cy.contains("登入成功").should("be.visible");
    cy.url().should("include", "/approval"); // 根據 role 導頁
  });

});

