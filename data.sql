CREATE DATABASE students;

CREATE TABLE students(name varchar(255), studentID int);
SHOW COLUMNS FROM students;
INSERT INTO students (name, studentID) VALUES ('jesus azuaje' , '00000000');

CREATE TABLE marks(subject varchar(255), name varchar(255), mark decimal(3,1));
SHOW COLUMNS FROM marks;
INSERT INTO marks(subject, name, mark) VALUES ('PBE', 'CDR', 9.2);
INSERT INTO marks(subject, name, mark) VALUES ('ONELE', 'PR1', 3.7);

CREATE TABLE timetables(day varchar(255),hour varchar(255), subject varchar(255), room varchar(255));
INSERT INTO timetables(day, hour, subject, room) VALUES ('MON', '08:00:00', 'RP', 'A4-002');
CREATE TABLE tasks(date varchar(255), subject varchar(255), name varchar(255));
INSERT INTO tasks(date, subject, name) VALUES ('2023-9-18','PBE','P1');
