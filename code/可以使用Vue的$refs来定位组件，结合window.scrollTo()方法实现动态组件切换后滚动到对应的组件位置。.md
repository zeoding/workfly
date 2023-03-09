可以使用Vue的`$refs`来定位组件，结合`window.scrollTo()`方法实现动态组件切换后滚动到对应的组件位置。

首先，在每个需要定位的组件上设置`ref`属性，比如：

```vue
<component ref="component1" v-if="currentComponent === 'component1'"></component>
<component ref="component2" v-if="currentComponent === 'component2'"></component>
```

在组件切换的时候，利用`$nextTick`方法获取最新的DOM元素的位置信息并滚动到对应位置，代码如下：

```js
// 监听切换组件的事件
this.currentComponent = 'component1';
this.$nextTick(() => {
  const target = this.$refs.component1.$el;
  window.scrollTo(0, target.offsetTop); 
});
```

上面的代码实现了在切换到`component1`组件后滚动到对应的位置。同理，切换到其他组件也是一样的思路，只需要根据`ref`属性来获取对应的DOM元素即可。