import joi from '@hapi/joi';
import * as db from './db';

const model = {
    employee: {
        fullName: joi.string(),
        DOB: joi.string(),
        role: joi.string()
    },
    id: {
        id: joi.string().length(36)
    }
}

const getEmployees = {
    method: 'GET',
    path: '/employees',
    handler: (_) => {
        return db.getEmployees();
    }
};

const addEmployee = {
    method: 'POST',
    path: '/employees',
    handler: ({payload: employee}) => {
        return db.addEmployee(employee);
    },
    config: {
        validate: {
            payload: joi.object(model.employee)
        }
    }
};

const editEmployee = {
    method: 'PATCH',
    path: '/employees/{id}',
    handler: ({params, payload}) => {
        return db.editEmployee(params.id, payload);
    },
    config: {
        validate: {
            params: joi.object(model.id),
            payload: joi.object(model.employee)
        }
    }
};

const replaceEmployee = {
    method: 'PUT',
    path: '/employees/{id}',
    handler: ({params, payload}) => {
        return db.editEmployee(params.id, payload);
    },
    config: {
        validate: {
            params: joi.object(model.id),
            payload: joi.object(model.employee)
        }
    }
};

const removeEmployee = {
    method: 'DELETE',
    path: '/employees/{id}',
    handler: async ({params: {id}}) => {
        return db.removeEmployee(id)
    },
    config: {
        validate: {
            params: joi.object(model.id)
        }
    }
};

const clientDir = {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'client'
        }
    }
};

const index = {
    method: 'GET',
    path: '/',
    handler: {
        file: 'client/index.html'
    }
};

export default [
    getEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    replaceEmployee,
    clientDir,
    index
];
