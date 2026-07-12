import type { DirectiveBinding, Directive } from "vue";

type TooltipValue = string | { value: string; showDelay?: number };

type TooltipBinding = DirectiveBinding<TooltipValue>;

interface TooltipEl extends HTMLElement {
  _tooltip: {
    tip: HTMLDivElement;
    show: () => void;
    hide: () => void;
  };
}

const getValue = (binding: TooltipBinding) =>
  typeof binding.value === "object" ? binding.value.value : binding.value;

const tooltip: Directive<TooltipEl, TooltipValue> = {
  mounted(el: TooltipEl, binding: TooltipBinding) {
    const position = Object.keys(binding.modifiers).find((k) => binding.modifiers[k]) ?? "right";
    const tip = Object.assign(document.createElement("div"), {
      textContent: getValue(binding),
    });

    Object.assign(tip.style, {
      position: "fixed",
      zIndex: "99999",
      background: "rgba(30, 30, 30, 0.85)",
      color: "#fff",
      fontSize: "12px",
      fontFamily: "inherit",
      padding: "4px 10px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.12s ease, transform 0.12s ease",
      transform: "translateY(-50%) translateX(-4px)",
    });
    document.body.appendChild(tip);

    const show = () => {
      const { top, bottom, left, right, width, height } = el.getBoundingClientRect();
      const pos: Record<string, Partial<CSSStyleDeclaration>> = {
        right: { top: `${top + height / 2}px`, left: `${right + 10}px` },
        left: { top: `${top + height / 2}px`, left: `${left - tip.offsetWidth - 10}px` },
        top: {
          top: `${top - tip.offsetHeight - 8}px`,
          left: `${left + width / 2 - tip.offsetWidth / 2}px`,
        },
        bottom: { top: `${bottom + 8}px`, left: `${left + width / 2 - tip.offsetWidth / 2}px` },
      };
      Object.assign(tip.style, pos[position]);
      requestAnimationFrame(() => {
        tip.style.opacity = "1";
        tip.style.transform = "translateY(-50%) translateX(0)";
      });
    };

    const hide = () => {
      tip.style.opacity = "0";
      tip.style.transform = "translateY(-50%) translateX(-4px)";
    };

    el._tooltip = { tip, show, hide };
    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
  },

  updated(el: TooltipEl, binding: TooltipBinding) {
    if (el._tooltip) el._tooltip.tip.textContent = getValue(binding);
  },

  unmounted(el: TooltipEl) {
    el.removeEventListener("mouseenter", el._tooltip.show);
    el.removeEventListener("mouseleave", el._tooltip.hide);
    el._tooltip.tip.remove();
  },
};

export default tooltip;
