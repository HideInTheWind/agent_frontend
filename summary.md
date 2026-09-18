# function* 是什么？

function* 是 JavaScript 的 Generator 函数 语法，用来定义一种“可暂停、可恢复”的函数。

## 与普通函数的区别

| | 普通函数 | Generator (function*) |
| --- | --- | --- |
| 执行方式 | 一次跑完，直接 return | 可以多次 yield，每次暂停 |
| 返回值 | 单个值 | 一个 Iterator（迭代器） |
| 调用方式 | foo() | const gen = foo()，然后 gen.next() |

## 示例

```js
function* count() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = count();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }
```

## Async Generator（async function*）

加上 async 就是 Async Generator（async function*）：

```js
async function* fetchPages() {
  const page1 = await fetch('/api/page1');
  yield page1;

  const page2 = await fetch('/api/page2');
  yield page2;
}

// 消费方式
for await (const page of fetchPages()) {
  console.log(page);
}
```

## for await 本质上等价于

```js
  for await (const raw of parseSSEStream(reader)) {
    onEvent(raw as StreamEvent);
    if (raw.type === "done" || raw.type === "error") break;
  }
  // for await 本质上等价于：
  const gen = parseSSEStream(reader);

  while (true) {
    const { value, done } = await gen.next(); // 消费方主动要下一个值
    if (done) break;
    onEvent(value);
  }
```
