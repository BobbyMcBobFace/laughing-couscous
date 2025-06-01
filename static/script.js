document.getElementById("runBtn").addEventListener("click", () => {
    const language = document.getElementById("language").value;
    const code = document.getElementById("code").value;
    const input = document.getElementById("input").value;

    fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input }),
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("output").textContent =
            `Exit code: ${data.exit_code}\n` +
            `Execution time: ${data.exec_time_ms} ms\n` +
            `Standard Output:\n${data.stdout}\n` +
            `Standard Error:\n${data.stderr}`;
    })
    .catch(err => {
        document.getElementById("output").textContent = "Error: " + err;
    });
});

