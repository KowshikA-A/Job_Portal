const { exec } = require('child_process');
const port = 1000;

const findProcessCommand = `lsof -t -i :${port}`;

exec(findProcessCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error finding process: ${stderr}`);
        return;
    }

    const pid = stdout.trim();

    if (pid) {
        const killCommand = `kill -9 ${pid}`;
        exec(killCommand, (killError, killStdout, killStderr) => {
            if (killError) {
                console.error(`Error killing process: ${killStderr}`);
            } else {
                console.log(`Killed process with PID: ${pid}`);
            }
        });
    } else {
        console.log(`No process found using port ${port}`);
    }
});