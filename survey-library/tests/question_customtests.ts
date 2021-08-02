import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { Serializer } from "../src/jsonobject";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { ItemValue } from "../src/itemvalue";
import { LocalizableString } from "../src/localizablestring";

export default QUnit.module("custom questions");

QUnit.test("Single: Register and load from json", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "newquestion", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "Type for question is correct"
  );
  assert.equal(q.contentQuestion.choices.length, 5, "There are five choices");
  assert.deepEqual(
    survey.toJSON(),
    {
      pages: [
        { name: "page1", elements: [{ type: "newquestion", name: "q1" }] },
      ],
    },
    "Seralized correctly"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: Register and load from json", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "customerinfo", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.equal(
    q.contentPanel.elements.length,
    2,
    "There are two elements in panel"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Single: Create the wrapper question and sync the value", function(
  assert
) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "Question the type was created"
  );
  q.value = 1;
  assert.equal(q.contentQuestion.value, 1, "Set value to wrapper value");
  q.contentQuestion.value = 2;
  assert.equal(q.value, 2, "Set value to custom question");
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: sync values", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  var lastName = q.contentPanel.getQuestionByName("lastName");
  firstName.value = "John";
  assert.deepEqual(survey.data, { q1: { firstName: "John" } });
  q.value = { firstName: "Andrew", lastName: "Telnov" };
  assert.equal(firstName.value, "Andrew", "question value is replaced");
  assert.equal(lastName.value, "Telnov", "question value is set");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: disableDesignActions property", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.disableDesignActions,
    false,
    "Design action is available for root"
  );
  assert.equal(
    q.contentQuestion.disableDesignActions,
    true,
    "Design action is disabled for contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: disableDesignActions property", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(
    q.disableDesignActions,
    false,
    "Design action is available for root"
  );
  assert.equal(
    q.contentPanel.disableDesignActions,
    true,
    "Design action is disabled for contentPanel"
  );
  assert.equal(
    firstName.disableDesignActions,
    true,
    "Design action is disabled for firstName"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: read-only", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1", readOnly: true }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.isReadOnly, true, "root is readOnly");
  assert.equal(
    q.contentQuestion.isReadOnly,
    true,
    "contentQuestion is read Only"
  );
  q.readOnly = false;
  assert.equal(
    q.contentQuestion.isReadOnly,
    false,
    "contentQuestion is not read only"
  );
  q.readOnly = true;
  assert.equal(
    q.contentQuestion.isReadOnly,
    true,
    "contentQuestion is read only again"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: read only", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1", readOnly: true }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(q.isReadOnly, true, "root is readOnly");
  assert.equal(q.contentPanel.isReadOnly, true, "contentPanel is read Only");
  assert.equal(firstName.isReadOnly, true, "firstName is read Only");
  q.readOnly = false;
  assert.equal(
    q.contentPanel.isReadOnly,
    false,
    "contentQuestion is not read only"
  );
  assert.equal(firstName.isReadOnly, false, "firstName is not read Only");
  q.readOnly = true;
  assert.equal(
    q.contentPanel.isReadOnly,
    true,
    "contentPanel is read only again"
  );
  assert.equal(firstName.isReadOnly, true, "firstName is read Only again");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: hasError", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: {
      type: "dropdown",
      choices: [1, 2, 3, 4, 5],
      isRequired: true,
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.hasErrors(), true, "contentQuestion is required");
  assert.equal(q.errors.length, 1, "There is one error");
  q.contentQuestion.value = 1;
  assert.equal(q.hasErrors(), false, "contentQuestion has value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: hasError/isRequired", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: {
      type: "dropdown",
      choices: [1, 2, 3, 4, 5],
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1", isRequired: true }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.hasErrors(), true, "contentQuestion is required");
  assert.equal(q.errors.length, 1, "There is one error");
  q.contentQuestion.value = 1;
  assert.equal(q.hasErrors(), false, "contentQuestion has value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: hasErrors", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName", isRequired: true },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(q.hasErrors(), true, "firstName is required");
  firstName.value = "abc";
  assert.equal(q.hasErrors(), false, "firstName has value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: hasErrors/isRequired", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(q.hasErrors(), true, "question is empty");
  firstName.value = "abc";
  assert.equal(q.hasErrors(), false, "question is not empty");
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: onPropertyChanged", function(assert) {
  var json = {
    name: "customerInfo",
    elementsJSON: [
      { type: "text", name: "firstName", isRequired: true },
      { type: "text", name: "lastName" },
    ],
    onInit() {
      Serializer.addProperty("customerInfo", {
        name: "showLastName:boolean",
        default: true,
      });
    },
    onPropertyChanged: function(question, propertyName, newValue) {
      if (propertyName == "showLastName") {
        question.contentPanel.getQuestionByName("lastName").visible = newValue;
      }
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(lastName.visible, true, "It is visible by default");
  q.showLastName = false;
  assert.equal(lastName.visible, false, "showLastName is false");
  q.showLastName = true;
  assert.equal(lastName.visible, true, "showLastName is true");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: create from code", function(assert) {
  var json = {
    name: "newquestion",
    createQuestion: function() {
      var res = new QuestionDropdownModel("question");
      res.choices = [1, 2, 3, 4, 5];
      return res;
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "content question created correctly"
  );
  assert.equal(
    q.contentQuestion.choices.length,
    5,
    "content question choices are here"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: create from code", function(assert) {
  var json = {
    name: "customerinfo",
    createElements: function(panel) {
      panel.addNewQuestion("text", "firstName");
      panel.addNewQuestion("text", "lastName");
      panel.questions[0].isRequired = true;
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(firstName.getType(), "text", "first name is creted");
  assert.equal(lastName.getType(), "text", "last name is creted");
  assert.equal(firstName.isRequired, true, "first name is required");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onPropertyChanged", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName", isRequired: true },
      { type: "text", name: "lastName" },
    ],
    onCreated: function(question) {
      question.contentPanel.getQuestionByName(
        "lastName"
      ).startWithNewLine = false;
      question.contentPanel.showQuestionNumbers = "onpanel";
      question.contentPanel.questionStartIndex = "a.";
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "customerinfo", name: "q2" },
      { type: "text", name: "q3" },
    ],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[1];
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(
    lastName.startWithNewLine,
    false,
    "onCreated function is called"
  );
  assert.equal(lastName.visibleIndex, 1, "second question");
  assert.equal(lastName.no, "b.", "second question, no is 'b.'");
  ComponentCollection.Instance.clear();
});
QUnit.test("Custom, get css from contentQuestion", function(assert) {
  var survey = new SurveyModel();
  survey.css.dropdown.small = "small";
  survey.css.dropdown.title = "title";
  survey.css.question.titleOnAnswer = "onAnswer";
  var json = {
    name: "newquestion",
    createQuestion: function() {
      var res = new QuestionDropdownModel("question");
      res.choices = [1, 2, 3, 4, 5];
      return res;
    },
  };
  ComponentCollection.Instance.add(json);
  survey.fromJSON({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q1 = survey.getQuestionByName("q1");
  var defaultQuestionRoot = survey.css.question.mainRoot;
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + " small",
    "Default question root, take small from dropdown"
  );
  assert.equal(q1.cssTitle, "title", "Default question title");
  q1.titleLocation = "left";
  var addLeft = " " + survey.css.question.titleLeftRoot;
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + addLeft + " small",
    "titleLocation = left, take small from dropdown"
  );
  q1.titleLocation = "default";
  q1.value = 1;
  assert.equal(q1.isEmpty(), false, "q1 is not empty");
  assert.equal(q1.cssTitle, "title onAnswer", "q1 is not empty, show in title");
  q1.clearValue();
  assert.equal(q1.isEmpty(), true, "q1 is empty");
  assert.equal(q1.cssTitle, "title");
  q1.contentQuestion.value = 1;
  assert.equal(
    q1.cssTitle,
    "title onAnswer",
    "q1 is not empty, show in title, via contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite, update panel css", function(assert) {
  var survey = new SurveyModel();
  survey.css.question.small = "small";
  survey.css.question.title = "title";
  survey.css.question.titleOnAnswer = "onAnswer";
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName", isRequired: true },
      { type: "text", name: "lastName" },
    ],
    onCreated: function(question) {
      question.contentPanel.getQuestionByName(
        "lastName"
      ).startWithNewLine = false;
    },
  };
  ComponentCollection.Instance.add(json);
  survey.fromJSON({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q1 = survey.getQuestionByName("q1");
  var lastName = q1.contentPanel.getQuestionByName("lastName");
  var defaultQuestionRoot = survey.css.question.mainRoot;
  assert.equal(
    lastName.cssRoot,
    defaultQuestionRoot + " small",
    "Update content question css"
  );
  lastName.value = "val";
  assert.equal(q1.isEmpty(), false, "q1 is not empty");
  assert.equal(q1.cssTitle, "title onAnswer", "q1 is not empty, show in title");
  lastName.clearValue();
  assert.equal(q1.isEmpty(), true, "q1 is empty");
  assert.equal(q1.cssTitle, "title", "q1 is clear");
  q1.value = { lastName: "val" };
  assert.equal(
    q1.cssTitle,
    "title onAnswer",
    "q1 is not empty, show in title, via lastName"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: defaultValue", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: {
      type: "dropdown",
      choices: [1, 2, 3, 4, 5],
      defaultValue: 2,
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1", isRequired: true }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.value, 2, "defaultValue is set");
  assert.equal(
    q.contentQuestion.value,
    2,
    "defaultValue is set for contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: defaultValue", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName", defaultValue: "Jon" },
      { type: "text", name: "lastName" },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(firstName.value, "Jon", "firstName defaultValue");
  assert.deepEqual(q.value, { firstName: "Jon" }, "question defaultValue");
  ComponentCollection.Instance.clear();
});

var orderJSON = {
  type: "matrixdropdown",
  columns: [
    {
      name: "price",
      title: "Price",
      cellType: "expression",
      displayStyle: "currency",
    },
    {
      name: "qty",
      title: "Qty",
      cellType: "dropdown",
      optionsCaption: "0",
      choices: [1, 2, 3, 4, 5],
    },
    {
      name: "total",
      title: "Total",
      cellType: "expression",
      displayStyle: "currency",
      expression: "{row.qty} * {row.price}",
      totalType: "sum",
      totalDisplayStyle: "currency",
    },
  ],
  rows: ["Steak", "Salmon", "Beer"],
  defaultValue: {
    Steak: { price: 23 },
    Salmon: { price: 19 },
    Beer: { price: 5 },
  },
};

QUnit.test("Single: matrixdropdown.defaultValue", function(assert) {
  var json = {
    name: "order",
    questionJSON: orderJSON,
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "order", name: "q1", isRequired: true }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  var value = {
    Steak: { price: 23, total: 0 },
    Salmon: { price: 19, total: 0 },
    Beer: { price: 5, total: 0 },
  };
  var rows = q.contentQuestion.visibleRows;
  assert.deepEqual(q.value, value, "defaultValue is set");
  assert.deepEqual(
    q.contentQuestion.value,
    value,
    "defaultValue is set for contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: matrixdropdown expressions", function(assert) {
  var json = {
    name: "order",
    questionJSON: orderJSON,
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "order", name: "q1", isRequired: true }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  var value = {
    Steak: { price: 23, total: 0 },
    Salmon: { price: 19, total: 0 },
    Beer: { price: 5, total: 0 },
  };
  var matrix = <QuestionMatrixDropdownModel>q.contentQuestion;
  matrix.visibleRows[0].getQuestionByColumnName("qty").value = 1;
  assert.deepEqual(
    survey.data,
    {
      q1: {
        Steak: { price: 23, qty: 1, total: 23 },
        Salmon: { price: 19, total: 0 },
        Beer: { price: 5, total: 0 },
      },
      "q1-total": { total: 23 },
    },
    "Set data corectly"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: expression, {composite} prefix", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      {
        type: "text",
        name: "lastName",
        visibleIf: "{composite.firstName} = 'Jon'",
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(lastName.isVisible, false, "lastName is hidden by default");
  firstName.value = "Jon";
  assert.equal(lastName.isVisible, true, "lastName is showing now");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: remove invisible values", function(assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      {
        type: "text",
        name: "lastName",
        visibleIf: "{composite.firstName} != 'Jon'",
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  var lastName = q.contentPanel.getQuestionByName("lastName");
  firstName.value = "first";
  lastName.value = "last";
  assert.equal(lastName.value, "last", "value set correctly");
  firstName.value = "Jon";
  survey.completeLastPage();
  assert.deepEqual(
    survey.data,
    { q1: { firstName: "Jon" } },
    "remove lastName"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: matrixdropdown onCreated after load properties", function(
  assert
) {
  var json = {
    name: "order",
    questionJSON: {
      type: "matrixdropdown",
      columns: [
        {
          name: "price",
          title: "Price",
          cellType: "expression",
          displayStyle: "currency",
        },
        {
          name: "qty",
          title: "Qty",
          cellType: "dropdown",
          optionsCaption: "0",
          choices: [1, 2, 3, 4, 5],
        },
        {
          name: "total",
          title: "Total",
          cellType: "expression",
          displayStyle: "currency",
          expression: "{row.qty} * {row.price}",
          totalType: "sum",
          totalDisplayStyle: "currency",
        },
      ],
    },
    onInit() {
      Serializer.addClass(
        "itemorder",
        [
          { name: "text", visible: false },
          { name: "visibleIf", visible: false },
          { name: "enableIf", visible: false },
        ],
        function() {
          return new ItemValue(null, null, "itemorder");
        },
        "itemvalue"
      );
      Serializer.addProperty("itemorder", {
        name: "price:number",
        default: 0,
      });
      Serializer.addProperty("order", {
        name: "orders:itemorder[]",
        category: "general",
      });
    },
    onLoaded(question) {
      this.buildRows(question);
      this.setDefaultValues(question);
    },
    buildRows(question) {
      var rows = [];
      for (var i = 0; i < question.orders.length; i++) {
        var item = question.orders[i];
        if (!!item.value) {
          rows.push(question.orders[i].value);
        }
      }
      question.contentQuestion.rows = rows;
    },
    setDefaultValues(question) {
      var defaultValue = {};
      for (var i = 0; i < question.orders.length; i++) {
        var item = question.orders[i];
        if (!!item.value && !!item.price) {
          defaultValue[item.value] = { price: item.price };
        }
      }
      question.contentQuestion.defaultValue = defaultValue;
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [
      {
        type: "order",
        name: "q1",
        orders: [
          { value: "Steak", price: 25 },
          { value: "Salmon", price: 22 },
        ],
      },
    ],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  var value = {
    Steak: { price: 25, total: 0 },
    Salmon: { price: 22, total: 0 },
  };
  var matrix = <QuestionMatrixDropdownModel>q.contentQuestion;
  assert.equal(matrix.rows.length, 2, "There are two rows");
  assert.deepEqual(
    matrix.defaultValue,
    { Steak: { price: 25 }, Salmon: { price: 22 } },
    "Default value set correctly"
  );
  Serializer.removeClass("itemorder");
  ComponentCollection.Instance.clear();
});

QUnit.test("Complex: hide content question in designMode", function(assert) {
  ComponentCollection.Instance.add({
    name: "fullname",
    elementsJSON: [
      {
        type: "text",
        name: "firstName",
      },
      {
        type: "text",
        name: "lastName",
      },
      {
        type: "text",
        name: "middleName",
        visible: false,
      },
    ],
    onInit() {
      Serializer.addProperty("fullname", {
        name: "showMiddleName:boolean",
      });
    },
    onLoaded(question) {
      this.changeMiddleVisibility(question);
    },
    onPropertyChanged(question, propertyName, newValue) {
      if (propertyName == "showMiddleName") {
        this.changeMiddleVisibility(question);
      }
    },
    changeMiddleVisibility(question) {
      let middle = question.contentPanel.getQuestionByName("middleName");
      if (!!middle) {
        middle.visible = question.showMiddleName === true;
      }
    },
  });
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      {
        type: "fullname",
        question: "q1",
      },
    ],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var middleName = q.contentPanel.getQuestionByName("middleName");
  assert.equal(middleName.isVisible, false, "It is invisible by default");
  assert.equal(
    middleName.areInvisibleElementsShowing,
    false,
    "All invisible content elements are stay invisible"
  );
  q.showMiddleName = true;
  assert.equal(middleName.isVisible, true, "showMiddleName is true");
  q.showMiddleName = false;
  assert.equal(middleName.isVisible, false, "showMiddleName is false");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: onAfterRender and onAfterRenderContentElement", function(
  assert
) {
  var afterRenderQuestion = null;
  var afterRenderHtmlElement = 0;
  var afterRenderContentElementQuestion = null;
  var afterRenderContentElement = null;
  var afterRenderContentElementHtml = 0;
  var json = {
    name: "newquestion",
    onAfterRender(question, htmlElement) {
      afterRenderQuestion = question;
      afterRenderHtmlElement = htmlElement;
    },
    onAfterRenderContentElement(question, element, htmlElement) {
      afterRenderContentElementQuestion = question;
      afterRenderContentElement = element;
      afterRenderContentElementHtml = htmlElement;
    },
    questionJSON: {
      type: "dropdown",
      choices: [1, 2, 3, 4, 5],
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  q.afterRender(5);
  assert.equal(
    afterRenderQuestion.name,
    "q1",
    "onAfterRender, question parameter is correct"
  );
  assert.equal(
    afterRenderHtmlElement,
    5,
    "onAfterRender, htmlElement parameter is correct"
  );
  q.contentQuestion.afterRender(<any>7);
  assert.equal(
    afterRenderContentElementQuestion.name,
    "q1",
    "afterRenderContentElement, question parameter is correct"
  );
  assert.equal(
    afterRenderContentElement.getType(),
    "dropdown",
    "afterRenderContentElement, element parameter is correct"
  );
  assert.equal(
    afterRenderContentElementHtml,
    7,
    "afterRenderContentElement, htmlElement parameter is correct"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: onAfterRender and onAfterRenderContentElement", function(
  assert
) {
  var afterRenderQuestion = null;
  var afterRenderHtmlElement = 0;
  var afterRenderContentElementQuestion = null;
  var afterRenderContentElement = null;
  var afterRenderContentElementHtml = 0;
  var json = {
    name: "fullname",
    elementsJSON: [
      {
        type: "text",
        name: "firstName",
      },
      {
        type: "text",
        name: "lastName",
      },
    ],
    onAfterRender(question, htmlElement) {
      afterRenderQuestion = question;
      afterRenderHtmlElement = htmlElement;
    },
    onAfterRenderContentElement(question, element, htmlElement) {
      afterRenderContentElementQuestion = question;
      afterRenderContentElement = element;
      afterRenderContentElementHtml = htmlElement;
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "fullname", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  q.afterRender(5);
  assert.equal(
    afterRenderQuestion.name,
    "q1",
    "onAfterRender, question parameter is correct"
  );
  assert.equal(
    afterRenderHtmlElement,
    5,
    "onAfterRender, htmlElement parameter is correct"
  );
  (<Question>q.contentPanel.elements[0]).afterRender(<any>7);
  assert.equal(
    afterRenderContentElementQuestion.name,
    "q1",
    "afterRenderContentElement, question parameter is correct"
  );
  assert.equal(
    afterRenderContentElement.name,
    "firstName",
    "afterRenderContentElement, element parameter is correct"
  );
  assert.equal(
    afterRenderContentElementHtml,
    7,
    "afterRenderContentElement, htmlElement parameter is correct"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: update url, {composite} prefix", function(assert) {
  var json = {
    name: "urltest",
    elementsJSON: [
      { type: "text", name: "name" },
      {
        type: "dropdown",
        name: "url",
        choicesByUrl: {
          url: "an_url/{composite.name}",
        },
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "urltest", name: "q1", isRequired: true }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var name = q.contentPanel.getQuestionByName("name");
  var url = <QuestionDropdownModel>q.contentPanel.getQuestionByName("url");
  var processedUrl = "";
  url.choicesByUrl.onProcessedUrlCallback = (url: string, path: string) => {
    processedUrl = url;
  };
  name.value = "newValue";
  assert.equal(processedUrl, "an_url/newValue", "Url proccessed correctly");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: update url, {composite} prefix on loaded", function(
  assert
) {
  var processedUrl = "";
  var json = {
    name: "urltest",
    elementsJSON: [
      { type: "text", name: "name" },
      {
        type: "dropdown",
        name: "url",
        choicesByUrl: {
          url: "an_url/{composite.name}",
        },
      },
    ],
    onLoaded(question) {
      let name = question.contentPanel.getQuestionByName("name");
      name.value = "newValue";
      let url = question.contentPanel.getQuestionByName("url");
      url.choicesByUrl.onProcessedUrlCallback = (url: string, path: string) => {
        processedUrl = url;
      };
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "urltest", name: "q1", isRequired: true }],
  });
  assert.equal(
    processedUrl,
    "an_url/newValue",
    "Url proccessed correctly on load"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onValueChanged function", function(assert) {
  var json = {
    name: "testquestion",
    elementsJSON: [
      { type: "text", name: "q1" },
      {
        type: "dropdown",
        name: "q2",
        choices: ["A", "B", "C"],
      },
    ],
    onValueChanged: (question: Question, name: string, value: any) => {
      if (name == "q2") {
        question.setValue("q1", value + value);
      }
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "testquestion", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  q.contentPanel.getQuestionByName("q2").value = "A";
  assert.equal(
    q.contentPanel.getQuestionByName("q1").value,
    "AA",
    "onValueChanged works"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: onValueChanged function, value is array", function(assert) {
  var json = {
    name: "testquestion",
    questionJSON: {
      type: "html",
    },
    onValueChanged: (question: Question, name: string, value: any) => {
      if (!value) value = [];
      var res = "";
      for (var i = 0; i < value.length; i++) {
        res += value[i];
      }
      question.contentQuestion.html = res;
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "testquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  q.value = ["A", "B"];
  assert.equal(q.contentQuestion.html, "AB", "onValueChanged works #1");
  q.value = ["A", "B", "C"];
  assert.equal(q.contentQuestion.html, "ABC", "onValueChanged works #2");
  q.value = undefined;
  assert.equal(q.contentQuestion.html, "", "onValueChanged works #3");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: checkErrorsMode=onValueChanging", function(assert) {
  var json = {
    name: "testquestion",
    elementsJSON: [
      { type: "text", name: "q1", validators: [{ type: "emailvalidator" }] },
      {
        type: "dropdown",
        name: "q2",
        choices: ["A", "B", "C"],
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    checkErrorsMode: "onValueChanging",
    elements: [{ type: "testquestion", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var q1 = q.contentPanel.getQuestionByName("q1");
  q1.value = "a";
  assert.equal(q1.value, "a", "keep the value");
  assert.equal(q1.errors.length, 1, "question has error");
  assert.deepEqual(
    q.value,
    { q1: "a" },
    "keep the value in composite question"
  );
  assert.deepEqual(survey.data, {}, "survey data is empty");
  q1.value = "a@a.com";
  assert.equal(q1.errors.length, 0, "question has no errors");
  assert.deepEqual(
    survey.data,
    { q1: { q1: "a@a.com" } },
    "survey data is empty"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: set value from survey.data", function(assert) {
  var json = {
    name: "testquestion",
    elementsJSON: [
      { type: "text", name: "q1" },
      {
        type: "dropdown",
        name: "q2",
        choices: ["A", "B", "C"],
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "testquestion", name: "q1" }],
  });
  survey.data = { q1: { q1: "BB", q2: "B" } };
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("q1").value,
    "BB",
    "set value into the first question in composite"
  );
  assert.equal(
    q.contentPanel.getQuestionByName("q2").value,
    "B",
    "set value into the second question in composite"
  );
});
QUnit.test("Use components in dynamic panel", function(assert) {
  ComponentCollection.Instance.add({
    name: "singlequestion",
    createQuestion: function() {
      var res = new QuestionDropdownModel("question");
      res.choices = [1, 2, 3, 4, 5];
      return res;
    },
  });
  ComponentCollection.Instance.add({
    name: "compositequestion",
    elementsJSON: [
      { type: "text", name: "q1" },
      {
        type: "dropdown",
        name: "q2",
        choices: ["A", "B", "C"],
      },
    ],
  });

  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "q1",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "singlequestion", name: "q2" },
          { type: "compositequestion", name: "q3" },
        ],
      },
    ],
  });
  var panel = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
  panel.panelCount = 1;
  panel.panels[0].getQuestionByName("q2").value = 1;
  panel.panels[0].getQuestionByName("q3").value = { q1: 1, q2: "B" };
  assert.deepEqual(survey.data, { q1: [{ q2: 1, q3: { q1: 1, q2: "B" } }] });
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: addConditionObjectsByContext", function(assert) {
  var json = {
    name: "testquestion",
    elementsJSON: [
      { type: "text", name: "q1" },
      {
        type: "dropdown",
        name: "q2",
        title: "Question 2",
        choices: ["A", "B", "C"],
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "testquestion", name: "cp_question" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var objs = [];
  q.addConditionObjectsByContext(objs, null);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.getType();
  }
  assert.deepEqual(
    objs,
    [
      { name: "cp_question.q1", text: "cp_question.q1", question: "text" },
      {
        name: "cp_question.q2",
        text: "cp_question.Question 2",
        question: "dropdown",
      },
    ],
    "addConditionObjectsByContext work correctly for composite question"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: visibleIf and showPreview, Bug#2674", function(assert) {
  ComponentCollection.Instance.add({
    name: "fullname",
    title: "Full Name",
    elementsJSON: [
      {
        type: "text",
        name: "firstName",
        isRequired: true,
      },
      {
        type: "text",
        name: "lastName",
        visibleIf: "{composite.firstName} notempty",
        isRequired: true,
      },
    ],
  });
  var survey = new SurveyModel({
    showPreviewBeforeComplete: "showAllQuestions",
    elements: [{ type: "fullname", name: "name" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    false,
    "The second question is invisible"
  );
  q.contentPanel.getQuestionByName("firstName").value = "Jon";
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    true,
    "The second question is visible"
  );
  q.contentPanel.getQuestionByName("lastName").value = "Snow";
  survey.showPreview();
  q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    true,
    "The second question is still visible"
  );
  survey.cancelPreview();
  q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    true,
    "The second question is still visible"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test(
  "Composite: visibleIf and showPreview and clearInvisibleValues = 'onHiddenContainer', Bug#2718",
  function(assert) {
    ComponentCollection.Instance.add({
      name: "fullname",
      title: "Full Name",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
          isRequired: true,
        },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} notempty",
          isRequired: true,
        },
      ],
    });
    var survey = new SurveyModel({
      showPreviewBeforeComplete: "showAllQuestions",
      clearInvisibleValues: "onHiddenContainer",
      elements: [{ type: "fullname", name: "name" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      false,
      "The second question is invisible"
    );
    q.contentPanel.getQuestionByName("firstName").value = "Jon";
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      true,
      "The second question is visible"
    );
    q.contentPanel.getQuestionByName("lastName").value = "Snow";
    survey.showPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      true,
      "The second question is still visible"
    );
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").value,
      "Snow",
      "The value is still the same"
    );
    survey.cancelPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      true,
      "The second question is visible after canceling Preview"
    );
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").value,
      "Snow",
      "The value is still the same after canceling Preview"
    );

    ComponentCollection.Instance.clear();
  }
);

QUnit.test("Single: displayValue function, Bug#2678", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: {
      type: "checkbox",
      choices: [
        { value: 1, text: "text 1" },
        { value: 2, text: "text 2" },
        { value: 3, text: "text 3" },
      ],
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  q.value = [1, 3];
  assert.equal(q.displayValue, "text 1, text 3");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: displayValue function, Bug#2678", function(assert) {
  ComponentCollection.Instance.add({
    name: "newquestion",
    elementsJSON: [
      {
        type: "checkbox",
        name: "q1",
        title: "question 1",
        choices: [
          { value: 1, text: "text 1" },
          { value: 2, text: "text 2" },
          { value: 3, text: "text 3" },
        ],
      },
      {
        type: "dropdown",
        name: "q2",
        title: "question 2",
        choices: [
          { value: 1, text: "text 1" },
          { value: 2, text: "text 2" },
          { value: 3, text: "text 3" },
        ],
      },
    ],
  });
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  q.value = { q1: [1, 3], q2: 2 };
  assert.deepEqual(q.displayValue, {
    "question 1": "text 1, text 3",
    "question 2": "text 2",
  });
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: in matrix dynamic question, Bug#2695", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: {
      type: "dropdown",
      choices: ["a", "b", "c"],
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [{ name: "col1", cellType: "newquestion" }],
        rowCount: 1,
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  var rows = matrix.visibleRows;
  assert.equal(
    rows[0].cells[0].question.getType(),
    "newquestion",
    "cell question has correct type"
  );
  rows[0].cells[0].question.contentQuestion.value = "b";
  assert.equal(
    rows[0].cells[0].question.value,
    "b",
    "set value into cell question"
  );
  assert.equal(rows[0].cells[0].value, "b", "set value into cell");
  assert.deepEqual(matrix.value, [{ col1: "b" }], "set value into matrix");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: change locale, Bug#2730", function(assert) {
  var json = {
    name: "newquestion",
    questionJSON: {
      type: "dropdown",
    },
    onLoaded: (question) => {
      var item = new ItemValue(1);
      item.locText.setJson({ default: "item en", de: "item de" });
      question.contentQuestion.choices = [item];
    },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  survey.currentPageNo = 0;
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  var locText = <LocalizableString>q.contentQuestion.choices[0].locText;
  assert.equal(locText.renderedHtml, "item en", "en locale");
  var hasChanged = false;
  locText.onChanged = () => {
    hasChanged = true;
  };
  survey.locale = "de";
  assert.equal(hasChanged, true, "Call notification about changing locale");
  assert.equal(locText.renderedHtml, "item de", "de locale");
  survey.locale = "";
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: change locale, Bug#2730", function(assert) {
  var json = {
    name: "newquestion",
    elementsJSON: [
      {
        type: "dropdown",
        choices: [{ value: 1, text: { default: "item en", de: "item de" } }],
      },
    ],
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  survey.currentPageNo = 0;
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var dropdown = <QuestionDropdownModel>q.contentPanel.questions[0];
  assert.ok(dropdown, "Question is here");
  var locText = <LocalizableString>dropdown.choices[0].locText;
  assert.equal(locText.renderedHtml, "item en", "en locale");
  var hasChanged = false;
  locText.onChanged = () => {
    hasChanged = true;
  };
  survey.locale = "de";
  assert.equal(hasChanged, true, "Call notification about changing locale");
  assert.equal(locText.renderedHtml, "item de", "de locale");
  survey.locale = "";
  ComponentCollection.Instance.clear();
});
