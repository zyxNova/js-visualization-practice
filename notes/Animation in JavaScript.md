# Animation in JavaScript

[TOC]



## `requestAnimationFrame`

https://zh.javascript.info/js-animation

JavaScript 动画应该通过 `requestAnimationFrame` 实现。该内建方法允许设置回调函数，以便在浏览器准备重绘时运行。那通常很快，但确切的时间取决于浏览器。

当页面在后台时，根本没有重绘，因此回调将不会运行：动画将被暂停并且不会消耗资源。那很棒。

这是设置大多数动画的 helper 函数 `animate`：

```javascript
function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction 从 0 增加到 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // 计算当前动画状态
    let progress = timing(timeFraction);

    draw(progress); // 绘制

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
```

参数：

- `duration` —— 动画运行的总毫秒数。
- `timing` —— 计算动画进度的函数。获取从 0 到 1 的小数时间，返回动画进度，通常也是从 0 到 1。
- `draw` —— 绘制动画的函数。

当然我们可以改进它，增加更多花里胡哨的东西，但 JavaScript 动画不是经常用到。它们用于做一些有趣和不标准的事情。因此，您大可在必要时再添加所需的功能。

JavaScript 动画可以使用任何时序函数。我们介绍了很多例子和变换，使它们更加通用。与 CSS 不同，我们不仅限于 Bezier 曲线。

`draw` 也是如此：我们可以将任何东西动画化，而不仅仅是 CSS 属性。



## Using CSS transitions

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions#javascript_examples

### CSS Syntax

```css
div {
    transition: <property> <duration> <timing-function> <delay>;
}
```



### Multiple attributes

```css
.box {
    border-style: solid;
    border-width: 1px;
    display: block;
    width: 100px;
    height: 100px;
    background-color: #0000FF;
    transition: width 2s, height 2s, background-color 2s, transform 2s;
}

.box:hover {
    background-color: #FFCCCC;
    width: 200px;
    height: 200px;
    transform: rotate(180deg);
}
```

Another way:

```css
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s;
}
// equal to
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s, 3s, 5s;
}
```



### JavaScript Example

> **Note:** Care should be taken when using a transition immediately after:
>
> - adding the element to the DOM using `.appendChild()`
> - removing an element's `display: none;` property.
>
> This is treated as if the initial state had never occurred and the element was always in its final state. The easy way to overcome this limitation is to apply a `window.setTimeout()` of a handful of milliseconds before changing the CSS property you intend to transition to.

HTML:

```html
<p>Click anywhere to move the ball</p>
<div id="foo" class="ball"></div>
```

js:

```js
var f = document.getElementById('foo');
document.addEventListener('click', function(ev){
    f.style.transform = 'translateY('+(ev.clientY-25)+'px)';
    f.style.transform += 'translateX('+(ev.clientX-25)+'px)';
},false);
```

css:

```css
.ball {
  border-radius: 25px;
  width: 50px;
  height: 50px;
  background: #c00;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 1s;
}
```



## `EventTarget.addEventListener()`

https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

[Element: mouseover](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event#examples)，例子见chord diagram

