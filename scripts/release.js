const { exec } = require("child_process");

function prompt(msg) {
    process.stdout.write(msg);
    process.stdin.setEncoding("utf-8");
    return new Promise(resolve => {
        process.stdin.once("data", function(data) {
            resolve(data.trim());
        });
    });
}

function run(command, args) {
    console.log(`\n$ ${command} ${args.join(" ")}`);

    const proc = exec(`${command} ${args.join(" ")}`, {
        env: process.env,
    });
    process.stdin.pipe(proc.stdin);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    return new Promise((resolve, reject) => {
        proc.on("error", err => {
            console.error(err);
        });

        proc.on("close", code => {
            process.stdin.unpipe(proc.stdin);
            if (code === 0) {
                resolve();
            } else {
                reject(`Process exited with code ${code}`);
            }
        });
    });
}

async function main() {
    const { version } = require("../package.json");
    const versionCorrect = await prompt(`Publish version ${version}? [yN] `);
    if (versionCorrect.toLowerCase() !== "y") {
        process.exit(1);
    }

    await run("yarn", ["compile"]);
    await run("npm", ["publish", "--dry-run"]);

    const push = await prompt("\nDoes this look good? [yN] ");
    if (push.toLowerCase() !== "y") {
        process.exit(1);
    }

    await run("git", ["commit", "-am", `v${version}`]);
    await run("git", ["tag", `v${version}`]);
    await run("git", ["push"]);
    await run("git", ["push", "--tags"]);
    await run("npm", ["publish"]);
}

main().catch(console.error);
