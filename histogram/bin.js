/** 
 * 使用 Math.random()生成均匀分布 data[]
 */
function Uniform(min, max, cnt) {
  var data = new Array(cnt);
  for (let i = 0; i < cnt; i++) {
    data[i] = Math.random() * (max - min) + min;
  }
  console.log(data);
  return data;
}

/** 
 * 处理data[], 返回 bin[], bin的内容是每个分组的元素 以及x0, x1
 * 出于测试目的和方便起见，设定分组数固定为8组
 */
function bin() {
  var value = (x => x), // 获得目标数据，可以自定义
      domain = (values => {
        let min, max;
        for (const value of values) {
          if (value != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
        return [min, max];
      }), // 获得极差
      threshold = (x => 8); // 默认分为8组, 则需要9个分界点
  
  function histogram(data) {
    if (!Array.isArray(data)) data = Array.from(data);

    var i,
        n = data.length,
        values = new Array(n);
    
    for (i = 0; i < n; i++) {
      values[i] = value(data[i]);
    }
    // 计算9个分界点
    var xz = domain(values),
        min = Math.floor(xz[0]),
        max = Math.ceil(xz[1]),
        m = threshold(values),
        tz = new Array(m+1),
        step = Math.floor((max - min)/m);

    tz[0] = min,
    tz[m] = max;
    
    for (i = 1; i < m; i++) {
      tz[i] = tz[i-1] + step;
    }

    // 将各个数据放到对应的bin中（计数即可）
    var bins = new Array(m),
        bin;

    for (i = 0; i < m; i++) {
      bin = bins[i] = [];
      bin.x0 = tz[i];
      bin.x1 = tz[i+1];
    }
    for (i = 0; i < n; i++) {
      bins[Math.min(m-1, Math.floor((values[i] - min)/step))].push(data[i]); // 必须要是array.push()，才会让bins[i]保留x0,x1属性
    }
    console.table(bins)
    return bins;
  }
  return histogram; // 此处要返回内部的函数！！才可以调用new bin()(data)
}

function drawHistogram(bins) {
  let i = 0,
      threshold = bins.length,
      gap = 1,
      yTick = 10,
      col_width = 50,
      marginLeft = 30, // y坐标轴预留宽度
      marginBottom = 20,  // x坐标轴预留高度
      marginTop = 20,
      width = (col_width+2*gap)*threshold+marginLeft, // 总宽 = 每个矩形宽度*组数
      height = 400; // 总高
  
  let scaleLinear = (x, X, y) => y*X/x;

  function xTick(svg, text, x, y) {
    let xText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xText.textContent = text
    xText.setAttribute("x", x);
    xText.setAttribute("y", y);
    xText.setAttribute("text-anchor", "middle");
    xText.setAttribute("font-size", 12);
    svg.appendChild(xText);
  }

  function drawLine(svg, x1, y1, x2, y2) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute("style", "stroke:black;stroke-width:1");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    svg.appendChild(line);
  }
  let maxY = 0, sumY = 0;
  for (i = 0; i < threshold; i++) {
    if (bins[i].length > maxY) maxY = bins[i].length;
    sumY += bins[i].length;
  }
  // 通过createElementNS创建svg元素并设置属性, 必须带有命名空间
  let svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); 	
  svg.setAttribute("style","width:100%;height:100%;");
  svg.setAttribute("width",width);
  svg.setAttribute("height", height);		

  // 绘制x坐标轴
  drawLine(svg, marginLeft-1, height-marginTop-marginBottom*9/10, width-marginLeft/2, height-marginTop-marginBottom*9/10);
  // 绘制y坐标轴
  drawLine(svg, marginLeft-1, height-marginTop-marginBottom*9/10, marginLeft-1, marginTop);
  for (i = 0; i <= yTick; i++) {
    let yText = sumY/4/yTick*i,
        yHeight = scaleLinear(sumY/4, height-marginTop, yText);
    xTick(svg, yText, marginLeft/2, height - yHeight - marginTop - marginBottom);
  }
  // 绘制柱状图
  for (i = 0; i < threshold; i++) {
    let y = scaleLinear(sumY/4, height-marginTop, bins[i].length);
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute("x", marginLeft+col_width*i + gap);
    rect.setAttribute("y", height - marginTop - marginBottom - y);
    rect.setAttribute("width", col_width - gap);
    rect.setAttribute("height", y);
    rect.setAttribute("style","fill:steelblue;");
    svg.appendChild(rect);
    // 绘制x轴刻度
    xTick(svg, bins[i].x0, marginLeft+col_width*i, height - marginTop - marginBottom/4);
    if (i == threshold-1) xTick(svg, bins[i].x1, marginLeft+col_width*(i+1), height-marginTop - marginBottom/4);
    // 绘制柱状图文字
    xTick(svg, bins[i].length, marginLeft+col_width*i+gap+col_width/2, height - marginTop - marginBottom - y - 5);
  }
  
  document.body.appendChild(svg);
}