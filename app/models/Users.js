const { pool } = require('../config/dbConfig');
module.exports = class Users{
    static findByUsername(employee_id) {
        console.log('inside findByUsername::::::::');
        let statement = {
          text:`SELECT *  FROM employees where employee_id = $1`,
          values: [employee_id]
        }
        console.log("statement", statement);
        return pool.query(statement);
    }


    static findByRoleId(role_id) {
      let statement = {
        text:`SELECT *  FROM roles where id = $1`,
        values: [role_id]
      }
      console.log("statement", statement);
      return pool.query(statement);
  }
};