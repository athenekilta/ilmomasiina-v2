/**
 * Use with `onBlur` handles to force `onBlur` to fire only when the whole
 * element and any of its children are blurred.
 *
 * Usage:
 * ```tsx
 * <div onBlur={onBlurDeep(e => doSomethingWithEvent(e))} >
 * 	<div>
 * 		Child
 * 	</div>
 * </div>
 * ```
 */
export function onBlurDeep(
  handler: (e: React.FocusEvent<HTMLElement, Element>) => void
) {
  return function (e: React.FocusEvent<HTMLElement, Element>) {
    const currentTarget = e.currentTarget;

    // Give browser time to focus the next element
    requestAnimationFrame(() => {
      // Run blur logic only if new focused element is not a child of the parent
      // element
      if (!currentTarget.contains(document.activeElement)) {
        handler(e);
      }
    });
  };
}
