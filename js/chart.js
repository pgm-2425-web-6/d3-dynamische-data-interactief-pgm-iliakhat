const width = 928;
const height = 500;

const categories = ["Cars", "Bikes", "Scooters", "Pedestrians"]; // Traffic accident categories
const n = categories.length; // Number of categories
const m = 500; // Number of time intervals (e.g., days)
const k = 30; // Number of bumps per series

const x = d3.scaleLinear([0, m - 1], [0, width]); // Time scale
const y = d3.scaleLinear([0, 1], [height, 0]); // Accident count scale
const z = d3.scaleOrdinal(d3.schemeTableau10); // Color palette for categories

const area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

const stack = d3.stack()
    .keys(d3.range(n))
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderNone);

function bumps(n, k) {
    const values = Array.from({ length: n }, () => 0);
    for (let i = 0; i < k; i++) {
        const x = (1 / (0.1 + Math.random())) * (Math.random() < 0.5 ? -1 : 1);
        const w = 10 / (0.1 + Math.random());
        const center = Math.random() * n;
        for (let j = 0; j < n; j++) {
            const dist = (j - center) / w;
            values[j] += Math.exp(-dist * dist);
        }
    }
    return values.map(v => Math.max(0, v));
}

function randomize() {
    const layers = stack(d3.transpose(Array.from({ length: n }, () => bumps(m, k))));
    y.domain([
        d3.min(layers, l => d3.min(l, d => d[0])),
        d3.max(layers, l => d3.max(l, d => d[1]))
    ]);
    return layers;
}

const svg = d3.select("#chart-container")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

const path = svg.selectAll("path")
    .data(randomize())
    .join("path")
    .attr("d", area)
    .attr("fill", (d, i) => z(categories[i])); // Assign category colors

// Add legend in the bottom-left corner
const legend = svg.selectAll(".legend")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${20}, ${height - (n * 20) - 20 + i * 20})`);

legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d, i) => z(categories[i]));

legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(d => d);

async function update() {
    while (true) {
        await path
            .data(randomize())
            .transition()

            .duration(1000)
            .attr("d", area)
            .end();
    }
}

update();
