USE leave_management;

INSERT INTO department (department_id) VALUES
('BSID'),
('AAID'),
('ICSD'),
('TSID');

-- 插入假別資料（leave_type）
INSERT INTO leave_type (type_id) VALUES
(1), (2), (3); 

-- 插入員工資訊（employee_info）
INSERT INTO employee_info (
    employee_id, password, name, hire_date, email, phone, department_id, role
) VALUES
('EMP001', 'pwd123', 'Alice Huang', '2023-01-10 09:00:00', 'alice@company.com', '0912345678', 'BSID', 'manager'),
('EMP002', 'pwd456', 'Bob Lin', '2023-03-20 10:30:00', 'bob@company.com', '0922333444', 'BSID', 'employee'),
('EMP003', 'pwd789', 'Carol Wu', '2023-05-15 08:45:00', 'carol@company.com', '0933444555', 'BSID', 'employee');


INSERT INTO leave_info (
    leave_id, employee_id, status, start_time, end_time,
    leave_type, reason, agent_id,
    reviewer_id, comment
) VALUES
('L001', 'EMP002', 0, '2024-05-01 09:00:00', '2024-05-02 18:00:00', 1, '年度休假', 'EMP003', NULL, NULL);
