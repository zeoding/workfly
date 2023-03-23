```js
指令部分

Vue.directive('tooltip', {
  bind: function(el, binding) {
    el.addEventListener('mouseenter', function() {
      if (el.offsetWidth < el.scrollWidth) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = binding.value;
        document.body.appendChild(tooltip);
        const rect = el.getBoundingClientRect();
        tooltip.style.top = rect.top + 'px';
        tooltip.style.left = rect.right + 'px';
      }
    });
    el.addEventListener('mouseleave', function() {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  }
});
```

```vue
使用部分

<div v-tooltip="123"></div>
```
