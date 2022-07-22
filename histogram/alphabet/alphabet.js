// import * as d3 from "d3";
// import * as d3 from "https://cdn.skypack.dev/d3@7";

function barChart(data, {
  x = (data => data),
  y = x,
  xDomain,
  yDomain, // 数据的定义域
  marginTop = 0,
  marginDown = 20,
  marginLeft = 20,
  marginRight = 0,
  width = 600,
  height = 400,
  xRange = width - marginLeft - marginRight,
  yRange = height - marginTop - marginDown, // x和y轴画框范围
  xPadding = 2,
  xScale,
  yScale
} = {}) {
  // 由原始数据获得x和y数据
  let X = d3.map(data, x);
  let Y = d3.map(data, y);
  // 获得x和y轴的定义域
  yDomain = [0, d3.max(Y)];
  xDomain = X;

  // 获得数据定义域与画布尺寸的比例尺
  xScale = d3.scaleBand().domain(xDomain).range(xRange).padding(xPadding);
  yScale = d3.scaleLinear().domain(yDomain).range(yRange);

  // 创建svg根元素
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(svg);
  
  // 绘制x坐标轴
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(xAxis);
  const xLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
  xAxis.appendChild(xLine);
  xLine.setAttribute("d",`M ${marginLeft} ${yRange} h ${xRange}`);
  xLine.setAttribute("style", "stroke:black;stroke-width:1");


  const yLine = document.createElementNS("http://www.w3.org/2000/svg", "path");

}