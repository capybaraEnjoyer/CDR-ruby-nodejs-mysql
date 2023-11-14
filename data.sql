CREATE DATABASE students;
use studentsDB;

CREATE TABLE students(name varchar(255), studentID int);
SHOW COLUMNS FROM students;
INSERT INTO students (name, studentID) VALUES ('Jordi Parra Crespo' , '28011999');

CREATE TABLE marks(subject varchar(255), name varchar(255), mark decimal(3,1));
SHOW COLUMNS FROM marks;
INSERT INTO marks(subject, name, mark) VALUES ('PBE', 'CDR', 9.8);
INSERT INTO marks(subject, name, mark) VALUES ('AST', 'PR1', 4.2);

CREATE TABLE timetables(day varchar(255),hour varchar(255), subject varchar(255), room varchar(255));
INSERT INTO timetables(day, hour, subject, room) VALUES ('TUE', '08:00:00', 'TD', 'A4-002');
CREATE TABLE tasks(date varchar(255), subject varchar(255), name varchar(255));
INSERT INTO tasks(date, subject, name) VALUES ('2020-7-18','PBE','CDR2');
