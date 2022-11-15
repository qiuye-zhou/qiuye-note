---
lang: zh-CN
title: CSS specificity
description: CSS 中关于选择器的权重
---
# CSS specificity

##### CSS specificity 即 CSS 中关于选择器的权重，以下选择器权重依次下降

1. id 选择器 (#app)
2. class、attribute、pseudo-classes(伪类选择器) 选择器 (.header、[type="radio"]、:hover)
3. type 标签选择器、伪元素选择器 (h1、p、::before)

其中他通配符选择器*、组合选择器+ ~ >、否定伪类选择器 :not() 对优先级无影响

另外内联样式`<div class="aoo" style="color: red;"></div>` 及`!importtant`(最高)具有更高的权重

对于标签自有的属性，选择器的优先级规则为:

```
内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器
```

##### CSS 权重值计算：

w3 给出的解释,我们可以讲 CSS 的权重等级分为 A、B、C 3 类，他们分别对应着 A(id 选择器)，B(class 选择器、属性选择器、伪类选择器)，C(标签选择器、伪元素选择器)。

将一个选择器整体计算 ABC 分别进行求和得到一个数组(A，B ，C)，数组值依次比较，选取最高的，如果都相等那么选取靠后的。

当然也有一些比较特殊的伪类选择器进行权重进行特殊的处理：

1. 选择器:is()、:not()、:has()的优先级是选择器列表中最具有复杂性的选择器的优先级取代。

2. 选择器:nth-child()、:nth-last-child()的优先级是伪类本身的优先级（计为一个伪类选择器，也就是计为 B），再加上选择器列表中最具复杂性的选择器的优先级。

3. 选择器:where()伪类的优先级被零代替，也就是没有优先级，再优先级计算中不做数。

4. 通用选择符以及其他选择符在优先级中不计数。

#### 扩展

##### 如何避免CSS样式冲突
1. 使用后代选择器或子代选择器，描述越多越细，优先级越高，优先级高的覆盖优先级低的描述。

2. 改变CSS样式顺序，相同类型选择器指定的样式，后面的会覆盖前面的。

3. 使用css module和css scope都可以生成唯一属性, css scope是在vue的style标签上的，并不能完全避免，全局如果有一个同名的类名仍然不能区分。

4. 使用BEM命名，组件内部元素的名字都加上组件名，并用元素的名字作为选择器，即规定为：modular-name__element-name__modifier-name，也就是模块名 + 元素名 + 修饰器名。BEM命名禁止使用子代选择器，会使权重增大，如果需要后面的样式覆盖需要额外增加更多的选择器，且命名紊乱。