/// <reference types="cypress" />

Cypress.Commands.add(
  "loginAsManager",
  (userId = "EMPManager", userName = "主管名稱", role = "manager") => {
    window.sessionStorage.setItem("userId", userId);
    window.sessionStorage.setItem("userName", userName);
    window.sessionStorage.setItem("role", role);
  },
);

Cypress.Commands.add(
  "loginAsEmployee",
  (userId = "EMPEmployee", userName = "員工名稱", role = "employee") => {
    window.sessionStorage.setItem("userId", userId);
    window.sessionStorage.setItem("userName", userName);
    window.sessionStorage.setItem("role", role);
  },
);
