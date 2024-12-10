const width = 928;
const height = 500;

const n = 10; // Number of series
const m = 500; // Number of samples per series
const k = 50; // Number of bumps per series

const x = d3.scaleLinear([0, m - 1], [0, width]);
const y = d3.scaleLinear([0, 1], [height, 0]);
const z = d3.interpolateCool;

const area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

const stack = d3.stack()
    .keys(d3.range(n))
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderNone);

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
    .attr("fill", () => z(Math.random()));

async function update() {
    while (true) {
        await path
            .data(randomize())
            .transition()
            .delay(1000)
            .duration(1500)
            .attr("d", area)
            .end();
    }
}

update();
