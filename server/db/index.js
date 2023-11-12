const knex = require("knex");
const knexFile = require("../knexfile.js");

const environment = process.env.NODE_ENV || "development";

const db = knex(knexFile[environment]);

const checkDatabaseConnection = async () => {
    try {
        await db.raw('SELECT VERSION()');
        console.log('Connected to the database!');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        return false;
    }
};

module.exports = {
    db,
    checkDatabaseConnection,
};
