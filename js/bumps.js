
function bump(a, n) {
    const x = 6 / (0.1 + Math.random());
    const y = 5 * Math.random() - 0.5;
    const z = 20 / (0.1 + Math.random());
    for (let i = 0; i < n; ++i) {
        const w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
    }
}

function bumps(n, m) {
    const a = Array(n).fill(0);
    for (let i = 0; i < m; ++i) bump(a, n);
    return a;
}
