const Employee = require('../models/employee');

const employeeCtrl = {};
var date = require('date-and-time');
let now = new Date();

employeeCtrl.getEmployees = async(req, res, next) => {
    const employees = await Employee.find();
    res.json(employees);
};

employeeCtrl.createEmployee = async(req, res, next) => {
    const employee = new Employee({
        codigo: req.body.codigo,
        cliente: req.body.cliente,
        fecha: date.format(now, 'DD-MM-YYYY'),
        perfil: req.body.perfil,
        contador: req.body.contador
    });
    await employee.save();
    res.json({ status: 'Tarjeta creada rr' });
};

employeeCtrl.getEmployee = async(req, res, next) => {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.json(employee);
};

employeeCtrl.editEmployee = async(req, res, next) => {
    const { id } = req.params;
    const employee = {
        codigo: req.body.codigo,
        cliente: req.body.cliente,
        fecha: req.body.fecha,
        perfil: req.body.perfil,
        contador: req.body.contador
    };
    await Employee.findByIdAndUpdate(id, { $set: employee }, { new: true });
    res.json({ status: 'Tarjeta Atualizada' });
};

employeeCtrl.deleteEmployee = async(req, res, next) => {
    await Employee.findByIdAndRemove(req.params.id);
    res.json({ status: 'Tarjeta Eliminada' });
};

module.exports = employeeCtrl;