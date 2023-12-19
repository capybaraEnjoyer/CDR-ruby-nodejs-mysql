CREATE DATABASE if not exists prueba;
use prueba;
GRANT ALL PRIVILEGES ON *.* TO 'GuardiaAlonso'@'localhost' WITH GRANT OPTION;
CREATE TABLE if not exists students(name varchar(255), uid varchar(255) PRIMARY KEY);
INSERT INTO students (name, uid) VALUES ('Jesus Azuaje' , 'D65DE4B0');
INSERT INTO students (name, uid) VALUES ('Pablo Castillo' , '0000001');
INSERT INTO students (name, uid) VALUES ('Joan Guardia' , 'E674E1B0');
INSERT INTO students (name, uid) VALUES ('Lucas Mira' , '863E7982');

CREATE TABLE if not exists marks(uid varchar(255), 
								 subject varchar(255), 
                                 name varchar(255), 
                                 mark varchar(255),
                                 FOREIGN KEY (uid) REFERENCES students(uid));
INSERT INTO marks(uid, subject, name, mark) VALUES 
('D65DE4B0', 'PBE', 'Puzzle1', 3),
('E674E1B0', 'PBE', 'Puzzle1', 8),
('D65DE4B0', 'PBE', 'Puzzle2', 7),
('E674E1B0', 'PBE', 'Puzzle2', 8),
('D65DE4B0', 'PBE', 'CDR', 8),
('E674E1B0', 'PBE', 'CDR', 8),

('0000001', 'DSBM', 'PR1', 3.7),
('D65DE4B0', 'DSBM', 'PR1', 8.3),
('E674E1B0', 'DSBM', 'PR1', 6.5),
('D65DE4B0', 'DSBM', 'PR2', 7),
('E674E1B0', 'DSBM', 'PR2', 7.2),
('D65DE4B0', 'DSBM', 'PR3', 9.2),
('E674E1B0', 'DSBM', 'PR3', 8.5),
('D65DE4B0', 'DSBM', 'Control LAB', 5),
('E674E1B0', 'DSBM', 'Control LAB', 5.3),
('D65DE4B0', 'DSBM', 'PR4', 8.5),
('E674E1B0', 'DSBM', 'PR4', 8.5),
('D65DE4B0', 'DSBM', 'Parcial', 6),
('E674E1B0', 'DSBM', 'Parcial', 6.2),

('D65DE4B0', 'RP', 'PR1', 6.4),
('E674E1B0', 'RP', 'PR1', 7.2),
('D65DE4B0', 'RP', 'PR2', 4),
('E674E1B0', 'RP', 'PR2', 4.3),
('D65DE4B0', 'RP', 'PR3', 7),
('E674E1B0', 'RP', 'PR3', 7.3),
('D65DE4B0', 'RP', 'Control LAB', 8.2),
('E674E1B0', 'RP', 'Control LAB', 5.5),
('D65DE4B0', 'RP', 'PR4', 9.1),
('E674E1B0', 'RP', 'PR4', 9),
('D65DE4B0', 'RP', 'Parcial', 5.4),
('E674E1B0', 'RP', 'Parcial', 5),

('D65DE4B0', 'PSAVC', 'PR1', 6.9),
('E674E1B0', 'PSAVC', 'PR1', 6.6),
('D65DE4B0', 'PSAVC', 'PR2', 7.7),
('E674E1B0', 'PSAVC', 'PR2', 7.1),
('D65DE4B0', 'PSAVC', 'PR3', 7),
('E674E1B0', 'PSAVC', 'PR3', 6.8),
('D65DE4B0', 'PSAVC', 'Control LAB', 4.6),
('E674E1B0', 'PSAVC', 'Control LAB', 5.7),
('D65DE4B0', 'PSAVC', 'PR4', 7.1),
('E674E1B0', 'PSAVC', 'PR4', 7),
('D65DE4B0', 'PSAVC', 'Parcial', 3),
('E674E1B0', 'PSAVC', 'Parcial', 3.3),

('D65DE4B0', 'TD', 'Parcial', 4),
('E674E1B0', 'TD', 'Parcial', 3.2);




CREATE TABLE if not exists timetables(day varchar(255), 
									  hour varchar(255), 
                                      subject varchar(255), 
                                      room varchar(255));
INSERT INTO timetables(day, hour, subject, room) VALUES 
('1', '08:00', 'Lab RP', 'D3-006'),
('1', '10:00', 'RP', 'A4-105'),
('1', '12:00', 'DSBM', 'A4-105'),
('2', '08:00', 'PSAVC', 'A4-105'),
('2', '11:00', 'TD', 'A4-105'),
('3', '08:00', 'Lab PBE', 'A4-105'),
('4', '08:00', 'PBE', 'A4-105'),
('4', '10:00', 'RP', 'A4-105'),
('4', '12:00', 'Lab DSBM', 'C5-S101A'),
('5', '08:00', 'DSBM', 'A4-105'),
('5', '09:00', 'PSAVC', 'A4-105'),
('5', '11:00', 'TD', 'A4-105');

CREATE TABLE if not exists tasks(date varchar(255),
				subject varchar(255), 
                                 name varchar(255));
INSERT INTO tasks(date, subject, name) VALUES 
('2023-09-21','DSBM','PR1'),
('2023-09-25','RP','PR1'),
('2023-10-02','PBE','Puzzle1'),
('2023-10-05','DSBM','PR2'),
('2023-10-09','RP','PR2'),
('2023-10-23','PBE','Puzzle2'),
('2023-10-19','DSBM','PR3'),
('2023-10-23','RP','PR3'),
('2023-11-02','DSBM','Control LAB'),
('2023-11-06','RP','Control LAB'),
('2023-11-08','PSAVC','Parcial'),
('2023-11-16','DSBM','PR4'),
('2023-11-20','RP','PR4'),
('2023-11-20','PBE','CDR'),
('2023-11-22','RP','Parcial'),
('2023-11-29','DSBM','Parcial'),
('2023-11-30','DSBM','PR5'),
('2023-12-04','RP','PR5'),
('2023-11-13','TD','Parcial'),
('2023-12-14','DSBM','PR6'),
('2023-12-18','RP','PR6'),
('2024-01-12','PBE','ICT');
