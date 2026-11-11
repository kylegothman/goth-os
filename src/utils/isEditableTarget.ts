/** True when a keyboard event is aimed at a text field (input, textarea, select, contenteditable). */
export const isEditableTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
