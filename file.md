## TC39, ECMAScript和Javascript的未来

> 本文译自[Nicolás Bevacqua](https://ponyfoo.com/contributors/ponyfoo)—— [TC39, ECMAScript, and the Future of JavaScript](https://ponyfoo.com/articles/tc39-ecmascript-proposals-future-of-javascript#what-s-tc39)

上周，我在中国深圳举办的腾讯前端大会上发表了一篇同名文章。在此我按照最适合PonyFoo网站展示风格对此篇文章进行整理并发布，希望大家可以喜欢。

### 什么是TC39？

TC39意为第39号技术委员会，是根据"ECMAScript"准则标准化JavasScript语言的ECMA机构的一部分。

ECMAScript准则定义了JavaScript是如何在离散的循序渐进的基本法则中运行的。除此之外，该准则还解释了：

* 为何字符串'A'是'NaN'类型
* 为何字符串'A'不等于NaN
* 为何NaN是NaN类型，但却不等于NaN
* 以及为何引入Number.isNaN是一个非常明智的决定

```javascript
isNaN(NaN) // true
isNaN('A') // true
'A' == NaN // false
'A' === NaN // false
NaN === NaN // false
// … solution!
Number.isNaN('A') // false
Number.isNaN(NaN) // true
```

解释了何时正零等于负零，何时又不相等：

```javascript
+0 == -0 // true
+0 === -0 // true1
/+0 === 1 / -0 // false
```

并且对只使用叹号、圆括号、方括号以及加号的合法的JavaScript表达式进行编码等更优秀的特性的实现变成可能。查阅[JSFuck](http://www.jsfuck.com/)可以更深入的了解如何通过使用"+!()[]"来编写JavaScript.

但是非常严肃地说，那些由TC39处理的吃力不讨好的事情却是弥足珍贵的。

TC39基于一套非常完备的流程规范去不断的拓展语言特性。一旦一个方案足够完善时，TC39就会根据这个方案去更新现有的准则。很早之前，TC39都是基于一套'Mircosoft Word'的古老的流式系统。但是当ES3标准发布后，长达十年的时间里该套准则都没有明显的变化，在此之后又经过了四年的时间ES6标准才逐渐被制定和发布。

自从ES6标准推出后，该组织积极采纳各类提议以便应对更现代化的需求。新的审核流程使用HTML的超集去格式化每个提议。他们通过[GitHub pull requests](https://github.com/tc39/proposals)去促进社区讨论的发展以及搜集更多的提议。这使得新的规范更具有生命力，提议被采纳的速度更高效，我们终于不必再花费很多年去等待一个新版本规范的发布了。

新的审核流程包含四个成熟阶段，一个提议越接近完备，那么最终它被添加进新规范的几率就越高。

####阶段0
任何还未被当成正式提议提交的讨论和想法都将在阶段0中被视作"稻草人"提案。这些提案只能由TC39的成员来创建，直至今日已经有超过一打的"稻草人"提案了。

阶段0中的这些提案包含了[cancellation tokens](https://github.com/tc39/proposal-cancellation)，作为Angular团队的一项提案与其他很多提案一样都未被采纳进阶段1，

####阶段1
在阶段1中每一个提案都是被正式化的，并且被期望是支持横向扩展的，可以与其他提案进行互动，以及是可执行的可实现的。这个阶段的提案被定义成离散的各类问题，并且能够为这些问题提供一个具体的解决方案。

阶段1中的提案经常包含一个高级别的API描述、使用范例以及内部的语义和算法的讨论。这些提案在整个审核流程中都可能发生重大的改变。

近期，在阶段1中的某些提案包含:[Observable](https://ponyfoo.com/articles/observables-coming-to-ecmascript)、[do](https://ponyfoo.com/articles/proposal-statements-as-expressions-using-do)表达式以及箭头函数的生成器和[Promise.try](https://github.com/tc39/proposal-promise-try).

####阶段2
在阶段2中需要开始逐步制定新规则的初稿。

基于此点，执行者们有理由开始在运行时进行各类实际的尝试。这类尝试可以有以下几种形式：polyfill或者在运行时被附着于提案的用户代码；一种至始至终都被用来支持提案的，亦或是构建时的诸如Babel的编译器执行引擎。

在第二阶段，目前已有诸如[public class fields](https://github.com/tc39/proposal-class-fields), [private class fields](https://medium.com/the-thinkmill/javascripts-new-private-class-fields-93106e37647a), [decorators](https://ponyfoo.com/articles/javascript-decorators-proposal)以及[Promise#finally](https://github.com/tc39/proposal-promise-finally)

####阶段3
第三阶段的核心内容是关于候选提案的推荐。在这个高级阶段，规范的编写者和指定的相关评委必须发布最终版的规范。在此阶段已经不太可能再去改变那些由非正规途径定义的一些无法修复的问题。

执行者们应该对提案抱有浓厚的兴趣，否则得不到他们支持的提案就会胎死腹中。在实践过程中，能够进行到这一阶段的提案都至少包含一项浏览器相关的事项，一个高保真的polyfill，或者是能在构建时被诸如Babel之类的解析器所支持。

第三阶段有一些振奋人心的设计方案，诸如[object rest and spread](https://github.com/tc39/proposal-object-rest-spread), [asynchronous iteration](https://ponyfoo.com/articles/javascript-asynchronous-iteration-proposal),以及 [import()](https://github.com/tc39/proposal-dynamic-import)方法和针对于常规表达式的[better Unicode support](https://ponyfoo.com/articles/regular-expressions-post-es6)

####阶段4
在最后的阶段中，至少有两项独立的测试被用来验收进入到该阶段的提案。所有通过第四阶段验收的提案都会被采纳进下一版本的ECMAScript规范中。

自从修正版被大肆改革后，诸如[Async functions](https://ponyfoo.com/articles/understanding-javascript-async-await), [Array#includes](https://github.com/tc39/Array.prototype.includes/)以及[exponentiation operator](https://github.com/rwaldron/exponentiation-operator)等提案被制定进了第四阶段。

###JavaSrcipt的未来

TC39目前正在处理超过30项新提案。那么，在不久的将来我们还将看到哪些新特性呢？
最近一段时间，我们通过NPM下载了很多包工具。我们通过webpack去管理复杂的应用程序，通过Babel使用最新的语言特性，通过uglifyjs和rollup等工具去压缩代码，使用eslint和prettier管控代码质量和制定代码规范，使用NodeJs和Electron在任何地方运行javascript代码。

####Transpliation和ECMAScript标准

所有的ES6新特性都将被主流浏览器所支持，但我们依然要感谢Babel使得我们能够提早很长一段时间就开始使用这些特性。Babel在很早就开始避免让自己只演变成一个ES6新语法的解析器，如今你能够轻松使用在ES6高级阶段的各项特性是归功于Babel的插件。当浏览器对于ES6特性的支持程度越来越高后，我们希望Babel可以暂停对于ES6新语法的转换。在那时，我们已经在使用ES6提供的更新的诸如异步函数和类修饰器等特性，这些依然需要解析。

从这个意义上讲，我们可以将transpilation看成是一个只对那些绝对必要的特性进行转换的移动窗口，这些特性是用来最大化浏览器对于产品的支持的。一个现代化网站开发的关键点在于支持自动更新的的浏览器，这类浏览器可以使得Babel瘦身。当浏览器能够支持最新的特性，那么需要通过Babel转换的代码就变得越来越少了。然而，Babel依然在开发阶段使得我们能够更容易的使用最新特性提供了最关键的支持。

Babel简化了实际使用者与特性制定者间的反馈过程，并且避免了新特性投入正式开发过程之前的真空期。

####Linting和代码质量

在过去,我们有JSLint和JSHint两大代码规范工具，但是这两者都被当作是强制性的代码规范工具。而ESLint是以一种完全可配置的解决方案被世人所熟知的，通过该工具可以使我们精确的控制那些想要通过额外的代码规范去管理的代码块。
在不久的将来，我们可以期盼着使用到更标新立异的诸如Prettier之类的工具，通过这些工具可以根据我们制定的代码规范自动格式化整个代码库。

####Bundling和臃肿复杂的应用场景

自从有了CommonJS模块的定义以来,Browserify重新定义了前端开发的模式.然而Webpack通过提供强大的模块化解决方案以及管理样式和图片文件的能力完胜browserify,并且逐渐演变成不只是javascript语言的构建工具,而是前端所有静态资源的构建神器.

这种解决方案是比较有趣的,因为webpack可以以非常简单的方式去处理各类臃肿复杂的应用场景,并且目前这种方案还是独树一帜的.在不久的将来,我们希望webpack可以像目前我们正在讨论的其他工具一样变得越来越简易,或者直接被另一个简单易用的工具所替代.

####Experimentation

最后,我们不得不提一下Facebook最新发布的工具——[Prepack](https://prepack.io/).这款工具是目前独一无二的专门用来缩减由于间接原因导致的代码库臃肿的成熟的Javascript解析器.

它的目标是减少在构建过程中由预编译行为所产生的项目初始化时的系统开销.举例而言,我们可能会有以下代码段:

```javascript
(function () {
  function fibonacci(x) {
    return x <= 1 ? x : fibonacci(x - 1) + fibonacci(x - 2)
  }
  global.x = fibonacci(23)
})()
```

Prepack会在构建过程中使用完备的解析器去解析这段代码,并且将其转换成如下形式:

```javascript
(function () {
  x = 28657
})()
```

Prepack最终可能会成为黄金法则,但是目前还只是一种尝试.