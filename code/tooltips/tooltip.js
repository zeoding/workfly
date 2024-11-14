import Vue from 'vue'
import { createPopper } from '@popperjs/core'

const createTooltip = () => {
  const tooltip = document.createElement('div')
  // 添加箭头元素
  tooltip.innerHTML = '<div class="el-tooltip__arrow"></div><div class="el-tooltip__content"></div>'
  tooltip.className = 'el-tooltip__popper is-dark'
  tooltip.style.display = 'none'
  document.body.appendChild(tooltip)
  return tooltip
}

Vue.directive('el-tooltip', {
  bind(el, binding) {
    const tooltip = createTooltip()

    el.$tooltip = {
      el: tooltip,
      content: binding.value,
      popper: null
    }

    // 更新内容到 content div
    tooltip.querySelector('.el-tooltip__content').textContent = binding.value

    el.$tooltipHandler = {
      mouseenter(e) {
        const tooltip = el.$tooltip
        tooltip.el.style.display = 'block'
        tooltip.el.querySelector('.el-tooltip__content').textContent = tooltip.content

        if (!tooltip.popper) {
          tooltip.popper = createPopper(el, tooltip.el, {
            placement: binding.modifiers.top ? 'top' :
              binding.modifiers.right ? 'right' :
                binding.modifiers.bottom ? 'bottom' : 'top',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
              {
                name: 'arrow',
                options: {
                  element: tooltip.el.querySelector('.el-tooltip__arrow'),
                  padding: 5, // 箭头和边界的距离
                },
              },
            ],
          })
        } else {
          tooltip.popper.update()
        }
      },
      mouseleave(e) {
        if (el.$tooltip) {
          el.$tooltip.el.style.display = 'none'
        }
      }
    }

    // 绑定事件
    el.addEventListener('mouseenter', el.$tooltipHandler.mouseenter)
    el.addEventListener('mouseleave', el.$tooltipHandler.mouseleave)
  },

  update(el, binding) {
    if (el.$tooltip) {
      el.$tooltip.content = binding.value
    }
  },

  unbind(el) {
    // 移除事件监听
    if (el.$tooltipHandler) {
      el.removeEventListener('mouseenter', el.$tooltipHandler.mouseenter)
      el.removeEventListener('mouseleave', el.$tooltipHandler.mouseleave)
    }

    // 清理tooltip
    if (el.$tooltip) {
      if (el.$tooltip.popper) {
        el.$tooltip.popper.destroy()
      }
      el.$tooltip.el.remove()
      delete el.$tooltip
    }
  }
})