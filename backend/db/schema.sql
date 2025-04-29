DROP DATABASE IF EXISTS leave_management;
CREATE DATABASE IF NOT EXISTS leave_management DEFAULT CHARACTER SET utf8mb4;
USE leave_management;

-- Table: leave_type
CREATE TABLE leave_type (
    type_id TINYINT PRIMARY KEY,
    INDEX(type_id)
);

-- Table: department
CREATE TABLE department_id (
    department_id VARCHAR(20) PRIMARY KEY,
    INDEX(department_id)
);

-- Table: employee_info
CREATE TABLE employee_info (
    employee_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    hire_date DATETIME NOT NULL ,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    department_id VARCHAR(20) NOT NULL,
    role ENUM('manager', 'employee') NOT NULL,
    INDEX(employee_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- Table: leave_info
CREATE TABLE leave_info (
    leave_id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    status TINYINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leave_type TINYINT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    agent_id VARCHAR(20) NOT NULL, 
    attachment_base64 LONGTEXT DEFAULT NULL,
    
    reviewer_id VARCHAR(20),
    comment VARCHAR(255),
    INDEX (employee_id),
    FOREIGN KEY (employee_id) REFERENCES employee_info(employee_id),
    FOREIGN KEY (agent_id) REFERENCES employee_info(employee_id),
    FOREIGN KEY (reviewer_id) REFERENCES employee_info(employee_id),
    FOREIGN KEY (leave_type) REFERENCES leave_type(type_id)
);

-- Table: leave_balance
CREATE TABLE leave_balance (
    employee_id VARCHAR(20) NOT NULL,
    leave_type TINYINT NOT NULL,
    year INT NOT NULL,
    allocated_hours INT NOT NULL,
    PRIMARY KEY (employee_id, leave_type, year),
    FOREIGN KEY (employee_id) REFERENCES employee_info(employee_id),
    FOREIGN KEY (leave_type) REFERENCES leave_type(type_id)
);

DELIMITER $$

CREATE TRIGGER prevent_update_created_time
BEFORE UPDATE ON leave_info
FOR EACH ROW
BEGIN
    IF NEW.create_time != OLD.create_time THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '❌ Do not modify created_time';
    END IF;
END$$

DELIMITER ;


