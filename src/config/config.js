//STRING DE CONEXAO


module.exports = {
    development: {
        database: {
            host: 'localhost',
            port: '3306',
            name: 'infocash',
            dialect: 'mysql',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    }
}