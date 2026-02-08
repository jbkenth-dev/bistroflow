export function flyToCart(sourceEl: HTMLElement | null, imageUrl?: string) {
  if (!sourceEl || typeof window === "undefined" || typeof document === "undefined") return;
  const fabTarget = document.getElementById("cart-fab");
  const target = fabTarget;
  if (!target) return;
  const sRect = sourceEl.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  const startX = sRect.left;
  const startY = sRect.top;
  const width = sRect.width;
  const height = sRect.height;
  const endX = tRect.left + tRect.width / 2 - width / 2;
  const endY = tRect.top + tRect.height / 2 - height / 2;

  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.zIndex = "9999";
  el.style.borderRadius = "12px";
  el.style.background = imageUrl ? `center / cover no-repeat url("${imageUrl}")` : "currentColor";
  el.style.opacity = "0.9";
  el.style.transform = "translate(0,0) scale(1)";
  el.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease";
  el.style.willChange = "transform, opacity";
  el.style.pointerEvents = "none";
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.5)`;
    el.style.opacity = "0.2";
  });

  const cleanup = () => {
    el.remove();
  };
  el.addEventListener("transitionend", cleanup, { once: true });
}
