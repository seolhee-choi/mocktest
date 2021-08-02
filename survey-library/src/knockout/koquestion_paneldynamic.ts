import * as ko from "knockout";
import { SurveyElement } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import {
  QuestionPanelDynamicModel,
  QuestionPanelDynamicItem,
} from "survey-core";
import { Question } from "survey-core";
import { PanelModel } from "survey-core";
import { Panel } from "./kopage";

export class QuestionPanelDynamicImplementor extends QuestionImplementor {
  koRecalc: any;
  constructor(question: Question) {
    super(question);
    this.koRecalc = ko.observable(0);
    var self = this;
    this.setCallbackFunc("koAddPanelClick", () => {
      this.addPanel();
    });
    this.setCallbackFunc("koRemovePanelClick", (data: any) => {
      this.removePanel(data);
    });
    this.setCallbackFunc("koPrevPanelClick", () => {
      (<QuestionPanelDynamic>this.question).goToPrevPanel();
    });
    this.setCallbackFunc("koNextPanelClick", () => {
      (<QuestionPanelDynamic>this.question).goToNextPanel();
    });
    this.setObservaleObj(
      "koCanAddPanel",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).canAddPanel;
      })
    );
    this.setObservaleObj(
      "koCanRemovePanel",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).canRemovePanel;
      })
    );
    this.setObservaleObj(
      "koIsPrevButton",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).isPrevButtonShowing;
      })
    );
    this.setObservaleObj(
      "koIsNextButton",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).isNextButtonShowing;
      })
    );
    this.setObservaleObj(
      "koIsRange",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).isRangeShowing;
      })
    );
    this.setObservaleObj(
      "koPanel",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).currentPanel;
      })
    );
    this.setObservaleObj(
      "koIsList",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).isRenderModeList;
      })
    );
    this.setObservaleObj(
      "koIsProgressTop",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).isProgressTopShowing;
      })
    );
    this.setObservaleObj(
      "koIsProgressBottom",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).isProgressBottomShowing;
      })
    );

    let koRangeValue = ko.observable(
      (<QuestionPanelDynamic>this.question).currentIndex
    );
    koRangeValue.subscribe((newValue: any) => {
      (<QuestionPanelDynamic>this.question).currentIndex = newValue;
    });
    this.setObservaleObj("koRangeValue", koRangeValue);
    this.setObservaleObj(
      "koRangeMax",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).panelCount - 1;
      })
    );

    this.setObservaleObj(
      "koButtonAddCss",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.buttonAddCss;
      })
    );

    this.setObservaleObj(
      "koButtonNextCss",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.buttonNextCss;
      })
    );

    this.setObservaleObj(
      "koButtonPrevCss",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.buttonPrevCss;
      })
    );

    this.setObservaleObj(
      "koProgressText",
      ko.pureComputed(() => {
        this.koRecalc();
        return (<QuestionPanelDynamic>this.question).progressText;
      })
    );

    this.setObservaleObj(
      "koProgress",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.progress;
      })
    );
    this.setCallbackFunc("koPanelAfterRender", (el: any, con: any) => {
      this.panelAfterRender(el, con);
    });
    (<QuestionPanelDynamic>this.question).panelCountChangedCallback = () => {
      this.onPanelCountChanged();
    };
    (<QuestionPanelDynamic>this.question).renderModeChangedCallback = () => {
      this.onRenderModeChanged();
    };
    (<QuestionPanelDynamic>this.question).currentIndexChangedCallback = () => {
      this.onCurrentIndexChanged();
    };
  }
  protected onPanelCountChanged() {
    this.onCurrentIndexChanged();
  }
  protected onRenderModeChanged() {
    this.onCurrentIndexChanged();
  }
  protected onCurrentIndexChanged() {
    if (this.question.isDisposed) return;
    this.koRecalc(this.koRecalc() + 1);
    this.question.koRangeValue(
      (<QuestionPanelDynamic>this.question).currentIndex
    );
  }
  protected addPanel() {
    (<QuestionPanelDynamic>this.question).addPanelUI();
  }
  protected removePanel(val: any) {
    var q = <QuestionPanelDynamic>this.question;
    if (!q.isRenderModeList) {
      val = q.currentPanel;
    }
    q.removePanelUI(val);
  }
  private panelAfterRender(elements: any, con: any) {
    if (!this.question || !this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    this.question.survey.afterRenderPanel(con, el);
  }

  protected get buttonAddCss() {
    var question = this.question;
    var btnClasses =
      question.cssClasses.button + " " + question.cssClasses.buttonAdd;

    if (this.question.renderMode === "list") {
      btnClasses += " " + question.cssClasses.buttonAdd + "--list-mode";
    }

    return btnClasses;
  }

  protected get buttonPrevCss() {
    var question = this.question;
    var btnClasses = question.cssClasses.buttonPrev;
    if (!question.isPrevButtonShowing) {
      btnClasses += " " + question.cssClasses.buttonPrev + "--disabled";
    }
    return btnClasses;
  }

  protected get buttonNextCss() {
    var question = this.question;
    var btnClasses = question.cssClasses.buttonNext;
    if (!question.isNextButtonShowing) {
      btnClasses += " " + question.cssClasses.buttonNext + "--disabled";
    }
    return btnClasses;
  }

  protected get progress() {
    var rangeMax = this.question.panelCount - 1;
    return (this.question.currentIndex / rangeMax) * 100 + "%";
  }
  public dispose() {
    (<QuestionPanelDynamic>this.question).panelCountChangedCallback = undefined;
    (<QuestionPanelDynamic>this.question).renderModeChangedCallback = undefined;
    (<QuestionPanelDynamic>(
      this.question
    )).currentIndexChangedCallback = undefined;
    super.dispose();
  }
}

export class QuestionPanelDynamic extends QuestionPanelDynamicModel {
  private _implementor: QuestionPanelDynamicImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionPanelDynamicImplementor(this);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("paneldynamic", function() {
  return new QuestionPanelDynamic("");
});

QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => {
  return new QuestionPanelDynamic(name);
});
