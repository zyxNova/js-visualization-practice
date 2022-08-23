function barChart(data, {
  x = (data => data),
  y = x,
  xDomain,
  yDomain, // 数据的定义域
  marginTop = 30,
  marginDown = 20,
  marginLeft = 50,
  marginRight = 0,
  width = 1080,
  height = 560,
  xRange = [marginLeft, width - marginRight],
  yRange = [marginTop, height - marginDown], // x和y轴画框范围
  xPadding = 0.1, // padding/bandwidth的比例，不是像素绝对大小
  xScale,
  yScale,
  yFormat = d3.format(".0~%"),
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
  // 获取canvas元素
  const canvas = document.getElementById("barChart");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  if (canvas.getContext) { // 确保浏览器可以正常显示canvas元素
    const ctx = canvas.getContext('2d'); // 获得画布
    // 绘制不动的部分，包括y轴和x轴
    drawStatic();
    
    for (let i=0; i < xDomain.length; i++) {
      let xPosition = marginLeft + (i+1)*xScale.step() - xScale.bandwidth()/2;
      // 绘制x轴tick，使用path2D
      const xDash = new Path2D(`M ${xPosition} ${yRange[1]} v 5`);
      ctx.stroke(xDash);
      // 绘制x轴text
      ctx.fillText(`${xDomain[i]}`,xPosition, yRange[1]+17);
      data[i].xPos = xPosition; // 记录当前tick, text和矩形的位置，方便动画生成
      // 绘制矩形
      ctx.save();
      ctx.fillStyle = 'steelblue';
      ctx.globalAlpha = 0.8;
      let dy = yScale(Y[i]) - yScale(0);
      ctx.fillRect(marginLeft+xScale.padding()*xScale.step()+i*xScale.step(), yRange[1]-dy, xScale.bandwidth(), dy);
      ctx.restore();
    }

    function drawStatic() {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = '0.5px';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      // 绘制y坐标轴
      let yCnt = 10;
      let yStep = Math.ceil((yRange[1] - yRange[0])/yCnt);
      for (let i=0;i<yCnt;i++) {
        let yPosition = yRange[1] - i*yStep;
        const yDash = new Path2D(`M ${marginLeft-5} ${yPosition} h 5`);
        ctx.stroke(yDash);
        ctx.fillText(yFormat(Math.abs(Number((d3.scaleLinear().domain(yRange).range(yDomain)(marginDown+i*yStep))))), marginLeft-19, yPosition+3);
        ctx.save();
        ctx.strokeStyle = '#cccccc';
        ctx.globalAlpha = 0.5; // 不透明度为0.5
        const yGrid = new Path2D(`M ${marginLeft} ${yPosition} H ${xRange[1]}`);
        ctx.stroke(yGrid);
        ctx.restore();
      }
      // 绘制x坐标轴
      const xLine = new Path2D(`M ${xRange[0]} ${yRange[1]} h ${xRange[1]-xRange[0]}`);
      ctx.stroke(xLine);
    }
  }
  // 将barChart的参数封装在update闭包中
  return function update(order, progress) {
    data = d3.sort(data, order);
    console.log(data);
    // 更新x和y轴的定义域
    let X = d3.map(data, d => d.letter);
    let Y = d3.map(data, d => d.frequency);
    yDomain = [0, d3.max(Y)];
    xDomain = X;
    // 获取canvas元素
    const canvas = document.getElementById("barChart");
    if (canvas.getContext) { // 确保浏览器可以正常显示canvas元素
      const ctx = canvas.getContext('2d'); // 获得画布
      ctx.clearRect(0,0,width,height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = '0.5px';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      // 绘制不动的部分
      drawStatic();
      for (let i=0; i < xDomain.length; i++) {
        const oldPos = data[i].xPos;
        const newPos = marginLeft + (i+1)*xScale.step() - xScale.bandwidth()/2;
        const cur = oldPos + (newPos - oldPos) * progress;
        const xDash = new Path2D(`M ${cur} ${yRange[1]} v 5`);
        ctx.stroke(xDash);
        // 绘制x轴text
        ctx.fillText(`${xDomain[i]}`,cur, yRange[1]+17);
        // 绘制矩形
        ctx.save();
        ctx.fillStyle = 'steelblue';
        ctx.globalAlpha = 0.8;
        let dy = yScale(Y[i]) - yScale(0);
        ctx.fillRect(cur-xScale.step()/2, yRange[1]-dy, xScale.bandwidth(), dy);
        ctx.restore();
        if (progress === 1) data[i].xPos = newPos;
      }
    }
  }
}

function animate({timing, draw, duration, order}) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    // timeFraction 从 0 增加到 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    // 计算当前动画状态
    let progress = timing(timeFraction);
    draw(order, progress); // 绘制
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
});
}

let update;
d3.csv("alphabet.csv").then((data) => {
  update = barChart(data, {
    x: d => d.letter,
    y: d => d.frequency
  });
});
const order = [(a, b) => d3.ascending(a.letter, b.letter),
              (a, b) => d3.ascending(a.frequency, b.frequency),
              (a, b) => d3.descending(a.frequency, b.frequency)];

function change() {
  const select = document.getElementById("mySelect").value;
  console.log(select);
  animate({
    duration: 1500,
    timing: x => 1 - (1 - x) * (1 - x),
    draw: update,
    order: order[select]
  })
}