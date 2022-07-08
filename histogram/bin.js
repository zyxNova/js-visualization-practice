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
 * 处理data[], 返回 bin[], bin的内容是每个分组的频数, 以及x0, x1
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

