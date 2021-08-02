import { QuestionNonValue } from "./questionnonvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for image question. This question hasn't any functionality and can be used to improve the appearance of the survey.
 */
export class QuestionImageModel extends QuestionNonValue {
  constructor(name: string) {
    super(name);
    this.createLocalizableString("imageLink", this, false);
    this.createLocalizableString("text", this, false);
  }
  public getType(): string {
    return "image";
  }
  public get isCompositeQuestion(): boolean {
    return false;
  }
  /**
   * The image URL.
   */
  public get imageLink(): string {
    return this.getLocalizableStringText("imageLink");
  }
  public set imageLink(val: string) {
    this.setLocalizableStringText("imageLink", val);
  }
  get locImageLink(): LocalizableString {
    return this.getLocalizableString("imageLink");
  }
  /**
   * The image alt text.
   */
  public get text(): string {
    return this.getLocalizableStringText("text");
  }
  public set text(val: string) {
    this.setLocalizableStringText("text", val);
  }
  get locText(): LocalizableString {
    return this.getLocalizableString("text");
  }
  /**
   * The image height.
   */
  public get imageHeight(): string {
    return this.getPropertyValue("imageHeight");
  }
  public set imageHeight(val: string) {
    this.setPropertyValue("imageHeight", val);
  }
  /**
   * The image width.
   */
  public get imageWidth(): string {
    return this.getPropertyValue("imageWidth");
  }
  public set imageWidth(val: string) {
    this.setPropertyValue("imageWidth", val);
  }
  /**
   * The image fit mode.
   */
  public get imageFit(): string {
    return this.getPropertyValue("imageFit");
  }
  public set imageFit(val: string) {
    this.setPropertyValue("imageFit", val);
  }
  /**
   * The content mode.
   */
  public get contentMode(): string {
    return this.getPropertyValue("contentMode");
  }
  public set contentMode(val: string) {
    this.setPropertyValue("contentMode", val);
    if (val === "video") {
      this.showLabel = true;
    }
  }
}

Serializer.addClass(
  "image",
  [
    { name: "imageLink", serializationProperty: "locImageLink" },
    { name: "text", serializationProperty: "locText" },
    {
      name: "contentMode",
      default: "image",
      choices: ["image", "video"],
    },
    {
      name: "imageFit",
      default: "contain",
      choices: ["none", "contain", "cover", "fill"],
    },
    { name: "imageHeight:number", default: 150, minValue: 0 },
    { name: "imageWidth:number", default: 200, minValue: 0 },
  ],
  function () {
    return new QuestionImageModel("");
  },
  "nonvalue"
);

QuestionFactory.Instance.registerQuestion("image", (name) => {
  return new QuestionImageModel(name);
});
