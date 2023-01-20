import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';
import employeeData from './employee-data';

// Poor mans DB ;-)

let employees = JSON.parse(JSON.stringify(employeeData)).map(person => {
    return {
        ...person,
        id: uuid.v4()
    };
});

export function getEmployees() {
    return new Promise((res, rej) => res(employees));
}

export function addEmployee(employee = {}) {
    return new Promise((res, rej) => {
        employee.id = uuid.v4();
        employees.push(employee);
        res(save(employees).then(() => employee));
    });
}

export function removeEmployee(id) {
    return new Promise((res, rej) => {
        employees = employees.filter(person => person.id !== id);
        res(save(employees).then(() => employees));
    });
}

export function editEmployee(id, data) {
    return new Promise((res, rej) => {
        let employee;
        employees = employees.filter(person => {
            if (person.id !== id) return person;
            employee = person;
            return false;
        });

        employee = {
            ...employee,
            ...data
        };
        employees.push(employee);

        res(save(employees).then(() => employee));
    });
}

function save(employees) {
    return new Promise((res, rej) => {
        fs.writeFile(
            path.join(__dirname, 'employee-data.json'),
            JSON.stringify(employees, null, 4),
            'utf-8',
            err => err ? rej(err) : res()
        );
    });
}
