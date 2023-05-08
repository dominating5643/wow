const database = require('../database/database.js');
console.log('Email:')

try {
    let readline = require('readline'); 
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    let email;

    rl.prompt();
    rl.on('line', (input) => {
        email = input;
        foo();
        rl.close();
    });
    foo = async () => {
        const data = await database.query('UPDATE person SET roole = $2 WHERE email = $1', [email, 'admin']);
        //const data = await database.query('UPDATE person SET roole = $2 WHERE email = $1', [email, 'user']);
        console.log('Succes!');
    }
} catch (error) {
    console.log('Error: ' + error);
}

