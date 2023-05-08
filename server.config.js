const spawn = require("cross-spawn");


const kit = spawn('node kit_watch.config.js');

kit.stdout.on('data', (data) => {
    console.log(String(data));
});


// let serveLaunchCounter = 1;

server();

async function server() {
    while (true) {
        await new Promise((resolve) => {
            const serve = spawn('webpack serve');

            // console.log(`Server is running (${serveLaunchCounter})`);
            console.log('Server is running...');
            // serveLaunchCounter++;

            // serve.stderr.on("data", data => {
            //     console.log(String(data))
                // if (String(data)[1] === 'e') {
                //     serve.kill('SIGINT');

                //     resolve();
                // }
            // });

            serve.stdout.on('data', () => {});
        });
    }
}