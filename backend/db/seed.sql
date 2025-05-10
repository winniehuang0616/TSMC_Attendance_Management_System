USE leave_management;

INSERT INTO department (department_id) VALUES
('BSID'),
('AAID'),
('ICSD'),
('TSID');

-- 插入假別資料（leave_type）
INSERT INTO leave_type (type_id) VALUES
(0), (1), (2), (3); 

-- 插入員工資訊（employee_info）
INSERT INTO employee_info (
    employee_id, password, name, hire_date, email, phone, department_id, role
) VALUES
('EMP001', 'pwd123', 'Alice Huang', '2023-01-10 09:00:00', 'alice@company.com', '0912345678', 'BSID', 'manager'),
('EMP002', 'pwd456', 'Bob Lin', '2023-03-20 10:30:00', 'bob@company.com', '0922333444', 'BSID', 'employee'),
('EMP003', 'pwd789', 'Carol Wu', '2023-05-15 08:45:00', 'carol@company.com', '0933444555', 'BSID', 'employee'),
('EMP004', 'pwd123', 'Erica Chen', '2016-12-25 09:00:00', 'cool123@company.com', '0978222333', 'TSID', 'manager'),
('EMP005', 'pwd456', 'Jack Wu', '2018-03-14 09:00:00', 'jackwu@company.com', '0911222333', 'TSID', 'employee'),
('EMP006', 'pwd789', 'Irene Lin', '2019-07-10 09:00:00', 'irenelin@company.com', '0922333444', 'TSID', 'employee'),
('EMP007', 'pwd321', 'Oscar Yang', '2020-01-05 09:00:00', 'oscaryang@company.com', '0933444555', 'ICSD', 'manager'),
('EMP008', 'pwd654', 'Mia Tsai', '2021-06-21 09:00:00', 'miatsai@company.com', '0944555666', 'ICSD', 'employee'),
('EMP009', 'pwd987', 'Kevin Lai', '2022-11-01 09:00:00', 'kevinlai@company.com', '0955666777', 'ICSD', 'employee');



INSERT INTO leave_info (
    leave_id, employee_id, status, start_time, end_time,
    leave_type, reason, agent_id,
    reviewer_id, comment
) VALUES
('L001', 'EMP002', 0, '2024-05-01 09:00:00', '2024-05-02 18:00:00', 1, '年度休假', 'EMP003', NULL, NULL);

INSERT INTO leave_balance (employee_id, leave_type, year, allocated_hours) VALUES
('EMP001', 0, 2025, 24),
('EMP001', 1, 2025, 40),
('EMP001', 2, 2025, 80),
('EMP001', 3, 2025, 16), 
('EMP002', 0, 2025, 24),
('EMP002', 1, 2025, 40),
('EMP002', 2, 2025, 80),
('EMP002', 3, 2025, 16),

-- EMP003
('EMP003', 0, 2025, 24),
('EMP003', 1, 2025, 40),
('EMP003', 2, 2025, 80),
('EMP003', 3, 2025, 16),

-- EMP004
('EMP004', 0, 2025, 20),
('EMP004', 1, 2025, 30),
('EMP004', 2, 2025, 70),
('EMP004', 3, 2025, 10),

-- EMP005
('EMP005', 0, 2025, 16),
('EMP005', 1, 2025, 20),
('EMP005', 2, 2025, 60),
('EMP005', 3, 2025, 8),

-- EMP006
('EMP006', 0, 2025, 24),
('EMP006', 1, 2025, 36),
('EMP006', 2, 2025, 75),
('EMP006', 3, 2025, 12),

-- EMP007
('EMP007', 0, 2025, 18),
('EMP007', 1, 2025, 25),
('EMP007', 2, 2025, 65),
('EMP007', 3, 2025, 14),

-- EMP008
('EMP008', 0, 2025, 22),
('EMP008', 1, 2025, 32),
('EMP008', 2, 2025, 78),
('EMP008', 3, 2025, 10),

-- EMP009
('EMP009', 0, 2025, 20),
('EMP009', 1, 2025, 28),
('EMP009', 2, 2025, 72),
('EMP009', 3, 2025, 11);

