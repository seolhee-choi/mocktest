import { AdaptiveActionContainer } from "../actions/adaptive-container";
import { Action } from "../actions/action";
import { AdaptiveElement } from "../action-bar";
import { AdaptiveActionBarItemWrapper } from "survey-core";

interface IDimensions {
  scroll: number;
  offset: number;
}

export class ResponsivityManager {
  private resizeObserver: ResizeObserver = undefined;
  private isInilized = false;
  protected minDimensionConst = 56;
  separatorSize = 17;

  public getComputedStyle: (
    elt: Element
  ) => CSSStyleDeclaration = window.getComputedStyle.bind(window);

  constructor(
    protected container: HTMLDivElement,
    private model: AdaptiveElement | AdaptiveActionContainer,
    private itemsSelector: string,
    private dotsItemSize: number = 48
  ) {
    this.resizeObserver = new ResizeObserver((_) => this.process());
    this.resizeObserver.observe(this.container.parentElement);
  }

  get items(): Array<Action | AdaptiveActionBarItemWrapper> {
    if (this.model instanceof AdaptiveActionContainer)
      return this.model.actions;
    else if (this.model instanceof AdaptiveElement) return this.model.items;
  }

  protected getDimensions(element: HTMLElement): IDimensions {
    return {
      scroll: element.scrollWidth,
      offset: element.offsetWidth,
    };
  }

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let space = this.container.offsetWidth;
    if (style.boxSizing === "border-box") {
      space -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    return space;
  }

  protected calcItemSize(item: HTMLDivElement): number {
    return item.offsetWidth;
  }

  private calcItemsSizes() {
    this.container
      .querySelectorAll(this.itemsSelector)
      .forEach((item: HTMLDivElement, index: number) => {
        let currentItem = this.items[index];
        currentItem.maxDimension = this.calcItemSize(item);
        currentItem.minDimension = currentItem.canShrink
          ? this.minDimensionConst +
            (currentItem.needSeparator ? this.separatorSize : 0)
          : currentItem.maxDimension;
      });
  }

  private getVisibleItemsCount(size: number): number {
    const itemsSizes: number[] = this.items.map(
      (item) => item.minDimension
    );
    let currSize: number = 0;
    for (var i = 0; i < itemsSizes.length; i++) {
      currSize += itemsSizes[i];
      if (currSize > size) return i;
    }
    return i;
  }

  private updateItemMode(dimension: number, minSize: number, maxSize: number) {
    const items = this.items;
    for (let index = items.length - 1; index >= 0; index--) {
      if (minSize <= dimension && dimension < maxSize) {
        maxSize -= items[index].maxDimension - items[index].minDimension;
        items[index].mode = "small";
      } else {
        items[index].mode = "large";
      }
    }
  }

  public fit(dimension: number) {
    if (dimension <= 0) return;

    this.model.removeDotsButton();
    let minSize = 0;
    let maxSize = 0;

    this.items.forEach((item) => {
      minSize += item.minDimension;
      maxSize += item.maxDimension;
    });

    if (dimension >= maxSize) {
      this.items.forEach((item) => (item.mode = "large"));
    } else if (dimension < minSize) {
      this.items.forEach((item) => (item.mode = "small"));
      this.model.showFirstN(
        this.getVisibleItemsCount(dimension - this.dotsItemSize)
      );
    } else {
      this.updateItemMode(dimension, minSize, maxSize);
    }
  }

  private process(): void {
    if (!this.isInilized) {
      this.calcItemsSizes();
      this.isInilized = true;
    }
    this.fit(this.getAvailableSpace());
  }

  public dispose(): void {
    this.resizeObserver.disconnect();
  }
}

export class VerticalResponsivityManager extends ResponsivityManager {
  protected minDimensionConst = 40;

  constructor(
    container: HTMLDivElement,
    model: AdaptiveElement,
    itemsSelector: string,
    dotsItemSize?: number
  ) {
    super(container, model, itemsSelector, dotsItemSize);
  }

  protected getDimensions(): IDimensions {
    return {
      scroll: this.container.scrollHeight,
      offset: this.container.offsetHeight,
    };
  }

  protected getAvailableSpace(): number {
    const style: CSSStyleDeclaration = this.getComputedStyle(this.container);
    let space: number = this.container.offsetHeight;
    if (style.boxSizing === "border-box") {
      space -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    return space;
  }

  protected calcItemSize(item: HTMLDivElement): number {
    return item.offsetHeight;
  }
}
