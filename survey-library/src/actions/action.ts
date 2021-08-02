import { Base } from "../base";
import { property } from "../jsonobject";

/**
 * Defines an individual action. Action items can be displayed in certain survey elements - in Toolbar (or action bar), in titles (of pages, panels, questions), in matrix rows (as 'expand details' or 'remove row' buttons), and etc.
 */
export interface IAction {
  /**
   * Unique string id
   */
  id: string;
  /**
   * Set this property to false to make the toolbar item invisible.
   */
  visible?: boolean;
  /**
   * Toolbar item title
   */
  title?: string;
  /**
   * Toolbar item tooltip
   */
  tooltip?: string;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: boolean;
  /**
   * Set this property to false to hide the toolbar item title.
   */
  showTitle?: boolean;
  /**
   * A callback that calls on toolbar item click.
   */
  action?: (context?: any) => void;
  /**
   * Toolbar item css class
   */
  css?: string;
  /**
   * Toolbar inner element css class
   */
  innerCss?: string;
  /**
   * Toolbar item data object. Used as data for custom template or component rendering
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  needSeparator?: boolean; //TODO: temp
  /**
   * Set this property to true to activate the toolbar item (page)
   */
  active?: boolean;
  /**
   * Toolbar item template name
   */
  template?: string;
  /**
   * Toolbar item component name
   */
  component?: string;
  /**
   * Toolbar item icon name
   */
  iconName?: string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: any;
  /**
   * Gets or sets an action's location in a matrix question's row.
   *
   * The following options are available:
   *
   * - `start` - An action is located at the beginning of a row.
   * - `end` - An action is located at the end of a row.
   */
  location?: string;
  visibleIndex?: number;
}

export class Action extends Base implements IAction {
  constructor(item: IAction) {
    super();
    Object.assign(this, item);
  }
  location?: string;
  @property() id: string;
  @property() visible: boolean;
  @property() title: string;
  @property() tooltip: string;
  @property() enabled: boolean;
  @property() showTitle: boolean;
  @property() action: (context?: any) => void;
  @property() css: string;
  @property() innerCss: string;
  @property() data: any;
  @property() popupModel: any;
  @property() needSeparator: boolean;
  @property() active: boolean;
  @property() template: string;
  @property() component: string;
  @property() iconName: string;
  @property() items: any;
  @property() visibleIndex: number;

  public get disabled(): boolean {
    return this.enabled !== undefined && !this.enabled;
  }

  public get hasTitle(): boolean {
    return (this.mode != "small" && (this.showTitle || this.showTitle === undefined) || !this.iconName) && !!this.title;
  }
  public get isVisible() {
    return this.mode !== "popup";
  }
  public get canShrink() {
      return !!this.iconName;
  }
  @property({ defaultValue: "large" }) mode: "large" | "small" | "popup";

  minDimension: number;
  maxDimension: number;
}
