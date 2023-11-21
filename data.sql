CREATE DATABASE if not exists prueba;
use prueba;
-- ALTER USER 'azcam' IDENTIFIED WITH mysql_native_password BY 'Reproche_2211';
-- flush privileges;
-- Se puede crear otra columna llamada "ID" en marks para utilizar [ FOREIGN KEY (ID) REFERENCES students(studentID) ] ? -> si
-- Las tablas timetables y tasks son comunes -> si
CREATE TABLE if not exists students(name varchar(255), 
									studentID int PRIMARY KEY);
INSERT INTO students (name, studentID) VALUES ('jesus azuaje' , '00000000');
INSERT INTO students (name, studentID) VALUES ('Pablo Castillo' , '0000001');

CREATE TABLE if not exists marks(studentID int, 
								 subject varchar(255), 
                                 name varchar(255), 
                                 mark decimal(3,1),
                                 FOREIGN KEY (studentID) REFERENCES students(studentID));
INSERT INTO marks(studentID, subject, name, mark) VALUES (0, 'PBE', 'CDR', 9.2);
INSERT INTO marks(studentID, subject, name, mark) VALUES (1, 'ONELE', 'PR1', 3.7);

/*
CREATE TABLE if not exists timetables(day varchar(255), 
									  hour varchar(255), 
                                      subject varchar(255), 
                                      room varchar(255));
INSERT INTO timetables(day, hour, subject, room) VALUES ('MON', '08:00:00', 'RP', 'A4-002');

CREATE TABLE if not exists tasks(date varchar(255), 
								 subject varchar(255), 
                                 name varchar(255));
INSERT INTO tasks(date, subject, name) VALUES ('2023-9-18','PBE','P1');
*/
