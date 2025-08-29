describe("Login Page", () => {
  const baseUrl = "http://localhost:5173"; // 或你實際的開發環境 URL

  beforeEach(() => {
    cy.viewport(1440, 700);
    cy.visit(baseUrl);
  });

  it("should render login form elements", () => {
    cy.get("input#employeeId").should("exist");
    cy.get("input#password").should("exist");
    cy.get('button[type="submit"]').contains("登入").should("exist");
    cy.get('label[for="rememberPassword"]').should("contain", "記住密碼");
  });

  it("should show error message on failed login", () => {
    cy.get("#employeeId").type("emp001");
    cy.get("#password").type("pwd124");
    cy.get("button[type=submit]").click();

    cy.contains("登入失敗").should("be.visible");
    cy.contains("請確認您的員工編號和密碼是否正確").should("be.visible");
  });

  it("should log in and redirect user based on role", () => {
    cy.get("#employeeId").type("EMPEmployee");
    cy.get("#password").type("pwdemployee");
    cy.get("button[type=submit]").click();

    cy.contains("登入成功").should("be.visible");
    cy.url().should("include", "/apply-form"); // 根據 role 導頁
  });
});
