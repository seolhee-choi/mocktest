import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { EmailValidator } from "../src/validator";
import {
  MatrixDropdownRowModel,
  QuestionMatrixDropdownModel,
} from "../src/question_matrixdropdown";
import {
  MatrixDropdownRowModelBase,
  MatrixDropdownColumn,
  matrixDropdownColumnTypes,
} from "../src/question_matrixdropdownbase";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { JsonObject, Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { FunctionFactory } from "../src/functionsfactory";
import { Question } from "../src/question";
import { ExpressionValidator } from "../src/validator";
import { QuestionExpressionModel } from "../src/question_expression";
import { settings } from "../src/settings";
import { PanelModel } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { SurveyElement } from "../src/survey-element";
import { Action } from "../src/actions/action";

export default QUnit.module("Survey_QuestionMatrixDynamic");

QUnit.test("Matrixdropdown cells tests", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");
  question.rows = ["row1", "row2", "row3"];
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.value = { row2: { column1: 2 } };
  var visibleRows = question.visibleRows;
  assert.equal(visibleRows.length, 3, "There are three rows");
  assert.equal(
    visibleRows[0].cells.length,
    2,
    "There are two cells in each row"
  );
  assert.equal(
    visibleRows[2].cells.length,
    2,
    "There are two cells in each row"
  );
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  assert.deepEqual(
    ItemValue.getData(q1.choices),
    ItemValue.getData(question.choices),
    "get choices from matrix"
  );
  assert.deepEqual(
    ItemValue.getData(q2.choices),
    ItemValue.getData(question.columns[1]["choices"]),
    "get choices from column"
  );
  assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

  question.value = null;
  visibleRows[0].cells[1].value = 4;
  assert.deepEqual(
    question.value,
    { row1: { column2: 4 } },
    "set the cell value correctly"
  );
  visibleRows[0].cells[1].value = null;
  assert.deepEqual(question.value, null, "set to null if all cells are null");
});
QUnit.test("Matrixdynamic cells tests", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.value = [{}, { column1: 2 }, {}];
  var visibleRows = question.visibleRows;
  assert.equal(visibleRows.length, 3, "There are three rows");
  assert.equal(
    visibleRows[0].cells.length,
    2,
    "There are two cells in each row"
  );
  assert.equal(
    visibleRows[2].cells.length,
    2,
    "There are two cells in each row"
  );
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  assert.deepEqual(
    ItemValue.getData(q1.choices),
    ItemValue.getData(question.choices),
    "get choices from matrix"
  );
  assert.deepEqual(
    ItemValue.getData(q2.choices),
    ItemValue.getData(question.columns[1]["choices"]),
    "get choices from column"
  );
  assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

  question.value = null;
  visibleRows[1].cells[1].value = 4;
  assert.deepEqual(
    question.value,
    [{}, { column2: 4 }, {}],
    "set the cell value correctly"
  );
  visibleRows[1].cells[1].value = null;
  assert.deepEqual(
    question.value,
    [],
    "set to null if all cells are null - array is empty"
  );
});
QUnit.test(
  "Matrixdynamic make the question empty on null cell value, Bug #608",
  function(assert) {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var visibleRows = question.visibleRows;
    visibleRows[1].cells[0].question.value = 2;
    assert.deepEqual(
      question.value,
      [{}, { column1: 2 }, {}],
      "The value set correctly"
    );
    visibleRows[1].cells[0].question.value = null;
    assert.deepEqual(
      question.value,
      [],
      "Clear the question value if all cells are empty - empty array"
    );
  }
);

QUnit.test("Matrixdynamic set null value, Bug Editor #156", function(assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addNewPage();
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  survey.pages[0].addQuestion(question);
  /*
      question.value = null;
      assert.deepEqual(question.value, [{}, {}, {}], "Set null value correctly");
      */
  var visibleRows = question.visibleRows;
  assert.equal(visibleRows.length, 3, "There shoud be 3 rows");
});

QUnit.test("Matrixdropdown value tests after cells generation", function(
  assert
) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");
  question.rows = ["row1", "row2", "row3"];
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  var visibleRows = question.visibleRows;
  question.value = { row2: { column1: 2 } };
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
});
QUnit.test("Matrixdynamic value tests after cells generation", function(
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.choices = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  var visibleRows = question.visibleRows;
  question.value = [{}, { column1: 2 }, {}];
  assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
});
QUnit.test("Matrixdynamic set text to rowCount property, bug #439", function(
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  new JsonObject().toObject({ type: "matrixdynamic", rowCount: "1" }, question);
  assert.equal(question.rowCount, 1, "Row count should be 1");
  question.addRow();
  assert.equal(question.rowCount, 2, "Row count should b 2 now");
});
QUnit.test("Matrixdynamic add/remove rows", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.name = "q1";
  page.addQuestion(question);
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.value = [{}, { column1: 2 }, {}];
  question.removeRow(1);
  assert.equal(question.rowCount, 2, "one row is removed");
  assert.deepEqual(question.value, [], "value is null now - array is empty");
  assert.equal(
    survey.getValue("q1"),
    null,
    "survey value is undefined or null"
  );
  question.addRow();
  assert.equal(question.rowCount, 3, "one row is added");
});
QUnit.test("Matrixdynamic isRequireConfirmOnRowDelete", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.name = "q1";
  page.addQuestion(question);
  question.rowCount = 3;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.value = [{}, { column1: 2 }, {}];
  assert.equal(
    question.isRequireConfirmOnRowDelete(0),
    false,
    "empty row, confirmDelete = false"
  );
  assert.equal(
    question.isRequireConfirmOnRowDelete(1),
    false,
    "non empty row, confirmDelete = false"
  );
  question.confirmDelete = true;
  assert.equal(
    question.isRequireConfirmOnRowDelete(0),
    false,
    "empty row, confirmDelete = true"
  );
  assert.equal(
    question.isRequireConfirmOnRowDelete(1),
    true,
    "non empty row, confirmDelete = true"
  );
});
QUnit.test("Matrixdynamic required column", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.columns[0].isRequired = true;
  assert.equal(rows.length, 2, "There are two rows");
  assert.equal(
    question.hasErrors(),
    true,
    "column1 should not be empty. All rows are empty"
  );
  assert.equal(
    question.getAllErrors().length,
    2,
    "There are totally two errors"
  );
  question.value = [{ column1: 2 }, {}];
  assert.equal(
    rows[0].cells[0].question.value,
    2,
    "The first cell has value 2"
  );
  assert.equal(
    question.hasErrors(),
    true,
    "column1 should not be empty. the second row is empty"
  );
  assert.equal(
    question.getAllErrors().length,
    1,
    "There are totally one errors"
  );
  question.value = [{ column1: 2 }, { column1: 3 }];
  assert.equal(
    question.hasErrors(),
    false,
    "column1 should not be empty. all values are set"
  );
  assert.equal(
    question.getAllErrors().length,
    0,
    "There are totally no errors"
  );
});
QUnit.test("Matrixdynamic column.validators", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.columns[0].validators.push(new EmailValidator());
  question.rowCount = 0;
  question.rowCount = 2;
  var rows = question.visibleRows;
  question.value = [{ column1: "aaa" }, {}];
  assert.equal(question.hasErrors(), true, "column1 should has valid e-mail");
  question.value = [{ column1: "aaa@aaa.com" }, {}];
  assert.equal(question.hasErrors(), false, "column1 has valid e-mail");
});
QUnit.test("Matrixdynamic duplicationError", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.keyName = "column1";
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.value = [{ column1: "val1" }, {}];
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1"
  );
  question.value = [{ column1: "val1" }, { column1: "val1" }];
  assert.equal(
    question.hasErrors(),
    true,
    "There is the error, row[0].column1=val1 and row[1].column2=val1"
  );
  assert.equal(
    question.visibleRows[0].getQuestionByColumnName("column1").errors.length,
    0,
    "There is no errors in the first row: errors.length"
  );
  assert.equal(
    question.visibleRows[0].getQuestionByColumnName("column1").hasVisibleErrors,
    false,
    "There is no errors in the first row: hasVisibleErrors"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column1").errors.length,
    1,
    "There is one error in the second row: errors.length"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column1").errors[0]
      .visible,
    true,
    "There is one error in the second row: error is visible"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column1").hasVisibleErrors,
    true,
    "There is one error in the second row: hasVisibleErrors"
  );
  question.value = [{ column1: "val1" }, { column1: "val2" }];
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1 and row[1].column2=val2"
  );
});
QUnit.test("Matrixdynamic column.isUnique, matrixdynamic", function(assert) {
  var question = new QuestionMatrixDynamicModel("q1");
  question.rowCount = 2;
  question.addColumn("column1").isUnique = true;
  question.addColumn("column2");
  question.addColumn("column3").isUnique = true;
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.value = [{ column1: "val1" }, {}];
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1"
  );
  question.value = [{ column1: "val1" }, { column1: "val1" }];
  assert.equal(
    question.hasErrors(),
    true,
    "There is the error, row[0].column1=val1 and row[1].column2=val1"
  );
  assert.equal(
    question.visibleRows[0].getQuestionByColumnName("column1").errors.length,
    0,
    "There is no errors in the first row"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column1").errors.length,
    1,
    "There is one error in the second row"
  );
  question.value = [{ column1: "val1" }, { column1: "val2" }];
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1 and row[1].column2=val2"
  );

  question.value = [
    { column1: "val1", column2: "val1", column3: "val1" },
    { column1: "val2", column2: "val1", column3: "val1" },
  ];
  assert.equal(
    question.hasErrors(),
    true,
    "There is the error, row[0].column3=val1 and row[1].column3=val1"
  );
  assert.equal(
    question.visibleRows[0].getQuestionByColumnName("column3").errors.length,
    0,
    "There is no errors in the first row"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column3").errors.length,
    1,
    "There is one error in the second row"
  );
  question.value = [
    { column1: "val1", column2: "val1", column3: "val1" },
    { column1: "val2", column2: "val1", column3: "val3" },
  ];
  assert.equal(question.hasErrors(), false, "There is no errors");
});
QUnit.test("Matrixdynamic column.isUnique, matrixdropdown", function(assert) {
  var question = new QuestionMatrixDropdownModel("q1");
  question.rows = ["row1", "row2"];
  question.addColumn("column1").isUnique = true;
  question.addColumn("column2");
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "No errors");
  question.value = { row1: { column1: "val1" } };
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1"
  );
  question.value = { row1: { column1: "val1" }, row2: { column1: "val1" } };
  assert.equal(
    question.hasErrors(),
    true,
    "There is the error, row[0].column1=val1 and row[1].column2=val1"
  );
  assert.equal(
    question.visibleRows[0].getQuestionByColumnName("column1").errors.length,
    0,
    "There is no errors in the first row"
  );
  assert.equal(
    question.visibleRows[1].getQuestionByColumnName("column1").errors.length,
    1,
    "There is one error in the second row"
  );
  question.value = { row1: { column1: "val1" }, row2: { column1: "val2" } };
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors, row[0].column1=val1 and row[1].column2=val2"
  );
});
QUnit.test("Matrixdynamic hasOther column", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.choices = [1, 2, 3];
  question.rowCount = 1;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns[0].hasOther = true;
  var rows = question.visibleRows;
  assert.equal(question.hasErrors(), false, "Everything is fine so far");
  rows[0].cells[0].question.value = "other";
  assert.equal(question.hasErrors(), true, "Should set other value");
});
QUnit.test("Matrixdynamic adjust rowCount on setting the value", function(
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.rowCount = 0;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.value = [{}, { column1: 2 }, {}];
  assert.equal(question.rowCount, 3, "It should be 3 rowCount");
  question.value = [{}, { column1: 2 }, {}, {}];
  assert.equal(question.rowCount, 4, "It should be 4 rowCount");
  question.value = [{ column1: 2 }];
  assert.equal(question.rowCount, 1, "RowCount is 1");
});
QUnit.test("Matrixdynamic minRowCount/maxRowCount", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.minRowCount = 3;
  question.maxRowCount = 5;
  assert.equal(question.rowCount, 3, "row count is min row count");
  question.rowCount = 5;
  assert.equal(question.rowCount, 5, "row count is 5");
  question.maxRowCount = 4;
  assert.equal(question.rowCount, 4, "row count is max row count");
  question.addRow();
  assert.equal(question.rowCount, 4, "row count is still max row count");
  question.minRowCount = 5;
  assert.equal(question.maxRowCount, 5, "maxRowCount = minRowCount");
  assert.equal(question.rowCount, 5, "row count is still max row count = 5");
});
QUnit.test("Matrixdynamic do not re-create the rows", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  var firstRowId = question.visibleRows[0].id;
  assert.notOk(
    firstRowId.indexOf("unde") > -1,
    "there should not be undefined in the row index"
  );
  var rowCount = question.visibleRows.length;
  question.addRow();
  assert.equal(question.visibleRows.length, rowCount + 1, "Add one row");
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row adding"
  );
  question.removeRow(question.rowCount - 1);
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row removing"
  );
  question.rowCount = 10;
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row count increasing"
  );
  question.rowCount = 1;
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after row count decreasing"
  );
  question.value = [{ col1: 2 }];
  assert.equal(
    question.visibleRows[0].id,
    firstRowId,
    "The first row is the same after setting value"
  );
});

QUnit.test("Matrixdynamic change column properties on the fly", function(
  assert
) {
  var question = new QuestionMatrixDynamicModel("matrixDymanic");
  question.addColumn("col1");
  var rows = question.visibleRows;
  assert.equal(
    rows[0].cells[0].question.getType(),
    "dropdown",
    "the default cell type is 'dropdown'"
  );
  assert.equal(
    (<QuestionDropdownModel>rows[0].cells[0].question).choices.length,
    question.choices.length,
    "By use question.choices by default"
  );
  question.columns[0]["choices"] = [1, 2, 3, 4, 5, 6, 7];
  assert.equal(
    (<QuestionDropdownModel>rows[0].cells[0].question).choices.length,
    question.columns[0]["choices"].length,
    "Use column choices if set"
  );
});

QUnit.test("Matrixdynamic customize cell editors", function(assert) {
  /*
          col2 - invisible if col1 is empty, [item1, item2] - if col1 = 1 and [item3, item4] if col1 = 2
      */
  var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
  matrix.addColumn("col1");
  matrix.addColumn("col2");
  matrix.columns[0]["choices"] = [1, 2];
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.pages[0].addQuestion(matrix);
  survey.onMatrixCellCreated.add(function(survey, options) {
    if (options.columnName == "col2") {
      options.cellQuestion.visible = options.rowValue["col1"] ? true : false;
    }
  });
  survey.onMatrixCellValueChanged.add(function(survey, options) {
    if (options.columnName != "col1") return;
    var question = options.getCellQuestion("col2");
    question.visible = options.value ? true : false;
    if (options.value == 1) question.choices = ["item1", "item2"];
    if (options.value == 2) question.choices = ["item3", "item4"];
  });
  matrix.rowCount = 1;
  var rows = matrix.visibleRows;
  var q1 = <QuestionDropdownModel>rows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>rows[0].cells[1].question;
  assert.equal(q2.visible, false, "col2 is invisible if col1 is empty");
  q1.value = 1;
  assert.equal(
    q2.choices[0].value,
    "item1",
    "col1 = 1, col2.choices = ['item1', 'item2']"
  );
  q1.value = 2;
  assert.equal(
    q2.choices[0].value,
    "item3",
    "col1 = 2, col2.choices = ['item3', 'item4']"
  );
  q1.value = null;
  assert.equal(q2.visible, false, "col2 is invisible if col1 = null");
  matrix.addRow();
  assert.equal(
    (<QuestionDropdownModel>rows[1].cells[1].question).visible,
    false,
    "row2. col2 is invisible if col1 = null"
  );
});

QUnit.test(
  "MatrixCellCreated set cell value https://github.com/surveyjs/surveyjs/issues/1259#issuecomment-413947851",
  function(assert) {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    survey.onMatrixCellCreated.add(function(survey, options) {
      if (options.columnName === "col2") {
        options.cellQuestion.value = "A";
      }
      // if (options.columnName === "col1") {
      //   options.rowValue[options.columnName] = "B";
      //   //options.row.setValue(options.columnName, options.columnName);
      // }
    });
    matrix.rowCount = 1;
    assert.equal(matrix.visibleRows.length, 1, "one row");
    assert.deepEqual(
      matrix.value,
      [{ col2: "A" }], //[{ col1: "B", col2: "A" }],
      "col1 is B, col2 is A"
    );
  }
);

//QUnit.test("Matrixdynamic validate cell values - do not allow to have the same value", function (assert) {
QUnit.test(
  "Matrixdynamic validate cell values - onMatrixCellValueChanged",
  function(assert) {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function(survey, options) {
      cellQuestions.push(options.cellQuestion);
    });
    var col1Question = undefined;
    survey.onMatrixCellValidate.add(function(survey, options) {
      if (options.value == "notallow") {
        options.error = "This cell is not allow";
      }
      col1Question = options.getCellQuestion("col1");
    });
    var rows = matrix.visibleRows;
    assert.equal(
      cellQuestions.length,
      2,
      "There are 2 cell questions in the array"
    );
    cellQuestions[0].value = "notallow";
    matrix.hasErrors(true);
    assert.equal(cellQuestions[0].errors.length, 1, "There is an error");
    cellQuestions[0].value = "allow";
    matrix.hasErrors(true);
    assert.equal(cellQuestions[0].errors.length, 0, "There is no errors");
    assert.equal(
      col1Question.name,
      "col1",
      "options.getQuestion works correctly"
    );
  }
);

QUnit.test(
  "Matrixdynamic validate cell values - do not allow to have the same value",
  function(assert) {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function(survey, options) {
      cellQuestions.push(options.cellQuestion);
    });
    survey.onMatrixCellValueChanged.add(function(survey, options) {
      //validate value on change
      options.getCellQuestion("col1").hasErrors(true);
    });
    survey.onMatrixCellValidate.add(function(survey, options) {
      var rows = options.question.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        //we have the same row
        if (rows[i] === options.row) continue;
        if (rows[i].value && rows[i].value["col1"] == options.value) {
          options.error = "You have already select the same value";
        }
      }
    });
    var rows = matrix.visibleRows;
    assert.equal(
      cellQuestions.length,
      2,
      "There are 2 cell questions in the array"
    );
    cellQuestions[0].value = 1;
    assert.equal(cellQuestions[1].errors.length, 0, "There is now errors");
    cellQuestions[1].value = 1;
    assert.equal(cellQuestions[1].errors.length, 1, "There is an error");
    cellQuestions[1].value = 2;
    assert.equal(cellQuestions[1].errors.length, 0, "There no errors again");
  }
);
QUnit.test(
  "Matrixdynamic onMatrixValueChanging - control the value in the cell",
  function(assert) {
    var json = {
      questions: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "using",
              choices: ["Yes", "No"],
              cellType: "radiogroup",
            },
            {
              name: "experience",
              cellType: "text",
              visibleIf: "{row.using} = 'Yes'",
            },
          ],
        },
      ],
      clearInvisibleValues: "onHidden",
    };
    var survey = new SurveyModel(json);
    survey.onMatrixCellValueChanging.add(function(sender, options) {
      if (options.columnName == "experience" && !options.value) {
        options.value = options.oldValue;
      }
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    matrix.value = [{ using: "Yes", experience: "3" }];
    assert.equal(
      matrix.visibleRows[0].cells[1].question.value,
      "3",
      "Value is 3"
    );
    matrix.visibleRows[0].cells[0].question.value = "No";
    assert.equal(
      matrix.visibleRows[0].cells[1].question.value,
      "3",
      "Value is still 3"
    );
  }
);

QUnit.test("Matrixdropdown different cell types", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");

  question.columns.push(new MatrixDropdownColumn("dropdown"));
  question.columns.push(new MatrixDropdownColumn("checkbox"));
  question.columns.push(new MatrixDropdownColumn("radiogroup"));
  question.columns.push(new MatrixDropdownColumn("text"));
  question.columns.push(new MatrixDropdownColumn("comment"));
  question.columns.push(new MatrixDropdownColumn("boolean"));

  for (var i = 0; i < question.columns.length; i++) {
    question.columns[i].cellType = question.columns[i].name;
  }
  question.rows = ["row1", "row2", "row3"];

  for (var i = 0; i < question.columns.length; i++) {
    var col = question.columns[i];
    var row = question.visibleRows[0];
    assert.equal(
      row.cells[i].question.getType(),
      col.name,
      "Expected " + col.name + ", but was" + row.cells[i].question.getType()
    );
  }
});
QUnit.test("Matrixdropdown boolean cellType", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");

  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));
  question.cellType = "boolean";

  question.rows = ["row1"];
  var visibleRows = question.visibleRows;
  visibleRows[0].cells[0].question.value = true;
  visibleRows[0].cells[1].question.value = false;
  assert.deepEqual(
    question.value,
    { row1: { col1: true, col2: false } },
    "Boolean field set value correctly"
  );
});
QUnit.test("Matrixdropdown booleanDefaultValue", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");

  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));
  question.cellType = "boolean";
  question.columns[0]["defaultValue"] = "true";
  question.columns[1]["defaultValue"] = "false";

  question.rows = ["row1"];
  var visibleRows = question.visibleRows;
  assert.deepEqual(
    question.value,
    { row1: { col1: true, col2: false } },
    "Boolean field set value correctly"
  );
});

QUnit.test("Matrixdropdown defaultValue", function(assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdropdown",
        name: "q1",
        defaultValue: { row1: { col1: 1 } },
        columns: [
          {
            name: "col1",
            choices: [1, 2, 3],
          },
        ],
        rows: [
          {
            value: "row1",
          },
        ],
      },
    ],
  });
  var question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
  assert.deepEqual(
    question.value,
    { row1: { col1: 1 } },
    "default value has been assign"
  );
});

QUnit.test("matrixdynamic.defaultValue - check the complex property", function(
  assert
) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [{ name: "col1" }, { name: "col2" }],
        defaultValue: [
          { col1: 1, col2: 2 },
          { col1: 3, col2: 4 },
        ],
      },
    ],
  });
  assert.deepEqual(
    survey.getValue("matrix"),
    [
      { col1: 1, col2: 2 },
      { col1: 3, col2: 4 },
    ],
    "set complex defaultValue correctly"
  );
});

QUnit.test("Matrixdropdown minRowCount", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  question.rowCount = 2;
  question.addColumn("column1");
  var rows = question.visibleRows;
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors in the matrix. Null is possible"
  );
  assert.equal(rows[0].isEmpty, true, "There is no error in the first row");
  assert.equal(rows[1].isEmpty, true, "There is no error in the second row");
  question.minRowCount = 2;
  assert.equal(
    question.hasErrors(),
    false,
    "There is no errors in the matrix. question is not required"
  );
  question.minRowCount = 0;
  question.isRequired = true;
  assert.equal(question.hasErrors(), true, "Question is requried now");
  rows[0].cells[0].question.value = "val1";
  assert.equal(question.hasErrors(), false, "Question has value");
  question.minRowCount = 2;
  assert.equal(
    question.hasErrors(),
    true,
    "Error, value in two rows are required"
  );
  rows[1].cells[0].question.value = "val2";
  assert.equal(question.hasErrors(), false, "No errors, all rows have values");
});
QUnit.test("Matrixdropdown supportGoNextPageAutomatic property", function(
  assert
) {
  var question = new QuestionMatrixDropdownModel("matrix");
  question.rows = ["row1", "row2"];
  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));
  var rows = question.visibleRows;
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "There is no value in rows"
  );
  question.value = { row1: { col1: 1, col2: 11 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "There is no value in the second row"
  );
  question.value = {
    row1: { col1: 1, col2: 11 },
    row2: { col1: 2, col2: 22 },
  };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    true,
    "All row values are set"
  );
  question.value = { row1: { col1: 1 }, row2: { col1: 2, col2: 22 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "The first row is not set completely"
  );
});

QUnit.test(
  "Matrixdropdown supportGoNextPageAutomatic always false for checkbox",
  function(assert) {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    question.columns[1].cellType = "checkbox";
    var json = new JsonObject().toJsonObject(question);
    json.type = question.getType();
    question.columns.push(new MatrixDropdownColumn("col3"));
    question.columns.push(new MatrixDropdownColumn("col4"));
    new JsonObject().toObject(json, question);

    assert.equal(question.columns.length, 2, "There were two columns");
  }
);

QUnit.test("Text date supportGoNextPageAutomatic false", function(assert) {
  var question = new QuestionTextModel("text");
  assert.equal(question.supportGoNextPageAutomatic(), true, "Suppored");
  question.inputType = "date";
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "Not suppored for date"
  );
});

QUnit.test("Matrixdropdown set columns", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrix");
  question.rows = ["row1", "row2"];
  question.columns.push(new MatrixDropdownColumn("col1"));
  question.columns.push(new MatrixDropdownColumn("col2"));

  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "There is no value in rows"
  );
  question.value = { row1: { col1: 1, col2: 11 } };
  assert.equal(
    question.supportGoNextPageAutomatic(),
    false,
    "Checkbox doesn't support gotNextPageAutomatic"
  );
});

QUnit.test("Matrixdynamic column.visibleIf", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.columns.push(new MatrixDropdownColumn("column3"));
  question.columns[0]["choices"] = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.columns[2]["choices"] = [7, 8, 9, 10];
  question.columns[2].isRequired = true;

  question.columns[1].visibleIf = "{row.column1} = 2";
  question.columns[2].visibleIf = "{a} = 5";

  var visibleRows = question.visibleRows;
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

  var values = { a: 3 };
  question.runCondition(values, null);
  assert.equal(q1.visible, true, "1. q1 visibleIf is empty");
  assert.equal(q2.visible, false, "1. q2 visibleIf depends on column1 - false");
  assert.equal(
    q3.visible,
    false,
    "1. q3 visibleIf depends on external data - false"
  );
  assert.equal(
    question.hasErrors(),
    false,
    "1. q3 required column is invisible."
  );

  values = { a: 5 };
  question.runCondition(values, null);
  assert.equal(
    q3.visible,
    true,
    "2. q3 visibleIf depends on external data - true"
  );

  q1.value = 2;
  question.runCondition(values, null);
  assert.equal(q2.visible, true, "3. q2 visibleIf depends on column1 - true");
});
QUnit.test("Matrixdynamic column.enableIf", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.columns.push(new MatrixDropdownColumn("column3"));
  question.columns[0]["choices"] = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.columns[2]["choices"] = [7, 8, 9, 10];
  question.columns[2].isRequired = true;

  question.columns[1].enableIf = "{row.column1} = 2";
  question.columns[2].enableIf = "{a} = 5";

  var visibleRows = question.visibleRows;
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

  var values = { a: 3 };
  question.runCondition(values, null);
  assert.equal(q1.isReadOnly, false, "1. q1 enableIf is empty");
  assert.equal(
    q2.isReadOnly,
    true,
    "1. q2 enableIf depends on column1 - false"
  );
  assert.equal(
    q3.isReadOnly,
    true,
    "1. q3 enableIf depends on external data - false"
  );
  values = { a: 5 };
  question.runCondition(values, null);
  assert.equal(
    q3.isReadOnly,
    false,
    "2. q3 enableIf depends on external data - true"
  );

  q1.value = 2;
  question.runCondition(values, null);
  assert.equal(
    q2.isReadOnly,
    false,
    "3. q2 enableIf depends on column1 - true"
  );
});
QUnit.test("Matrixdynamic column.requiredIf", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.columns.push(new MatrixDropdownColumn("column3"));
  question.columns[0]["choices"] = [1, 2, 3];
  question.columns[1]["choices"] = [4, 5];
  question.columns[2]["choices"] = [7, 8, 9, 10];

  question.columns[1].requiredIf = "{row.column1} = 2";
  question.columns[2].requiredIf = "{a} = 5";

  var visibleRows = question.visibleRows;
  var q1 = <QuestionDropdownModel>visibleRows[0].cells[0].question;
  var q2 = <QuestionDropdownModel>visibleRows[0].cells[1].question;
  var q3 = <QuestionDropdownModel>visibleRows[0].cells[2].question;

  var values = { a: 3 };
  question.runCondition(values, null);
  assert.equal(q1.isRequired, false, "1. q1 requiredIf is empty");
  assert.equal(
    q2.isRequired,
    false,
    "1. q2 requireIf depends on column1 - false"
  );
  assert.equal(
    q3.isRequired,
    false,
    "1. q3 requiredIf depends on external data - false"
  );
  values = { a: 5 };
  question.runCondition(values, null);
  assert.equal(
    q3.isRequired,
    true,
    "2. q3 requiredIf depends on external data - true"
  );

  q1.value = 2;
  question.runCondition(values, null);
  assert.equal(
    q2.isRequired,
    true,
    "3. q2 requiredIf depends on column1 - true"
  );
});
QUnit.test(
  "Matrixdynamic column.visibleIf, load from json and add item",
  function(assert) {
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          rowCount: 1,
          columns: [
            { name: "col1", choices: [1, 2] },
            { name: "col2", visibleIf: "{row.col1} = 1" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var rows = matrix.visibleRows;
    var q_0_1 = <QuestionDropdownModel>rows[0].cells[1].question;
    assert.equal(q_0_1.visible, false, "Initial the question is invisible");
    matrix.addRow();
    var q_1_1 = <QuestionDropdownModel>rows[1].cells[1].question;
    assert.equal(
      q_1_1.visible,
      false,
      "Initial the question in the added row is invisible"
    );
  }
);
QUnit.test(
  "Matrixdynamic column.visibleIf, hide column if all cells are invisible",
  function(assert) {
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            { name: "col1", choices: [1, 2], visibleIf: "{q2}=1" },
            { name: "col2", visibleIf: "{row.col1} = 1" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var rows = matrix.visibleRows;
    assert.equal(
      matrix.columns[0].hasVisibleCell,
      false,
      "The first column is invisible"
    );
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      false,
      "The second column is invisible"
    );
    survey.setValue("q2", 1);
    assert.equal(
      matrix.columns[0].hasVisibleCell,
      true,
      "The first column is visible"
    );
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      false,
      "The second column is still invisible"
    );
    matrix.visibleRows[0].cells[0].question.value = 1;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      true,
      "The second column is visible now"
    );
    matrix.visibleRows[1].cells[0].question.value = 1;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      true,
      "The second column is visible now, #2"
    );
    matrix.visibleRows[0].cells[0].question.value = 2;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      true,
      "The second column is visible now, #3"
    );
    matrix.visibleRows[1].cells[0].question.value = 2;
    assert.equal(
      matrix.columns[1].hasVisibleCell,
      false,
      "The second column is invisible now"
    );
    survey.setValue("q2", 2);
    assert.equal(
      matrix.columns[0].hasVisibleCell,
      false,
      "The first column is invisible now"
    );
    //assert.equal(matrix.renderedTable.headerRow.cells.length, 0, "There is no cells headers");
    //assert.equal(matrix.renderedTable.rows[0].cells.length, 0, "There is no cells in rows");
  }
);

QUnit.test("MatrixDropdownColumn cell question", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  var column = question.addColumn("col1");
  assert.equal(
    column.templateQuestion.getType(),
    "dropdown",
    "The default type is dropdown"
  );
  question.cellType = "radiogroup";
  assert.equal(
    column.templateQuestion.getType(),
    "radiogroup",
    "The default type is radiogroup"
  );
  column.cellType = "checkbox";
  assert.equal(
    column.templateQuestion.getType(),
    "checkbox",
    "The question type is checkbox"
  );
});

QUnit.test(
  "MatrixDropdownColumn cell question isEditableTemplateElement",
  function(assert) {
    var question = new QuestionMatrixDynamicModel("matrix");
    var column = question.addColumn("col1");
    assert.equal(
      column.templateQuestion.isEditableTemplateElement,
      true,
      "The question isEditableTemplateElement"
    );
  }
);

QUnit.test("MatrixDropdownColumn properties are in questions", function(
  assert
) {
  var column = new MatrixDropdownColumn("col1");
  column.title = "some text";
  assert.equal(column.templateQuestion.name, "col1", "name set into question");
  assert.equal(
    column.templateQuestion.title,
    "some text",
    "title into question"
  );
  column.cellType = "checkbox";
  assert.equal(
    column.templateQuestion.getType(),
    "checkbox",
    "cell type is changed"
  );
  assert.equal(
    column.templateQuestion.name,
    "col1",
    "name is still in question"
  );
  assert.equal(
    column.templateQuestion.title,
    "some text",
    "title is still in question"
  );
});
QUnit.test("MatrixDropdownColumn add/remove serialization properties", function(
  assert
) {
  var column = new MatrixDropdownColumn("col1");
  assert.ok(
    column["optionsCaption"],
    "optionsCaption property has been created"
  );
  assert.ok(
    column["locOptionsCaption"],
    "Serialization property has been created for optionsCaption"
  );
  column.cellType = "text";
  assert.notOk(
    column["optionsCaption"],
    "optionsCaption property has been removed"
  );
  assert.notOk(
    column["locOptionsCaption"],
    "Serialization property has been removed for optionsCaption"
  );
});
QUnit.test("MatrixDropdownColumn cellType property, choices", function(assert) {
  var prop = Serializer.findProperty("matrixdropdowncolumn", "cellType");
  assert.ok(prop, "Property is here");
  assert.equal(prop.choices.length, 9, "There are 9 cell types by default");
  assert.equal(prop.choices[0], "default", "The first value is default");
  assert.equal(prop.choices[1], "dropdown", "The second value is default");
});

QUnit.test(
  "MatrixDropdownColumn copy local choices into cell question",
  function(assert) {
    var question = new QuestionMatrixDynamicModel("matrix");
    question.choices = [1, 2, 3];
    var column = question.addColumn("col1");
    column["choices"] = [4, 5];
    question.rowCount = 1;
    var rows = question.visibleRows;
    assert.equal(
      rows[0].cells[0].question["choices"].length,
      2,
      "There are 2 choices"
    );
    assert.equal(
      rows[0].cells[0].question["choices"][0].value,
      4,
      "The first value is 4"
    );
  }
);

QUnit.test("MatrixDropdownColumn load choices from json", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrix");
  var json = {
    type: "matrixdropdown",
    name: "frameworksRate",
    choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
    columns: [
      {
        name: "using",
        title: "Do you use it?",
        choices: ["Yes", "No"],
        cellType: "radiogroup",
      },
      {
        name: "experience",
        title: "How long do you use it?",
        choices: [
          { value: 5, text: "3-5 years" },
          { value: 2, text: "1-2 years" },
          {
            value: 1,
            text: "less than a year",
          },
        ],
      },
    ],
    rows: [{ value: "reactjs" }],
  };
  new JsonObject().toObject(json, question);
  var rows = question.visibleRows;
  assert.equal(
    rows[0].cells[1].question["choices"].length,
    3,
    "There are 3 choices"
  );
  assert.equal(
    rows[0].cells[1].question["choices"][0].value,
    5,
    "The first value is 5"
  );
});

QUnit.test(
  "MatrixDynamic do not generate an error on setting a non-array value",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = new QuestionMatrixDynamicModel("matrix");
    page.addElement(question);
    question.addColumn("col1");
    question.rowCount = 1;
    survey.setValue("matrix", "sometext");
    assert.equal(question.value, "sometext", "It does not generate the error");
  }
);

QUnit.test("matrixDynamic.addConditionObjectsByContext", function(assert) {
  var objs = [];
  var question = new QuestionMatrixDynamicModel("matrix");
  question.title = "Matrix";
  question.addColumn("col1", "Column 1");
  question.addColumn("col2");
  question.addConditionObjectsByContext(objs, null);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
    ],
    "addConditionObjectsByContext work correctly for matrix dynamic"
  );
  objs = [];
  question.addConditionObjectsByContext(objs, question.columns[0]);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      {
        name: "matrix[0].col1",
        text: "Matrix[0].Column 1",
        question: "matrix",
      },
      { name: "matrix[0].col2", text: "Matrix[0].col2", question: "matrix" },
      { name: "row.col2", text: "row.col2", question: "matrix" },
    ],
    "addConditionObjectsByContext work correctly for matrix dynamic with context"
  );
});
QUnit.test(
  "matrixDynamic.addConditionObjectsByContext + settings.matrixMaxRowCountInCondition",
  function(assert) {
    var objs = [];
    var question = new QuestionMatrixDynamicModel("matrix");
    question.title = "Matrix";
    question.addColumn("col1", "Column 1");
    question.addConditionObjectsByContext(objs, null);
    for (var i = 0; i < objs.length; i++) delete objs[i].question;
    assert.deepEqual(
      objs,
      [
        {
          name: "matrix[0].col1",
          text: "Matrix[0].Column 1",
        },
      ],
      "addConditionObjectsByContext work correctly for matrix dynamic"
    );
    question.rowCount = 0;
    settings.matrixMaxRowCountInCondition = 3;

    objs = [];
    question.addConditionObjectsByContext(objs, null);
    for (var i = 0; i < objs.length; i++) delete objs[i].question;
    assert.deepEqual(
      objs,
      [
        {
          name: "matrix[0].col1",
          text: "Matrix[0].Column 1",
        },
      ],
      "addConditionObjectsByContext work correctly for matrix dynamic, rowCount is 0"
    );
    question.rowCount = 4;
    objs = [];
    question.addConditionObjectsByContext(objs, null);
    for (var i = 0; i < objs.length; i++) delete objs[i].question;
    assert.deepEqual(
      objs,
      [
        {
          name: "matrix[0].col1",
          text: "Matrix[0].Column 1",
        },
        {
          name: "matrix[1].col1",
          text: "Matrix[1].Column 1",
        },
        {
          name: "matrix[2].col1",
          text: "Matrix[2].Column 1",
        },
      ],
      "addConditionObjectsByContext work correctly for matrix dynamic, rowCount is 4, but settings.matrixMaxRowCountInCondition is 3"
    );
    settings.matrixMaxRowCountInCondition = 1;
  }
);
QUnit.test("matrixDropdown.addConditionObjectsByContext", function(assert) {
  var objs = [];
  var question = new QuestionMatrixDropdownModel("matrix");
  question.addColumn("col1", "Column 1");
  question.addColumn("col2");
  question.rows = ["row1", "row2"];
  question.title = "Matrix";
  question.rows[0].text = "Row 1";
  question.addConditionObjectsByContext(objs, null);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      {
        name: "matrix.row1.col1",
        text: "Matrix.Row 1.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row1.col2",
        text: "Matrix.Row 1.col2",
        question: "matrix",
      },
      {
        name: "matrix.row2.col1",
        text: "Matrix.row2.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row2.col2",
        text: "Matrix.row2.col2",
        question: "matrix",
      },
    ],
    "addConditionObjectsByContext work correctly for matrix dropdown"
  );
  objs = [];
  question.addConditionObjectsByContext(objs, question.columns[0]);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      {
        name: "matrix.row1.col1",
        text: "Matrix.Row 1.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row1.col2",
        text: "Matrix.Row 1.col2",
        question: "matrix",
      },
      {
        name: "matrix.row2.col1",
        text: "Matrix.row2.Column 1",
        question: "matrix",
      },
      {
        name: "matrix.row2.col2",
        text: "Matrix.row2.col2",
        question: "matrix",
      },
      { name: "row.col2", text: "row.col2", question: "matrix" },
    ],
    "addConditionObjectsByContext work correctly for matrix dropdown with context"
  );
});

QUnit.test("matrixDynamic.getConditionJson", function(assert) {
  var names = [];
  var question = new QuestionMatrixDynamicModel("matrix");
  question.addColumn("col1");
  question.addColumn("col2");
  question.columns[0]["choices"] = [1, 2];
  question.columns[1].cellType = "checkbox";
  question.columns[1]["choices"] = [1, 2, 3];
  question.rowCount = 2;
  var json = question.getConditionJson("equals", "[0].col1");
  assert.deepEqual(json.choices, [1, 2], "column 1 get choices");
  assert.equal(json.type, "dropdown", "column 1 get type");
  json = question.getConditionJson("equals", "row.col2");
  assert.deepEqual(json.choices, [1, 2, 3], "column 2 get choices");
  assert.equal(json.type, "checkbox", "column 2 get type");
  json = question.getConditionJson("contains", "[0].col2");
  assert.equal(json.type, "radiogroup", "column 2 get type for contains");
});

QUnit.test("matrixDynamic.clearInvisibleValues", function(assert) {
  var names = [];
  var question = new QuestionMatrixDynamicModel("matrix");
  question.addColumn("col1");
  question.addColumn("col2");
  question.columns[0]["choices"] = [1, 2];
  question.columns[1]["choices"] = [1, 2, 3];
  question.rowCount = 2;
  question.value = [
    { col1: 1, col2: 4 },
    { col4: 1, col2: 2 },
  ];
  question.clearIncorrectValues();
  assert.deepEqual(
    question.value,
    [{ col1: 1 }, { col2: 2 }],
    "clear unexisting columns and values"
  );
});

QUnit.test("matrixDropdown.clearInvisibleValues", function(assert) {
  var names = [];
  var question = new QuestionMatrixDropdownModel("matrix");
  question.addColumn("col1");
  question.addColumn("col2");
  question.columns[0]["choices"] = [1, 2];
  question.columns[1]["choices"] = [1, 2, 3];
  question.rows = ["row1", "row2"];
  question.value = {
    row1: { col1: 1, col2: 4 },
    row0: { col1: 1 },
    row2: { col4: 1, col2: 2 },
  };
  question.clearIncorrectValues();
  assert.deepEqual(
    question.value,
    { row1: { col1: 1 }, row2: { col2: 2 } },
    "clear unexisting columns and values"
  );
});

QUnit.test(
  "matrixDropdown.clearInvisibleValues, do not clear totals, Bug#2553",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 1,
          columns: [
            {
              name: "Column1",
            },
            {
              name: "Column2",
            },
            {
              name: "Column3",
              cellType: "expression",
              totalType: "sum",
              expression: "{row.Column1}+{row.Column2}",
            },
          ],
          cellType: "text",
        },
      ],
    };

    var survey = new SurveyModel(json);
    var data = {
      "question1-total": { Column3: 3 },
      question1: [{ Column1: "1", Column2: "2", Column3: 3 }],
    };
    survey.data = data;
    survey.clearIncorrectValues(true);
    assert.deepEqual(survey.data, data, "values should be the same");
  }
);

QUnit.test("Set totals correctly for read-only question", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        name: "question1",
        rowCount: 1,
        columns: [
          {
            name: "Column1",
          },
          {
            name: "Column2",
          },
          {
            name: "Column3",
            cellType: "expression",
            totalType: "sum",
            expression: "{row.Column1}+{row.Column2}",
          },
        ],
        cellType: "text",
      },
    ],
  };

  var survey = new SurveyModel(json);
  survey.mode = "display";
  var data = {
    "question1-total": { Column3: 3 },
    question1: [{ Column1: "1", Column2: "2", Column3: 3 }],
  };
  survey.data = data;
  var question = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
  var renderedTable = question.renderedTable;
  assert.equal(
    renderedTable.rows[0].cells[2].question.value,
    3,
    "Value for cell expression set correctly"
  );
  assert.equal(
    renderedTable.footerRow.cells[2].question.value,
    3,
    "Value for total row expression set correctly, #rendered table"
  );
  assert.equal(
    question.visibleTotalRow.cells[2].question.value,
    3,
    "Value for total row expression set correctly, #visibleTotalRow"
  );
  assert.deepEqual(survey.data, data, "values should be the same");
});

QUnit.test(
  "matrixDynamic.clearInvisibleValues do not call it on changing condition if clearInvisibleValues doesn't eaqual to 'onHidden'",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "color",
              cellType: "text",
            },
          ],
          rows: [
            "1",
            {
              value: "2",
              visibleIf: "{var1}=1",
            },
            "3",
          ],
        },
      ],
    });
    var question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
    assert.equal(question.isEmpty(), true, "It is empty");
    survey.setValue("var1", 1);
    question.value = { "2": "abc" };
    survey.setValue("var1", 2);
    assert.deepEqual(question.value, { "2": "abc" }, "Change nothing");
    survey.setValue("var1", 1);
    survey.clearInvisibleValues = "onHidden";
    survey.setValue("var1", 2);
    assert.equal(question.isEmpty(), true, "It is empty again");
  }
);

QUnit.test("Matrixdropdown column.index", function(assert) {
  var question = new QuestionMatrixDropdownModel("matrixDropdown");
  question.rows = ["row1"];
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns.push(new MatrixDropdownColumn("column2"));
  question.columns.push(new MatrixDropdownColumn("column3"));
  for (var i = 0; i < question.columns.length; i++) {
    assert.equal(
      question.columns[i].index,
      i,
      "column.index is correct after push"
    );
  }
  question.columns.splice(1, 1);
  assert.equal(question.columns.length, 2, "now 2 columns");
  for (var i = 0; i < question.columns.length; i++) {
    assert.equal(
      question.columns[i].index,
      i,
      "column.index is correct after removing"
    );
  }
});
QUnit.test("Matrixdynamic allowAddRows property", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  assert.equal(question.allowAddRows, true, "allowAddRows is true by default");
  assert.equal(question.canAddRow, true, "canAddRow is true");
  question.allowAddRows = false;
  assert.equal(question.canAddRow, false, "canAddRow is false");
});
QUnit.test("Matrixdynamic allowRemoveRows property", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  assert.equal(
    question.allowRemoveRows,
    true,
    "allowRemoveRows is true by default"
  );
  assert.equal(question.canRemoveRows, true, "canRemoveRows is true");
  question.allowRemoveRows = false;
  assert.equal(question.canRemoveRows, false, "canRemoveRows is false");
});
QUnit.test("Matrixdynamic addRowLocation", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrix");
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    false,
    "columnsLocation='horizontal', addRowLocation='default', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    true,
    "columnsLocation='horizontal', addRowLocation='default', #2"
  );
  question.addRowLocation = "top";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    true,
    "columnsLocation='horizontal', addRowLocation='top', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    false,
    "columnsLocation='horizontal', addRowLocation='top', #2"
  );
  question.addRowLocation = "bottom";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    false,
    "columnsLocation='horizontal', addRowLocation='bottom', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    true,
    "columnsLocation='horizontal', addRowLocation='bottom', #2"
  );
  question.addRowLocation = "topBottom";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    true,
    "columnsLocation='horizontal', addRowLocation='topBottom', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    true,
    "columnsLocation='horizontal', addRowLocation='topBottom', #2"
  );
  question.columnsLocation = "vertical";
  question.addRowLocation = "default";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    true,
    "columnsLocation='vertical', addRowLocation='default', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    false,
    "columnsLocation='vertical', addRowLocation='default', #2"
  );
  question.addRowLocation = "top";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    true,
    "columnsLocation='vertical', addRowLocation='top', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    false,
    "columnsLocation='vertical', addRowLocation='top', #2"
  );
  question.addRowLocation = "bottom";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    false,
    "columnsLocation='vertical', addRowLocation='bottom', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    true,
    "columnsLocation='vertical', addRowLocation='bottom', #2"
  );
  question.addRowLocation = "topBottom";
  assert.equal(
    question.renderedTable.showAddRowOnTop,
    true,
    "columnsLocation='vertical', addRowLocation='topBottom', #1"
  );
  assert.equal(
    question.renderedTable.showAddRowOnBottom,
    true,
    "columnsLocation='vertical', addRowLocation='topBottom', #2"
  );
});

QUnit.test("matrix.rowsVisibleIf", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionMatrixDropdownModel("bestCar");
  qBestCar.addColumn("col1");
  qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.rowsVisibleIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.visibleRows.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleRows.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleRows.length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.visibleRows.length, 4, "there is no filter");
});

/* Very likely we do not need this functional.
QUnit.test("matrix.rowsVisibleIf, use 'row.' context", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var matrix = new QuestionMatrixDropdownModel("bestCar");
  matrix.addColumn("col1");
  matrix.addColumn("col2");
  matrix.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  matrix.rowsVisibleIf = "{row.col2} != 1";
  page.addElement(matrix);
  assert.equal(matrix.visibleRows.length, 4, "all rows are shown");
  matrix.value = [{ Audi: { col2: 1 } }];
  assert.equal(matrix.visibleRows.length, 3, "Audi is hidden");
  matrix.value = [{ Audi: { col2: 1 } }, { BMW: { col2: 1 } }];
  assert.equal(matrix.visibleRows.length, 2, "Audi and BMW is hidden");
  matrix.value = null;
  assert.equal(matrix.visibleRows.length, 4, "all rows are shown again");
});
*/
QUnit.test(
  "matrix.rowsVisibleIf, clear value on making the value invisible",
  function(assert) {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onHidden";
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionMatrixDropdownModel("bestCar");
    qBestCar.cellType = "text";
    qBestCar.addColumn("col1");
    qBestCar.addColumn("col2");
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = { BMW: { col1: 1 }, Audi: { col2: 2 } };
    assert.deepEqual(
      qBestCar.value,
      { BMW: { col1: 1 }, Audi: { col2: 2 } },
      "Audi is selected"
    );
    survey.setValue("cars", ["BMW"]);
    assert.deepEqual(qBestCar.value, { BMW: { col1: 1 } }, "Audi is removed");
    survey.setValue("cars", ["Mercedes"]);
    assert.deepEqual(qBestCar.isEmpty(), true, "All checks are removed");
  }
);

QUnit.test("matrix.defaultRowValue, apply from json and then from UI", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        cellType: "text",
        name: "q1",
        columns: [
          { name: "column1" },
          { name: "column2" },
          { name: "column3" },
        ],
        rowCount: 2,
        defaultRowValue: { column1: "val1", column3: "val3" },
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  assert.deepEqual(
    question.value,
    [
      { column1: "val1", column3: "val3" },
      { column1: "val1", column3: "val3" },
    ],
    "defaultRowValue set correctly on json loading"
  );
  question.addRow();
  assert.deepEqual(
    question.value,
    [
      { column1: "val1", column3: "val3" },
      { column1: "val1", column3: "val3" },
      { column1: "val1", column3: "val3" },
    ],
    "defaultRowValue set correclty on adding row"
  );
});

QUnit.test(
  "matrix.defaultRowValue, defaultValue has higher priority than defaultRowValue",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          cellType: "text",
          name: "q1",
          columns: [
            { name: "column1" },
            { name: "column2" },
            { name: "column3" },
          ],
          rowCount: 2,
          defaultRowValue: { column1: "val1", column3: "val3" },
          defaultValue: [
            { column1: "val2", column3: "val5" },
            { column2: "val2", column3: "val4" },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    assert.deepEqual(
      question.value,
      [
        { column1: "val2", column3: "val5" },
        { column2: "val2", column3: "val4" },
      ],
      "defaultValue is used"
    );
  }
);

QUnit.test("rowIndex variable, in text processing", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        name: "q1",
        columns: [
          { name: "column1", cellType: "expression", expression: "{rowIndex}" },
        ],
        rowCount: 2,
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  var rows = question.visibleRows;
  assert.equal(rows[0].cells[0].question.value, 1, "The first row has index 1");
  assert.equal(rows[1].cells[0].question.value, 2, "The first row has index 2");
});
QUnit.test("rowValue variable, in text processing", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          {
            name: "column1",
            cellType: "expression",
            expression: "{rowValue} * 2",
          },
        ],
        rows: [1, 2, 3],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  var rows = question.visibleRows;
  assert.equal(
    rows[0].cells[0].question.value,
    2,
    "The first row has row name 1"
  );
  assert.equal(
    rows[1].cells[0].question.value,
    4,
    "The first row has row name 2"
  );
});
QUnit.test("rowValue variable in expression", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          { name: "column1", cellType: "expression", expression: "{rowValue}" },
        ],
        rows: ["Row 1", "Row 2"],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  var rows = question.visibleRows;
  assert.equal(
    rows[0].cells[0].question.value,
    "Row 1",
    "The first row has rowValue 'Row 1'"
  );
  assert.equal(
    rows[1].cells[0].question.value,
    "Row 2",
    "The first row has rowValue 'Row 2'"
  );
});

QUnit.test("row property in custom function", function(assert) {
  var rowCustomFunc = function(params: any) {
    var val = this.row.getValue(params[0]);
    return !!val ? val + val : "";
  };
  FunctionFactory.Instance.register("rowCustomFunc", rowCustomFunc);
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        name: "q1",
        columns: [
          { name: "col1", cellType: "text" },
          {
            name: "col2",
            cellType: "expression",
            expression: "rowCustomFunc('col1')",
          },
        ],
        rowCount: 2,
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  var rows = question.visibleRows;
  rows[0].cells[0].question.value = "abc";
  assert.equal(
    rows[0].cells[1].question.value,
    "abcabc",
    "Custom function with row property works correctly"
  );
  FunctionFactory.Instance.unregister("rowCustomFunc");
});

QUnit.test(
  "Complete example with totals and expressions: invoice example",
  function(assert) {
    Serializer.addProperty("itemvalue", "price:number");

    var getItemPrice = function(params) {
      var question = !!this.row
        ? this.row.getQuestionByColumnName(params[0])
        : null;
      if (!question) return 0;
      var selItem = question.selectedItem;
      return !!selItem ? selItem.price : 0;
    };
    FunctionFactory.Instance.register("getItemPrice", getItemPrice);
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "id",
              cellType: "expression",
              expression: "{rowIndex}",
            },
            {
              name: "phone_model",
              totalType: "count",
              totalFormat: "Items count: {0}",
              choices: [
                { value: "item1", price: 10 },
                { value: "item2", price: 20 },
              ],
            },
            {
              name: "price",
              cellType: "expression",
              expression: "getItemPrice('phone_model')",
              displayStyle: "currency",
            },
            {
              name: "quantity",
              cellType: "text",
              inputType: "number",
              totalType: "sum",
              totalFormat: "Total phones: {0}",
            },
            {
              name: "total",
              cellType: "expression",
              expression: "{row.quantity} * {row.price}",
              displayStyle: "currency",
              totalType: "sum",
              totalDisplayStyle: "currency",
              totalFormat: "Total: {0}",
            },
          ],
          rowCount: 1,
        },
        {
          name: "vatProcents",
          type: "text",
          defaultValue: 20,
        },
        {
          name: "vatTotal",
          type: "expression",
          expression: "{q1-total.total} * {vatProcents} / 100",
        },
        {
          name: "total",
          type: "expression",
          expression: "{q1-total.total} + {vatTotal}",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");

    var rows = question.visibleRows;
    var visibleTotalRow = question.visibleTotalRow;
    assert.equal(rows[0].cells[2].question.value, 0, "By default price is 0");
    rows[0].cells[1].question.value = "item1";
    assert.equal(rows[0].cells[2].question.value, 10, "Price is ten now");
    rows[0].cells[3].question.value = 5;
    assert.equal(
      rows[0].cells[4].question.value,
      10 * 5,
      "row totals calculated correctly"
    );

    question.addRow();
    assert.equal(rows.length, 2, "There are two rows now");
    rows[1].cells[3].question.value = 3;
    rows[1].cells[1].question.value = "item2";
    assert.equal(
      rows[1].cells[2].question.value,
      20,
      "Price is 20 for second row"
    );
    assert.equal(
      rows[1].cells[4].question.value,
      20 * 3,
      "row totals calculated correctly for the second row"
    );

    var totalRow = question.renderedTable.footerRow;
    assert.equal(totalRow.cells[3].question.value, 8, "5 + 3 items");
    assert.equal(
      totalRow.cells[4].question.value,
      10 * 5 + 20 * 3,
      "total for items"
    );
    var totalWihtVatQuestion = survey.getQuestionByName("total");
    assert.equal(
      totalWihtVatQuestion.value,
      (10 * 5 + 20 * 3) * 1.2,
      "total for items + VAT"
    );

    FunctionFactory.Instance.unregister("getItemPrice");
    Serializer.removeProperty("itemvalue", "price");
  }
);

QUnit.test("Expression with two columns doesn't work, bug#1199", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          {
            name: "bldg",
            title: "Building",
            cellType: "text",
          },
          {
            name: "cont",
            title: "Contents",
            cellType: "text",
          },
          {
            name: "tot",
            title: "Total",
            cellType: "expression",
            expression: "{row.bldg} + {row.cont}",
          },
        ],
        cellType: "text",
        rows: [
          {
            value: "B",
            text: "Budgeted",
          },
          {
            value: "A",
            text: "Actual",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
  question.value = { B: { bldg: 4, cont: 6 } };
  var rows = question.visibleRows;
  var val = question.value;
  assert.equal(val.B.tot, 10, "Expression equals 10");
});

QUnit.test(
  "defaultValue: false doesn't work for boolean column after removing row, bug#1266",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "boolean",
              defaultValue: "false",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var rows = question.visibleRows;
    assert.equal(rows.length, 2, "There are two rows");
    assert.deepEqual(
      question.value,
      [{ col1: false }, { col1: false }],
      "defaultValue set correctly"
    );
    question.removeRow(1);
    rows = question.visibleRows;
    assert.equal(rows.length, 1, "There is one row");
    assert.deepEqual(
      question.value,
      [{ col1: false }],
      "defaultValue is still there for the first row"
    );
  }
);

QUnit.test("Test defaultValueFromLastRow property", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var question = <QuestionMatrixDynamicModel>(
    page.addNewQuestion("matrixdynamic", "question")
  );
  question.rowCount = 0;
  question.cellType = "text";
  question.addColumn("col1");
  question.addColumn("col2");
  question.addColumn("col3");
  question.defaultValueFromLastRow = true;
  question.addRow();
  question.visibleRows;
  assert.equal(question.isEmpty(), true, "It is empty");
  question.value = [{ col1: 1, col2: 2 }];
  question.addRow();
  assert.deepEqual(
    question.value,
    [
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2 },
    ],
    "defaultValueFromLastRow is working"
  );
  question.defaultRowValue = { col1: 11, col3: 3 };
  question.addRow();
  assert.deepEqual(
    question.value,
    [
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2 },
      { col1: 1, col2: 2, col3: 3 },
    ],
    "defaultValueFromLastRow is merging with defaultRowValue"
  );
});

QUnit.test("Text preprocessing with capital questions", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdropdown",
        name: "Q11",
        columns: [
          {
            name: "C11",
          },
        ],
        cellType: "text",
        rows: [
          {
            value: "R11",
            text: "{Q11.R11.C11} -- r11",
          },
        ],
      },
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          {
            name: "c1",
          },
        ],
        cellType: "text",
        rows: [
          {
            value: "r1",
            text: "{Q1.R1.C1} -- r1",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.data = { Q11: { R11: { C11: "val11" } }, q1: { r1: { c1: "val1" } } };
  var q11 = <QuestionMatrixDropdownModel>survey.getQuestionByName("Q11");
  var q1 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
  assert.equal(
    q1.rows[0].locText.renderedHtml,
    "val1 -- r1",
    "lowcase name is fine"
  );
  assert.equal(
    q11.rows[0].locText.renderedHtml,
    "val11 -- r11",
    "uppercase name is fine"
  );
});

QUnit.test(
  "Text preprocessing with dot in question, column and row names",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdropdown",
          name: "q.1",
          columns: [
            {
              name: "c.1",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "r.1",
            },
          ],
        },
        {
          type: "text",
          name: "q1",
          title: "{q.1.r.1.c.1}",
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.data = { "q.1": { "r.1": { "c.1": "val1" } } };
    var q1 = <Question>survey.getQuestionByName("q1");
    assert.equal(q1.locTitle.renderedHtml, "val1", "work with dots fine");
  }
);

QUnit.test(
  "Shared matrix value name, Bug: Bug# https://surveyjs.answerdesk.io/ticket/details/T1322",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          valueName: "shared",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
        {
          type: "matrixdynamic",
          name: "q2",
          valueName: "shared",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    assert.equal(q1.visibleRows.length, 2, "q1 - two rows are by default");
    assert.equal(q2.visibleRows.length, 2, "q2 - two rows are by default");

    var newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q1.value = newValue;
    assert.deepEqual(q1.value, newValue, "set correctly to the first question");
    assert.deepEqual(
      q2.value,
      newValue,
      "shared correctly to the second question"
    );
    var rowsChangedCounter = 0;
    q2.visibleRowsChangedCallback = function() {
      rowsChangedCounter++;
    };
    q1.addRow();
    q1.visibleRows[3].cells[0].value = 4;
    newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }, { col1: 4 }];
    assert.equal(rowsChangedCounter, 1, "q2 rows should be rebuilt");
    assert.deepEqual(
      q2.visibleRows.length,
      4,
      "There are  4 rows in the second question"
    );
    assert.deepEqual(
      q1.value,
      newValue,
      "2. set correctly to the first question"
    );
    assert.deepEqual(
      q2.value,
      newValue,
      "2. shared correctly to the second question"
    );
  }
);

QUnit.test(
  "Copy matrix value on trigger, Bug# https://surveyjs.answerdesk.io/ticket/details/T1322",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
        {
          type: "matrixdynamic",
          name: "q2",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
          ],
        },
      ],
      triggers: [
        {
          type: "copyvalue",
          expression: "{copyValue} = true",
          setToName: "q2",
          fromName: "q1",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    var q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    assert.equal(q1.visibleRows.length, 2, "q1 - two rows are by default");
    assert.equal(q2.visibleRows.length, 2, "q2 - two rows are by default");
    var newValue = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    q1.value = newValue;
    assert.deepEqual(q1.value, newValue, "set correctly to the first question");
    var rowsChangedCounter = 0;
    q2.visibleRowsChangedCallback = function() {
      rowsChangedCounter++;
    };
    survey.setValue("copyValue", true);
    assert.equal(rowsChangedCounter, 1, "q2 rows should be rebuilt");
    assert.deepEqual(
      q2.value,
      newValue,
      "set correctly to the second question on trigger"
    );
  }
);
QUnit.test("columnsVisibleIf produce the bug, Bug#1540", function(assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "matrixdynamic",
            name: "group_clinician_user_attributes",
            title: "Clinician members",
            columnsVisibleIf: "{item} != 'id'",
            columns: [
              {
                name: "id",
                cellType: "text",
              },
              {
                name: "user_id",
                title: "user",
                cellType: "dropdown",
                choices: [
                  {
                    value: "2",
                    text: "Test User 1",
                  },
                  {
                    value: "4",
                    text: "Test User 2",
                  },
                  {
                    value: "6",
                    text: "Test User 3",
                  },
                  {
                    value: "8",
                    text: "Test User 4",
                  },
                  {
                    value: "10",
                    text: "Test User 5",
                  },
                ],
              },
              {
                name: "role",
                cellType: "dropdown",
                visibleIf: "{row.user_id} notempty and {roles} notempty",
                choices: [
                  "PI",
                  "Collaborator",
                  "Co-Investigator",
                  "Technician",
                  "PhD-Student",
                  "Student",
                  "Post-Doc",
                  "Researcher",
                  "MD",
                ],
                optionsCaption: "not specified",
                choicesVisibleIf: "{roles} contains {item}",
              },
            ],
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.data = {
    name: "excepturidd",
    roles: ["Co-Investigator", "Collaborator"],
    acl: [
      {
        group_id: "4",
        actions: ["read"],
      },
    ],
    owner_id: 1,
    group_clinician_user_attributes: [
      {
        id: 61,
        role: "Collaborator",
        user_id: 4,
      },
      {
        id: 63,
        role: null,
        user_id: 8,
      },
    ],
  };
  assert.equal(
    survey.getQuestionByName("group_clinician_user_attributes").name,
    "group_clinician_user_attributes",
    "There is no exception"
  );
});

QUnit.test("column.choicesEnableIf", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          {
            name: "col1",
            cellType: "checkbox",
            choices: [1, 2, 3, 4],
          },
          {
            name: "col2",
            cellType: "dropdown",
            choices: [1, 2, 3, 4],
            choicesEnableIf: "{row.col1} contains {item}",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  var row = matrix.visibleRows[0];
  var col1Q = row.getQuestionByColumnName("col1");
  var col2Q = <QuestionDropdownModel>row.getQuestionByColumnName("col2");
  var col2TemplateQ = matrix.columns[1].templateQuestion;
  assert.equal(
    col2Q.choicesEnableIf,
    "{row.col1} contains {item}",
    "The choicesEnableIf property is set"
  );
  assert.ok(
    col2TemplateQ.loadingOwner,
    "loading owner is set to template question"
  );
  assert.ok(col2Q.loadingOwner, "loading owner is set to question");
  assert.equal(
    col2TemplateQ.isLoadingFromJson,
    false,
    "We are not loading from JSON template question"
  );
  assert.equal(
    col2Q.isLoadingFromJson,
    false,
    "We are not loading from JSON cell question"
  );
  matrix.columns[1].startLoadingFromJson();
  assert.equal(
    col2TemplateQ.isLoadingFromJson,
    true,
    "We are loading from JSON the template question"
  );
  assert.equal(
    col2Q.isLoadingFromJson,
    true,
    "We are loading from JSON the cell question"
  );
  matrix.columns[1].endLoadingFromJson();

  assert.equal(col2Q.choices.length, 4, "There are 4 choices");
  assert.equal(col2Q.choices[0].isEnabled, false, "First choice is disabled");
  assert.equal(col2Q.choices[1].isEnabled, false, "Second choice is disabled");
  col1Q.value = [1, 2];
  assert.equal(col2Q.choices[0].isEnabled, true, "First choice is enabled now");
  assert.equal(
    col2Q.choices[1].isEnabled,
    true,
    "The second choice is enabled now"
  );
  assert.equal(
    col2Q.choices[2].isEnabled,
    false,
    "The third choice is still disabled"
  );
});

QUnit.test(
  "register function on visibleChoices change calls many times, Bug#1622",
  function(assert) {
    var json = {
      questions: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "q1",
              choices: ["1", "2"],
            },
          ],
          rowCount: 2,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var question = matrix.visibleRows[0].cells[0].question;
    var counter = 0;
    question.registerFunctionOnPropertyValueChanged(
      "visibleChoices",
      function() {
        counter++;
      }
    );
    matrix.columns[0].choices = ["1", "2", "3"];
    assert.deepEqual(question.choices.length, 3, "Choices set correctly");
    assert.equal(counter, 1, "There was only one change");
  }
);
QUnit.test(
  "customwidget.readOnlyChangedCallback doesn't work correctly, https://surveyjs.answerdesk.io/ticket/details/T1869",
  function(assert) {
    var isReadOnly = false;
    var isFitValue = false;
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
      name: "customWidget",
      isFit: (question) => {
        var res = question.getType() == "text";
        if (res) {
          isFitValue = true;
          const onReadOnlyChangedCallback = function() {
            isReadOnly = question.isReadOnly;
          };
          question.readOnlyChangedCallback = onReadOnlyChangedCallback;
          onReadOnlyChangedCallback();
        }
        return res;
      },
    });
    var json = {
      elements: [
        {
          type: "dropdown",
          name: "renVer",
          choices: [1, 2],
          defaultValue: 1,
        },
        {
          type: "matrixdynamic",
          name: "m",
          columns: [
            {
              name: "DESC",
              cellType: "text",
              enableIf: "{renVer} = 2",
            },
          ],
          rowCount: 1,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    var rows = matrix.visibleRows;
    assert.equal(rows.length, 1, "rows are created");
    assert.equal(isFitValue, true, "cell text question is a custom widget");
    assert.equal(isReadOnly, true, "cell text question is readonly");
    CustomWidgetCollection.Instance.clear();
  }
);

QUnit.test("Values from invisible rows should be removed, #1644", function(
  assert
) {
  var json = {
    elements: [
      { type: "text", name: "q1" },
      {
        type: "matrixdropdown",
        name: "q2",
        columns: [{ name: "col1" }, { name: "col2" }],
        rows: [{ value: "row1", visibleIf: "{q1} = 1" }, "row2"],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.data = { q1: 2, q2: { row1: "col1", row2: "col2" } };
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q1: 2, q2: { row2: "col2" } },
    "Remove value for invisible row"
  );
});

QUnit.test("matrix.hasTotal property", function(assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  assert.equal(matrix.hasTotal, false, "There is no total");
  matrix.columns[0].totalType = "sum";
  assert.equal(matrix.hasTotal, true, "There is total now, totalType");
  matrix.columns[0].totalType = "none";
  assert.equal(matrix.hasTotal, false, "There is no total again");
  matrix.columns[0].totalExpression = "sumInArray({q1}, 'col1')";
  assert.equal(matrix.hasTotal, true, "There is total, total expression");
});

QUnit.test("Test matrix.totalValue, expression question", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var matrix = new QuestionMatrixDropdownModel("q1");
  page.addElement(matrix);
  matrix.addColumn("col1");
  matrix.addColumn("col2");
  matrix.addColumn("col3");
  matrix.columns[0].totalType = "sum";
  matrix.columns[1].totalType = "sum";
  matrix.columns[2].totalExpression = "{row.col1} + {row.col2}";
  matrix.value = [
    { col1: 1, col2: 10 },
    { col1: 2, col2: 20 },
    {},
    { col1: 4, col2: 40 },
  ];
  var row = matrix.visibleTotalRow;
  assert.ok(row, "Total row is not empty");
  assert.equal(row.cells.length, 3, "There are three cells here");
  var question = row.cells[0].question;
  assert.equal(
    question.getType(),
    "expression",
    "We can have only expression type cells in total"
  );
  assert.equal(
    question.expression,
    "sumInArray({self}, 'col1')",
    "Set expression correctly"
  );
  assert.equal(question.value, 1 + 2 + 4, "Calculated correctly");
  assert.equal(
    row.cells[1].value,
    10 + 20 + 40,
    "Calculated correctly, the second cell"
  );
  assert.equal(
    row.cells[2].value,
    1 + 2 + 4 + 10 + 20 + 40,
    "Calculated correctly, {row.col1} + {row.col2}"
  );
  assert.deepEqual(
    matrix.totalValue,
    { col1: 7, col2: 70, col3: 77 },
    "Total value calculated correctly"
  );
  assert.deepEqual(
    survey.getValue("q1-total"),
    { col1: 7, col2: 70, col3: 77 },
    "Total value set into survey correctly"
  );
});

QUnit.test("Test totals, different value types", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var matrix = new QuestionMatrixDropdownModel("q1");
  page.addElement(matrix);
  matrix.addColumn("col1");
  matrix.columns[0].totalType = "count";
  var value = [
    { col1: 1, col2: 10 },
    { col1: 2, col2: 20 },
    {},
    { col1: 3, col2: 40 },
  ];
  matrix.value = value;
  var rows = matrix.visibleRows;
  var row = matrix.visibleTotalRow;
  var question = row.cells[0].question;
  assert.equal(question.value, 3, "There are 3 values");
  matrix.columns[0].totalType = "min";
  survey.setValue("q2", 1);
  assert.equal(question.value, 1, "Min is 1");
  matrix.columns[0].totalType = "max";
  survey.setValue("q2", 2);
  assert.equal(question.value, 3, "Max is 3");
  matrix.columns[0].totalType = "avg";
  survey.setValue("q2", 3);
  assert.equal(question.value, 2, "Average is 2");
  matrix.columns[0].totalType = "sum";
  matrix.columns[0].totalFormat = "Sum: {0}";
  matrix.columns[0].totalDisplayStyle = "currency";
  survey.setValue("q2", 4);
  assert.equal(
    question.displayValue,
    "Sum: $6.00",
    "Use total column properties"
  );
});

QUnit.test("Test totals, load from JSON", function(assert) {
  var json = {
    elements: [
      {
        type: "matrixdynamic",
        name: "q1",
        rowCount: 2,
        columns: [
          {
            name: "Column 1",
            totalType: "count",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  var row = matrix.visibleTotalRow;
  var question = row.cells[0].question;
  assert.equal(question.value, 0, "The initial value is zero");
});

QUnit.test(
  "enableIf for new rows, Bug# https://surveyjs.answerdesk.io/ticket/details/T2065",
  function(assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
          ],
          enableIf: "{q} = 'a'",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    assert.equal(
      matrix.visibleRows[0].cells[0].question.isReadOnly,
      true,
      "It is readOnly by default"
    );
    survey.setValue("q", "a");
    assert.equal(
      matrix.visibleRows[0].cells[0].question.isReadOnly,
      false,
      "It is not readOnly now"
    );
    matrix.addRow();
    assert.equal(
      matrix.visibleRows[2].cells[0].question.isReadOnly,
      false,
      "New added row is not readonly"
    );
    survey.clearValue("q");
    assert.equal(
      matrix.visibleRows[0].cells[0].question.isReadOnly,
      true,
      "The first row is readOnly again"
    );
    assert.equal(
      matrix.visibleRows[2].cells[0].question.isReadOnly,
      true,
      "The last row is readOnly"
    );
  }
);

QUnit.test("matrix dropdown + renderedTable.headerRow", function(assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rows = ["row1", "row2", "row3"];
  assert.equal(matrix.renderedTable.showHeader, true, "Header is shown");
  var cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "rows + 2 column");
  assert.equal(cells[0].hasTitle, false, "header rows, nothing to render");
  assert.equal(cells[0].minWidth, "", "minWidth is empty for row header");
  assert.equal(cells[0].width, "", "width is empty for row header");
  assert.equal(cells[1].hasTitle, true, "col1");
  assert.equal(cells[1].hasQuestion, false, "no question");
  assert.equal(cells[1].minWidth, "", "col1.minWidth");
  assert.notOk(cells[1].isRemoveRow, "do not have remove row");
  assert.equal(cells[1].locTitle.renderedHtml, "col1", "col1");
  assert.equal(cells[2].locTitle.renderedHtml, "col2", "col2");
  assert.equal(cells[2].minWidth, "100px", "col2.minWidth");

  matrix.rowTitleWidth = "400px";
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells[0].width, "400px", "col1 width get from rowTitleWidth");

  matrix.showHeader = false;
  assert.equal(matrix.renderedTable.showHeader, false, "Header is not shown");
  assert.notOk(!!matrix.renderedTable.headerRow, "Header row is null");

  //Test case for #2346 - set width to <td> in first row if header is hidden
  var firstRow = matrix.renderedTable.rows[0];
  assert.equal(
    firstRow.cells[2].minWidth,
    "100px",
    "Header is hidden: col2.minWidth"
  );
  assert.equal(
    firstRow.cells[0].width,
    "400px",
    "Header is hidden: col1 width get from rowTitleWidth"
  );

  matrix.columnLayout = "vertical";
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "row1", "row1");
  assert.equal(cells[2].locTitle.renderedHtml, "row3", "row1");

  matrix.showHeader = true;
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 4, "3 rows + columns");
  assert.equal(cells[0].hasTitle, false, "empty for header");
  assert.equal(cells[1].locTitle.renderedHtml, "row1", "row1");
  assert.equal(cells[3].locTitle.renderedHtml, "row3", "row1");
});

QUnit.test("matrix dynamic + renderedTable.headerRow", function(assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;
  assert.equal(matrix.renderedTable.showHeader, true, "Header is shown");
  var cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "2 column + remove row");
  assert.equal(cells[0].hasTitle, true, "col1");
  assert.equal(cells[0].hasQuestion, false, "no question");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1");
  assert.notOk(cells[0].isRemoveRow, "do not have remove row");
  assert.equal(cells[1].locTitle.renderedHtml, "col2", "col2");
  assert.equal(cells[2].hasTitle, false, "remove row");
  matrix.minRowCount = 3;
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 2, "2 column");
  assert.equal(cells[0].hasTitle, true, "col1");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1");
  assert.equal(cells[1].locTitle.renderedHtml, "col2", "col2");
  matrix.addRow();
  cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "2 column + removeRow");
  matrix.showHeader = false;
  assert.equal(matrix.renderedTable.showHeader, false, "Header is not shown");
  assert.notOk(!!matrix.renderedTable.headerRow, "Header row is null");

  matrix.columnLayout = "vertical";
  assert.equal(
    matrix.renderedTable.showHeader,
    false,
    "Header is not shown, columnLayout is vertical"
  );
  matrix.showHeader = true;
  assert.equal(
    matrix.renderedTable.showHeader,
    false,
    "Header is not shown, columnLayout is still vertical"
  );
});

QUnit.test("matrix dropdown + renderedTable.rows", function(assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rows = ["row1", "row2", "row3"];
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "There are 3 rows");
  var cells = rows[0].cells;
  assert.equal(cells.length, 3, "rows + 2 column");
  assert.equal(cells[0].hasTitle, true, "header rows");
  assert.equal(cells[0].locTitle.renderedHtml, "row1", "row1");
  assert.equal(cells[1].hasTitle, false, "col1");
  assert.equal(cells[1].hasQuestion, true, "col1 question");
  assert.equal(cells[1].question.getType(), "text", "col1.cellType");
  assert.notOk(cells[1].isRemoveRow, "col1 do not have remove row");

  assert.equal(cells[2].hasTitle, false, "col2");
  assert.equal(cells[2].hasQuestion, true, "col2 question");
  assert.equal(cells[2].question.getType(), "dropdown", "col2.cellType");
  assert.notOk(cells[2].isRemoveRow, "col1 do not have remove row");

  cells = rows[2].cells;
  assert.equal(cells[0].locTitle.renderedHtml, "row3", "row3");
  assert.equal(cells[1].question.getType(), "text", "col1.cellType");
  assert.equal(cells[2].question.getType(), "dropdown", "col2.cellType");

  matrix.columnLayout = "vertical";
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "2 columns");
  cells = rows[0].cells;
  assert.equal(cells.length, 4, "column + 3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1 title");
  assert.equal(cells[0].hasQuestion, false, "col1 title, no question");
  assert.equal(cells[1].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[1].cell.column.name, "col1", "row1.col1 correct column");
  assert.equal(cells[3].question.getType(), "text", "row3.col1 cellType-text");
  assert.equal(cells[3].cell.column.name, "col1", "row3.col1 correct column");
  cells = rows[1].cells;
  assert.equal(cells[0].locTitle.renderedHtml, "col2", "col2 title");
  assert.equal(
    cells[1].question.getType(),
    "dropdown",
    "row1.col2 cellType-text"
  );
  assert.equal(cells[1].cell.column.name, "col2", "row1.col2 correct column");
  assert.equal(
    cells[3].question.getType(),
    "dropdown",
    "row3.col2 cellType-text"
  );
  assert.equal(cells[3].cell.column.name, "col2", "row3.col2 correct column");
});

QUnit.test("matrix dynamic + renderedTable.rows", function(assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "There are 3 rows");
  var cells = rows[0].cells;
  assert.equal(cells.length, 3, "2 column + remove");
  assert.equal(cells[0].hasTitle, false, "col1");
  assert.equal(cells[0].hasQuestion, true, "col1 question");
  assert.equal(cells[0].question.getType(), "text", "col1.cellType");
  assert.notOk(
    cells[0].isActionsCell,
    "col1 do not have remove row (in actions cell)"
  );
  assert.ok(cells[0].row, "col1 has row property set");

  assert.equal(cells[1].hasTitle, false, "col2");
  assert.equal(cells[1].hasQuestion, true, "col2 question");
  assert.equal(cells[1].question.getType(), "dropdown", "col2.cellType");
  assert.notOk(
    cells[1].isActionsCell,
    "col2 do not have remove row (in actions cell)"
  );

  assert.equal(cells[2].hasTitle, false, "remove row");
  assert.equal(cells[2].hasQuestion, false, "col2 question");
  assert.equal(cells[2].isActionsCell, true, "is Remove row (in actions cell)");
  assert.ok(!!cells[2].row, "is Remove has row property");

  cells = rows[2].cells;
  assert.equal(cells[0].question.getType(), "text", "col1.cellType");
  assert.equal(cells[1].question.getType(), "dropdown", "col2.cellType");
  assert.equal(cells[2].isActionsCell, true, "is Remove row (in actions cell)");

  matrix.minRowCount = 3;
  cells = matrix.renderedTable.rows[0].cells;
  assert.equal(cells.length, 2, "2 columns only");
  matrix.minRowCount = 2;
  cells = matrix.renderedTable.rows[0].cells;
  assert.equal(cells.length, 3, "2 columns + remove again");

  matrix.columnLayout = "vertical";
  rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "2 columns + remove");
  cells = rows[0].cells;
  assert.equal(cells.length, 4, "column + 3 rows");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1 title");
  assert.equal(cells[0].hasQuestion, false, "col1 title, no question");
  assert.equal(cells[1].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[1].cell.column.name, "col1", "row1.col1 correct column");
  assert.ok(cells[1].row, "col1 has row property set");
  assert.equal(cells[3].question.getType(), "text", "row3.col1 cellType-text");
  assert.equal(cells[3].cell.column.name, "col1", "row3.col1 correct column");
  cells = rows[1].cells;
  assert.equal(cells[0].locTitle.renderedHtml, "col2", "col2 title");
  assert.equal(
    cells[1].question.getType(),
    "dropdown",
    "row1.col2 cellType-text"
  );
  assert.equal(cells[1].cell.column.name, "col2", "row1.col2 correct column");
  assert.equal(
    cells[3].question.getType(),
    "dropdown",
    "row3.col2 cellType-text"
  );
  assert.equal(cells[3].cell.column.name, "col2", "row3.col2 correct column");

  cells = rows[2].cells;
  assert.equal(cells.length, 4, "column + 3 rows");
  assert.equal(cells[0].hasTitle, false, "for column header");
  assert.notOk(cells[0].isActionsCell, "not a remove button (in actions cell)");
  assert.equal(
    cells[1].isActionsCell,
    true,
    "row1: it is a remove row (in actions cell)"
  );
  assert.ok(cells[1].row, "row1: it has a row");
  assert.equal(
    cells[3].isActionsCell,
    true,
    "row3: it is a remove row (in actions cell)"
  );
  assert.ok(cells[3].row, "row3: it has a row");

  matrix.minRowCount = 3;
  rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "2 columns");

  matrix.showHeader = false;
  cells = matrix.renderedTable.rows[0].cells;
  assert.equal(cells.length, 3, "3 rows");
  assert.equal(cells[0].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[2].question.getType(), "text", "row3.col1 cellType-text");
});

QUnit.test("matrix dropdown + renderedTable + totals", function(assert) {
  var matrix = new QuestionMatrixDropdownModel("q1");
  matrix.totalText = "ABC:";
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.columns[0].totalType = "count";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rows = ["row1", "row2", "row3"];

  assert.equal(matrix.renderedTable.showFooter, true, "Footer is shown");
  assert.ok(matrix.renderedTable.footerRow, "Footer row exists");
  matrix.columns[0].totalType = "none";

  assert.equal(matrix.renderedTable.showFooter, false, "Footer is not shown");
  assert.notOk(matrix.renderedTable.footerRow, "Footer row not exists");

  matrix.columns[0].totalType = "count";
  matrix.columnLayout = "vertical";
  assert.equal(
    matrix.renderedTable.showFooter,
    false,
    "Footer is not shown, columnLayout is vertical"
  );
  assert.notOk(
    matrix.renderedTable.footerRow,
    "Footer row not exists, columnLayout is vertical"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells[4].locTitle.renderedHtml,
    "ABC:",
    "total text"
  );
  matrix.columnLayout = "horizontal";
  assert.equal(
    matrix.renderedTable.showFooter,
    true,
    "Footer is not shown again"
  );
  assert.ok(matrix.renderedTable.footerRow, "Footer row exists");

  var cells = matrix.renderedTable.footerRow.cells;
  assert.equal(cells.length, 3, "rowHeader + 2 columns");
  assert.equal(cells[0].hasTitle, true, "header rows");
  assert.equal(cells[0].locTitle.renderedHtml, "ABC:", "footer rows");
  assert.equal(cells[0].hasQuestion, false, "footer rows, no question");
  assert.equal(cells[1].hasTitle, false, "total, not title");
  assert.equal(
    cells[1].question.getType(),
    "expression",
    "total, it is expression"
  );
  assert.equal(cells[2].hasTitle, false, "total, not title");
  assert.equal(
    cells[2].question.getType(),
    "expression",
    "total, it is expression"
  );

  matrix.columnLayout = "vertical";
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "2 columns");
  cells = rows[0].cells;
  assert.equal(cells.length, 5, "column + 3 rows + total");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "col1 title");
  assert.equal(cells[0].hasQuestion, false, "col1 title, no question");
  assert.equal(cells[1].question.getType(), "text", "row1.col1 cellType-text");
  assert.equal(cells[1].cell.column.name, "col1", "row1.col1 correct column");
  assert.equal(cells[3].question.getType(), "text", "row3.col1 cellType-text");
  assert.equal(cells[3].cell.column.name, "col1", "row3.col1 correct column");
  assert.equal(cells[4].question.getType(), "expression", "total, question");
  assert.equal(cells[4].hasTitle, false, "total, no title");
});

QUnit.test("matrix dynamic + renderedTable + totals", function(assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.columns[0].totalType = "count";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;

  var cells = matrix.renderedTable.headerRow.cells;
  assert.equal(cells.length, 3, "2 columns + total");
  assert.equal(cells[0].hasTitle, true, "header, col1");
  assert.equal(cells[0].locTitle.renderedHtml, "col1", "header, col1");
  assert.equal(cells[1].locTitle.renderedHtml, "col2", "header, col2");
  assert.equal(cells[2].hasTitle, false, "header total, there is no title");

  matrix.columnLayout = "vertical";
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "2 columns + remove");
  cells = rows[2].cells;
  assert.equal(cells.length, 5, "column + 3 rows + total");
  assert.equal(cells[0].hasTitle, false, "for column header");
  assert.notOk(cells[0].isActionsCell, "not a remove button (in actions cell)");
  assert.equal(
    cells[1].isActionsCell,
    true,
    "row1: it is a remove row (in actions cell)"
  );
  assert.ok(cells[1].row, "row1: it has a row");
  assert.equal(
    cells[3].isActionsCell,
    true,
    "row3: it is a remove row (in actions cell)"
  );
  assert.ok(cells[3].row, "row3: it has a row");
  assert.equal(cells[4].hasTitle, false, "for total");
});

QUnit.test("matrix dynamic + renderedTable + add/remove rows", function(
  assert
) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.columns[0].cellType = "text";
  matrix.columns[0].totalType = "count";
  matrix.addColumn("col2");
  matrix.columns[1].minWidth = "100px";
  matrix.rowCount = 3;

  assert.equal(matrix.renderedTable.rows.length, 3, "There are 3 rows");
  var firstRowId = matrix.renderedTable.rows[0].id;
  var thirdRowId = matrix.renderedTable.rows[2].id;
  matrix.addRow();
  assert.equal(matrix.renderedTable.rows.length, 4, "There are 4 rows");
  assert.equal(
    matrix.renderedTable.rows[0].id,
    firstRowId,
    "Do not recreate row1 Id"
  );
  assert.equal(
    matrix.renderedTable.rows[2].id,
    thirdRowId,
    "Do not recreate row3 Id"
  );
  matrix.removeRow(1);
  assert.equal(
    matrix.renderedTable.rows.length,
    3,
    "There are 3 rows after remove"
  );
  assert.equal(
    matrix.renderedTable.rows[0].id,
    firstRowId,
    "Do not recreate row1 Id on remove"
  );
  assert.equal(
    matrix.renderedTable.rows[1].id,
    thirdRowId,
    "Do not recreate row3 Id on remove"
  );
});
QUnit.test("matrix dynamic + renderedTable + remove buttons", function(assert) {
  var matrix = new QuestionMatrixDynamicModel("q1");
  matrix.addColumn("col1");
  matrix.rowCount = 0;

  assert.equal(matrix.renderedTable.rows.length, 0, "There are no rows");
  matrix.addRow();
  matrix.addRow();
  matrix.addRow();
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 3, "There are 3 rows");
  assert.equal(rows[0].cells.length, 2, "column + delete button");
  assert.equal(
    rows[0].cells[1].isActionsCell,
    true,
    "it is an action cell, row0"
  );
  assert.equal(
    rows[1].cells[1].isActionsCell,
    true,
    "it is an action cell, row1"
  );
  assert.equal(
    rows[2].cells[1].isActionsCell,
    true,
    "it is an action cell, row2"
  );
});

QUnit.test(
  "matrix dynamic + renderedTable + optionsCaption and columnColCount",
  function(assert) {
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.addColumn("col3");
    matrix.addColumn("col4");
    matrix.columns[1].cellType = "radiogroup";
    matrix.columns[2].optionsCaption = "col2 options";
    matrix.columns[3].cellType = "radiogroup";
    matrix.columns[3].colCount = 2;
    matrix.rowCount = 3;

    assert.equal(matrix.renderedTable.rows.length, 3, "There are 3 rows");
    matrix.optionsCaption = "My Caption";
    assert.equal(
      matrix.renderedTable.rows[0].cells[0].question["optionsCaption"],
      "My Caption",
      "options caption get from matrix"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[2].question["optionsCaption"],
      "col2 options",
      "options caption get from column"
    );
    matrix.columnColCount = 3;
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].question["colCount"],
      3,
      "question col count get from matrix"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[3].question["colCount"],
      2,
      "question col count get from column"
    );
  }
);

QUnit.test("matrix.rowsVisibleIf + renderedTable", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionMatrixDropdownModel("bestCar");
  qBestCar.addColumn("col1");
  qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.rowsVisibleIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(
    qBestCar.renderedTable.rows.length,
    0,
    "cars are not selected yet"
  );
  qCars.value = ["BMW"];
  assert.equal(qBestCar.renderedTable.rows.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.renderedTable.rows.length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.renderedTable.rows.length, 4, "there is no filter");
});
QUnit.test(
  "Matrixdynamic column.visibleIf, hide column if all cells are invisible + rendered table",
  function(assert) {
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 2,
          columns: [
            { name: "col1", totalType: "count" },
            { name: "col2", choices: [1, 2], visibleIf: "{q2}=1" },
            { name: "col3", visibleIf: "{row.col1} = 1" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var table = matrix.renderedTable;
    assert.equal(
      table.headerRow.cells.length,
      2,
      "Header: There is one visible column + Remove button"
    );
    assert.equal(
      table.rows[0].cells.length,
      2,
      "Rows: There is one visible column + Remove button"
    );
    assert.equal(
      table.footerRow.cells.length,
      2,
      "Footer: There is one visible column + Remove button"
    );
    matrix.columnLayout = "vertical";
    var rows = matrix.renderedTable.rows;
    assert.equal(rows.length, 2, "Only one column is shown + remove button");
  }
);

QUnit.test(
  "Matrix validation in cells and async functions in expression",
  function(assert) {
    var returnResult: (res: any) => void;
    function asyncFunc(params: any): any {
      returnResult = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    var question = new QuestionMatrixDynamicModel("q1");
    question.rowCount = 1;
    var column = question.addColumn("col1");
    column.validators.push(new ExpressionValidator("asyncFunc() = 1"));
    var rows = question.visibleRows;
    question.hasErrors();
    var onCompletedAsyncValidatorsCounter = 0;
    question.onCompletedAsyncValidators = (hasErrors: boolean) => {
      onCompletedAsyncValidatorsCounter++;
    };
    assert.equal(
      question.isRunningValidators,
      true,
      "We have one running validator"
    );
    assert.equal(
      onCompletedAsyncValidatorsCounter,
      0,
      "onCompletedAsyncValidators is not called yet"
    );
    returnResult(1);
    assert.equal(question.isRunningValidators, false, "We are fine now");
    assert.equal(
      onCompletedAsyncValidatorsCounter,
      1,
      "onCompletedAsyncValidators is called"
    );

    FunctionFactory.Instance.unregister("asyncFunc");
  }
);

QUnit.test(
  "onValueChanged doesn't called on adding new row with calculated column, #1845",
  function(assert) {
    var rowCount = 0;
    function newIndexFor(params) {
      if (!params[0]) {
        rowCount++;
      }
      return params[0] || rowCount;
    }
    FunctionFactory.Instance.register("newIndexFor", newIndexFor);
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          name: "foo",
          columns: [
            {
              name: "bar",
              cellType: "text",
            },
            {
              name: "id",
              cellType: "expression",
              expression: "newIndexFor({row.id})",
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getQuestionByName("foo");
    var visibleRows = question.visibleRows;
    var counter = 0;
    survey.onValueChanged.add(function(sender, options) {
      counter++;
    });
    question.addRow();
    assert.equal(counter, 1, "onValueChanged has been called");
  }
);
QUnit.test("survey.onMatrixAllowRemoveRow", function(assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "q1",
        rowCount: 3,
        columns: ["1", "2"],
      },
    ],
  });
  survey.onMatrixAllowRemoveRow.add(function(sender, options) {
    options.allow = options.rowIndex % 2 == 0;
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  assert.equal(matrix.canRemoveRows, true, "The row can be removed");
  var table = matrix.renderedTable;
  assert.equal(
    table.rows[0].cells[2].isActionsCell,
    true,
    "The first row can be removed (in actions cell)"
  );
  assert.equal(
    table.rows[1].cells[2].isActionsCell,
    false,
    "The second row can't be removed (in actions cell)"
  );
  assert.equal(
    table.rows[2].cells[2].isActionsCell,
    true,
    "The third row can be removed (in actions cell)"
  );
});

QUnit.test("column is requriedText, Bug #2297", function(assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "q1",
        rowCount: 2,
        columns: [{ name: "1", isRequired: true }, { name: "2" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  var table = matrix.renderedTable;
  assert.equal(
    table.headerRow.cells[0].requiredText,
    "*",
    "required Text is here"
  );
  assert.notOk(table.headerRow.cells[1].requiredText, "required Text is empty");
  matrix.columnsLocation = "vertical";
  table = matrix.renderedTable;
  assert.equal(
    table.rows[0].cells[0].requiredText,
    "*",
    "The first cell in the row is a column header now"
  );
});

QUnit.test(
  "two shared matrixdynamic - should be no errors, Bug #T3121 (https://surveyjs.answerdesk.io/ticket/details/T3121)",
  function(assert) {
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          name: "employer_names",
          valueName: "qualita",
          isRequired: true,
          columns: [
            {
              name: "name",
              cellType: "text",
              isRequired: true,
            },
          ],
          rowCount: 4,
          minRowCount: 4,
          maxRowCount: 4,
        },
        {
          type: "radiogroup",
          name: "qualitypriority",
          choices: [
            {
              value: "0",
              text: "{qualita[0].name}",
            },
            {
              value: "1",
              text: "{qualita[1].name}",
            },
            {
              value: "2",
              text: "{qualita[2].name}",
            },
            {
              value: "3",
              text: "{qualita[3].name}",
            },
          ],
        },
        {
          type: "paneldynamic",
          name: "arrray_qualita",
          valueName: "qualita",
          templateElements: [
            {
              type: "radiogroup",
              name: "competenza",
              choices: [
                {
                  value: "0",
                },
                {
                  value: "1",
                },
                {
                  value: "2",
                },
                {
                  value: "3",
                },
              ],
            },
          ],
        },
      ],
    });
    var test_qualita = [
      { name: "Leadership", competenza: "3" },
      { name: "Team working", competenza: "2" },
      { name: "Iniziativa", competenza: "1" },
      { name: "Autonomia", competenza: "2" },
    ];
    survey.setValue("qualita", test_qualita);
    var matrixDynamic = survey.getQuestionByName("employer_names");
    assert.deepEqual(matrixDynamic.value, test_qualita, "Value set correctly");
  }
);

QUnit.test(
  "Totals in row using total in matrix, Bug #T3162 (https://surveyjs.answerdesk.io/ticket/details/T3162)",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "paid",
            },
            {
              name: "free",
            },
            {
              name: "total",
              totalType: "sum",
              cellType: "expression",
              expression: "{row.free} + {row.paid}",
            },
            {
              name: "percentage",
              cellType: "expression",
              expression: "({row.free} + {row.paid}) / {totalRow.total}",
            },
          ],
          cellType: "text",
          rows: [
            {
              value: "international",
            },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>(
      survey.getQuestionByName("matrix")
    );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = 100;
    rows[0].cells[1].value = 100;
    assert.equal(rows[0].cells[2].value, 200, "cell1 + cell2");
    assert.equal(rows[0].cells[3].value, 1, "(cell1 + cell2)/total");
  }
);

QUnit.test(
  "The row numbers is incorrect after setting the value: survey.data, Bug #1958",
  function(assert) {
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          name: "teachersRate",
          cellType: "radiogroup",
          rowCount: 0,
          choices: [
            {
              value: 1,
            },
            {
              value: 0,
            },
            {
              value: -1,
            },
          ],
          columns: [
            {
              name: "subject",
              cellType: "dropdown",
              choices: [1, 2, 3],
            },
            {
              name: "explains",
            },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("teachersRate")
    );
    survey.data = {
      teachersRate: [
        { subject: 1, explains: 0 },
        { subject: 2, explains: 1 },
      ],
    };

    survey.data = { teachersRate: [{ subject: 1, explains: 0 }] };
    var rows = matrix.visibleRows;
    assert.equal(rows.length, 1, "we reset the number of rows to 1.");

    matrix.addRow();
    matrix.addRow();
    survey.data = { teachersRate: [{ subject: 1, explains: 0 }] };
    rows = matrix.visibleRows;
    assert.equal(rows.length, 1, "we reset the number of rows to 1 again.");
  }
);

QUnit.test(
  "Change question in rendered cell on changing column type, Bug https://github.com/surveyjs/survey-creator/issues/690",
  function(assert) {
    var survey = new SurveyModel({
      questions: [
        {
          type: "matrixdynamic",
          name: "teachersRate",
          rowCount: 1,
          choices: [1, 2],
          columns: [
            {
              name: "subject",
            },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("teachersRate")
    );

    assert.equal(
      matrix.renderedTable.rows[0].cells[0].question.getType(),
      "dropdown",
      "Default cell type"
    );

    matrix.columns[0].cellType = "radiogroup";
    assert.equal(
      matrix.renderedTable.rows[0].cells[0].question.getType(),
      "radiogroup",
      "Cell type should be changed"
    );
  }
);

QUnit.test(
  "Column.totalformat property doesn't changed on changing survey locale",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          isRequired: true,
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
              totalFormat: {
                default: "Total column 1: {0}",
                de: "Total Spalt 1: {0}",
                fr: "Total colonne 1: {0}",
              },
              inputType: "number",
            },
          ],
          rows: [
            {
              value: "one",
              text: {
                default: "One",
                fr: " Un",
                de: " Ein",
              },
            },
          ],
        },
      ],
    });
    survey.setValue("matrix", { one: { col1: 10 } });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.footerRow.cells.length,
      2,
      "There are two cells in the footer row"
    );
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total column 1: 10",
      "total for en locale is correct"
    );
    survey.locale = "de";
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total Spalt 1: 10",
      "total for de locale is correct"
    );
    survey.locale = "fr";
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total colonne 1: 10",
      "total for fr locale is correct"
    );
    survey.locale = "";
    assert.equal(
      <QuestionExpressionModel>(
        matrix.renderedTable.footerRow.cells[1].question.displayValue
      ),
      "Total column 1: 10",
      "total for en locale again is correct"
    );
  }
);

QUnit.test(
  "Changing rows in matrix dropdown doesn't update the table",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(matrix.renderedTable.rows.length, 2, "There are two rows");
    matrix.rows.push(new ItemValue("row2"));
    assert.equal(
      matrix.renderedTable.rows.length,
      3,
      "There are three rows now"
    );
    matrix.rows.splice(0, 1);
    assert.equal(
      matrix.renderedTable.rows.length,
      2,
      "There are two rows again"
    );
  }
);
QUnit.test("showInMultipleColumns property", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          {
            name: "col1",
            cellType: "text",
            totalType: "sum",
          },
          {
            name: "col2",
            cellType: "checkbox",
            choices: ["1", "2", "3"],
          },
          {
            name: "col3",
            cellType: "comment",
          },
        ],
        rows: ["row1", "row2"],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    1 + 3,
    "header: row value + 3 columns"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells.length,
    1 + 3,
    "first row: row value + 3 columns"
  );
  assert.equal(
    matrix.renderedTable.footerRow.cells.length,
    1 + 3,
    "footer: row value + 3 columns"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml,
    "col2",
    "Column header"
  );
  matrix.columns[1].showInMultipleColumns = true;
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    1 + 2 + 3,
    "header: row value + 2 columns + showInMultipleColumns column"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells.length,
    1 + 2 + 3,
    "first row: row value + 2 columns + showInMultipleColumns column"
  );
  assert.equal(
    matrix.renderedTable.footerRow.cells.length,
    1 + 2 + 3,
    "footer:  row value + 2 columns + showInMultipleColumns column"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml,
    "1",
    "Column header, first choice"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].isCheckbox,
    true,
    "first row, first choice: it is checkbox"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].isChoice,
    true,
    "first row, first choice: isChoice"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].choiceValue,
    "1",
    "first row, first choice: choiceValue = 1"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[1].showErrorOnTop,
    true,
    "first row, text question: showErrorOnTop"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[1].showErrorOnBottom,
    false,
    "first row, text question: showErrorOnBottom"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].showErrorOnTop,
    true,
    "first row, first choice: showErrorOnTop"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[2].showErrorOnBottom,
    false,
    "first row, first choice: showErrorOnBottom"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[3].showErrorOnTop,
    false,
    "first row, second choice: showErrorOnTop"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[3].showErrorOnBottom,
    false,
    "first row, second choice: showErrorOnBottom"
  );
  assert.equal(
    matrix.renderedTable.footerRow.cells[2].isChoice,
    false,
    "footer cell:  isChoice should be false"
  );
});
QUnit.test(
  "showInMultipleColumns property + columnLayout = 'vertical'",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columnLayout: "vertical",
          columns: [
            {
              name: "col1",
              cellType: "text",
              totalType: "sum",
            },
            {
              name: "col2",
              cellType: "radiogroup",
              showInMultipleColumns: true,
              choices: ["1", "2", "3"],
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 1,
      "header: column header + 2 rows + total"
    );
    assert.equal(
      matrix.renderedTable.rows.length,
      2 + 3,
      "rows.length = 2 columns + showInMultipleColumns column"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[0].locTitle.renderedHtml,
      "1",
      "header for showInMultipleColumns column"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].isChoice,
      true,
      "showInMultipleColumns, first choice: isChoice"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].choiceValue,
      "1",
      "showInMultipleColumns, first choice: choiceValue"
    );
    assert.equal(
      matrix.renderedTable.rows[1 + 2].cells[0].locTitle.renderedHtml,
      "3",
      "header for showInMultipleColumns column, third choice"
    );
    assert.equal(
      matrix.renderedTable.rows[1 + 2].cells[1].isChoice,
      true,
      "showInMultipleColumns, third choice: isChoice"
    );
    assert.equal(
      matrix.renderedTable.rows[1 + 2].cells[1].choiceValue,
      "3",
      "showInMultipleColumns, third choice: choiceValue"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, update on visibleChoices change",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
            {
              name: "col2",
              cellType: "checkbox",
              showInMultipleColumns: true,
              choices: ["1", "2", "3"],
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 3,
      "header: row value + 3 columns"
    );
    matrix.columns[1].choices.push(new ItemValue(4));
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 4,
      "header: row value + 4 columns"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, using default choices and cellType",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
            {
              name: "col2",
              cellType: "radiogroup",
              showInMultipleColumns: true,
            },
            {
              name: "col3",
              cellType: "comment",
            },
          ],
          rows: ["row1", "row2"],
          choices: ["1", "2", "3"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 2 + 3,
      "header: row value + 3 columns"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, using default choices and cellType",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          cellType: "text",
          columns: [
            {
              name: "col1",
            },
            {
              name: "col2",
            },
            {
              name: "col3",
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    var rows = matrix.visibleRows;
    matrix.addRow();
    matrix.setRowValue(1, { col1: "1", col2: 2, col3: "3" });
    rows = matrix.visibleRows;
    assert.equal(rows.length, 2, "There are two rows");
    assert.equal(
      rows[1].getQuestionByColumnName("col1").value,
      "1",
      "Set the value correctly"
    );
  }
);

QUnit.test(
  "showInMultipleColumns property, using default choices and cellType, Bug #2151",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "Column 1",
            },
            {
              name: "Column 2",
            },
            {
              name: "Column 3",
              totalType: "sum",
            },
            {
              name: "Column 4",
              cellType: "boolean",
            },
          ],
          choices: [1, 2, 3, 4, 5],
          cellType: "text",
          rows: ["Row 1", "Row 2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

    assert.equal(matrix.renderedTable.rows.length, 2, "There are two rows");
    assert.equal(
      matrix.renderedTable.footerRow.cells[3].question.value,
      0,
      "Summary is 0"
    );
    var totalBoolQuestion = matrix.renderedTable.footerRow.cells[4].question;
    assert.equal(
      totalBoolQuestion.value,
      null,
      "There is no question value for boolean column"
    );
    assert.equal(
      totalBoolQuestion.getType(),
      "expression",
      "Total question for boolean column is expression"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, columnLayout: 'vertical' and other is empty value, Bug #2200",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columnLayout: "vertical",
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              hasOther: true,
              showInMultipleColumns: true,
              choices: [1, 2],
            },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(matrix.columns[0].choices.length, 2, "There are two choices");
    assert.equal(
      matrix.columns[0].templateQuestion.choices.length,
      2,
      "There are two choices in question"
    );
    assert.equal(
      matrix.columns[0].templateQuestion.visibleChoices.length,
      3,
      "There are two visible choices in question + hasOther"
    );
    assert.equal(
      matrix.renderedTable.rows.length,
      3,
      "There are two choices + other"
    );
    matrix.value = { row1: { col1: "other" } };
    assert.equal(matrix.hasErrors(), true, "There is error");
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].isChoice,
      true,
      "The first cell is checkbox"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].isChoice,
      true,
      "The third cell is checkbox"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].isFirstChoice,
      true,
      "The first cell is firstchoice"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].isFirstChoice,
      false,
      "The third cell is not firstchoice"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].choiceIndex,
      2,
      "The third cell choiceIndex is not 0"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].showErrorOnTop,
      true,
      "Show errors for the first cell"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].showErrorOnTop,
      false,
      "Do not show errors for the second cell"
    );
    assert.equal(
      matrix.renderedTable.rows[2].cells[1].showErrorOnTop,
      false,
      "Do not show errors for the third cell"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, and enabledIf in item, Bug #2926",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showInMultipleColumns: true,
            },
          ],
          choices: [
            { value: 1, enableIf: "{row.col1}<>1" },
            { value: 2, enableIf: "{row.col1}=1" },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: { col1: 1 }, row2: { col1: 2 } };
    assert.equal(matrix.renderedTable.rows.length, 2, "There are two rows");
    assert.equal(
      matrix.renderedTable.rows[0].cells.length,
      3,
      "There are two cells and one row name"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].item.isEnabled,
      false,
      "cell[0, 0] is disabled"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[2].item.isEnabled,
      true,
      "cell[0, 1] is enabled"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].item.isEnabled,
      true,
      "cell[1, 0] is enabled"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[2].item.isEnabled,
      false,
      "cell[1, 1] is disabled"
    );
    matrix.value = { row1: { col1: 2 }, row2: { col1: 2 } };
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].item.isEnabled,
      true,
      "cell[0, 0] is disabled, #2"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[2].item.isEnabled,
      false,
      "cell[0, 1] is enabled, #2"
    );
  }
);
QUnit.test(
  "showInMultipleColumns property, columnLayout: 'vertical'  and enabledIf in item, Bug #2926",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columnLayout: "vertical",
          columns: [
            {
              name: "col1",
              cellType: "radiogroup",
              showInMultipleColumns: true,
            },
          ],
          choices: [
            { value: 1, enableIf: "{row.col1}<>1" },
            { value: 2, enableIf: "{row.col1}=1" },
          ],
          rows: ["row1", "row2"],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: { col1: 1 }, row2: { col1: 2 } };
    assert.equal(matrix.renderedTable.rows.length, 2, "There are two rows");
    assert.equal(
      matrix.renderedTable.rows[0].cells.length,
      3,
      "There are two cells and one row name"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].item.isEnabled,
      false,
      "cell[0, 0] is disabled"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].item.isEnabled,
      true,
      "cell[1, 0] is enabled"
    );
    assert.equal(
      matrix.renderedTable.rows[0].cells[2].item.isEnabled,
      true,
      "cell[0, 1] is enabled"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[2].item.isEnabled,
      false,
      "cell[1, 1] is disabled"
    );
    matrix.value = { row1: { col1: 2 }, row2: { col1: 2 } };
    assert.equal(
      matrix.renderedTable.rows[0].cells[1].item.isEnabled,
      true,
      "cell[0, 0] is disabled, #2"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[1].item.isEnabled,
      false,
      "cell[1, 0] is enabled, #2"
    );
  }
);

QUnit.test(
  "Filter choices on value change in the next column, Bug #2182",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "column1",
              cellType: "text",
            },
            {
              name: "column2",
              choices: [
                { value: "A", visibleIf: "{row.column1} = 1" },
                { value: "B", visibleIf: "{row.column1} = 2" },
                { value: "C", visibleIf: "{row.column1} = 2" },
              ],
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    var q1 = rows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>rows[0].cells[1].question;
    assert.equal(q2.visibleChoices.length, 0, "There is no visible choices");
    q1.value = 1;
    assert.equal(q2.visibleChoices.length, 1, "There is 'A' item");
    q1.value = 2;
    assert.equal(q2.visibleChoices.length, 2, "There is 'B' and 'C' items");
  }
);
QUnit.test(
  "Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, multipletext",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          columns: [
            {
              name: "Column 1",
              isRequired: true,
            },
            {
              name: "Column 2",
              isRequired: true,
            },
          ],
        },
      ],
      checkErrorsMode: "onValueChanged",
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("question1")
    );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = 1;
    assert.equal(
      rows[0].cells[1].question.errors.length,
      0,
      "There is no errors yet in the cell, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      0,
      "There is no errors yet in the cell, second row, first column"
    );
    survey.completeLastPage();
    assert.equal(
      rows[0].cells[1].question.errors.length,
      1,
      "There is error in the cell, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "There is error in the cell, second row, first column"
    );
    rows[0].cells[0].value = 2;
    assert.equal(
      rows[0].cells[1].question.errors.length,
      1,
      "The error in the cell is not fixed, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "The error in the cell is not fixed, first column"
    );
    rows[0].cells[1].value = 1;
    assert.equal(
      rows[0].cells[1].question.errors.length,
      0,
      "The error in the cell is gone, first row, second column"
    );
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "The error in the cell is not fixed, first column, #2"
    );
    rows[1].cells[0].value = 1;
    assert.equal(
      rows[1].cells[0].question.errors.length,
      0,
      "The error in the cell is gone, first column, #2"
    );
  }
);
QUnit.test("Survey.checkErrorsMode=onValueChanging", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "question1",
        rowCount: 2,
        columns: [
          {
            name: "col1",
            cellType: "text",
            validators: [{ type: "emailvalidator" }],
          },
          {
            name: "col2",
            cellType: "text",
          },
        ],
      },
    ],
    checkErrorsMode: "onValueChanging",
  });
  var matrix = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("question1")
  );
  var rows = matrix.visibleRows;
  rows[0].cells[0].value = "val";
  assert.equal(
    rows[0].cells[0].question.errors.length,
    1,
    "There is error, e-mail is incorrect"
  );
  assert.equal(
    rows[0].cells[1].question.errors.length,
    0,
    "There is no errors yet in the cell, first row, second column"
  );
  assert.equal(
    rows[1].cells[0].question.errors.length,
    0,
    "There is no errors yet in the cell, second row, first column"
  );
  assert.notOk(matrix.value, "do not set value to matrix");
  assert.deepEqual(survey.data, {}, "do not set value into survey");
  rows[0].cells[0].value = "a@a.com";
  assert.deepEqual(
    matrix.value,
    [{ col1: "a@a.com" }, {}],
    "set value to matrix"
  );
  assert.deepEqual(
    survey.data,
    { question1: [{ col1: "a@a.com" }, {}] },
    "set value into survey"
  );
});

QUnit.test(
  "Survey.checkErrorsMode=onValueChanging and column.isUnique",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          rowCount: 2,
          columns: [
            {
              name: "col1",
              cellType: "text",
              isUnique: true,
            },
            {
              name: "col2",
              cellType: "text",
            },
          ],
        },
      ],
      checkErrorsMode: "onValueChanging",
    });
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("question1")
    );
    var rows = matrix.visibleRows;
    rows[0].cells[0].value = "val1";
    assert.equal(
      rows[0].cells[0].question.errors.length,
      0,
      "There is no error"
    );
    assert.deepEqual(matrix.value, [{ col1: "val1" }, {}]);
    rows[1].cells[0].value = "val1";
    assert.equal(
      rows[1].cells[0].question.errors.length,
      1,
      "There is a duplication error, second row, first column"
    );
    assert.deepEqual(matrix.value, [{ col1: "val1" }, {}]);
    rows[1].cells[0].value = "val2";
    assert.equal(
      rows[1].cells[0].question.errors.length,
      0,
      "There is no errors yet in the cell, second row, first column"
    );
  }
);

QUnit.test("column should call property changed on custom property", function(
  assert
) {
  Serializer.addProperty("text", "prop1");
  var matrix = new QuestionMatrixDynamicModel("q1");
  var column = matrix.addColumn("col1");
  column.cellType = "text";
  var counter = 0;
  column.registerFunctionOnPropertyValueChanged("prop1", () => {
    counter++;
  });
  column["prop1"] = 3;
  assert.equal(column.templateQuestion["prop1"], 3, "Property is set");
  assert.equal(counter, 1, "Notification is called");
  Serializer.removeProperty("text", "prop1");
});
QUnit.test("getProgressInfo", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [
          {
            name: "col1",
            isRequired: true,
          },
          {
            name: "col2",
          },
          {
            name: "col3",
            visibleIf: "{row.col2} notempty",
          },
        ],
      },
    ],
  });
  survey.data = { matrix: [{ col1: "1" }, { col2: "2" }, []] };
  var question = survey.getQuestionByName("matrix");
  assert.deepEqual(question.getProgressInfo(), {
    questionCount: 9 - 2,
    answeredQuestionCount: 2,
    requiredQuestionCount: 3,
    requiredAnsweredQuestionCount: 1,
  });
});

QUnit.test(
  "Change item value in column/templateQuestion and change it in row questions",
  function(assert) {
    var matrix = new QuestionMatrixDynamicModel("q1");
    var column = matrix.addColumn("col1");
    column.cellType = "checkbox";
    column.templateQuestion.choices.push(new ItemValue("item1"));
    column.templateQuestion.choices.push(new ItemValue("item2"));
    var cellQuestion = matrix.visibleRows[0].cells[0].question;
    assert.equal(cellQuestion.choices.length, 2, "There are two choices");
    assert.equal(
      cellQuestion.choices[0].value,
      "item1",
      "Value is correct, choice1"
    );
    assert.equal(
      cellQuestion.choices[1].value,
      "item2",
      "Value is correct, choice2"
    );
    column.templateQuestion.choices.push(new ItemValue("item3"));
    assert.equal(cellQuestion.choices.length, 3, "There are three choices");
    assert.equal(
      cellQuestion.choices[2].value,
      "item3",
      "Value is correct, choice3"
    );
    column.templateQuestion.choices[0].value = "newItem1";
    assert.equal(
      cellQuestion.choices[0].value,
      "newItem1",
      "Value is correct, updated, choice1"
    );
    column.templateQuestion.choices[2].text = "Item3 text";
    assert.equal(
      cellQuestion.choices[2].text,
      "Item3 text",
      "Text is correct, updated, choice3"
    );
  }
);

QUnit.test("isAnswered on setitting from survey.setValue(), Bug#2399", function(
  assert
) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "matrixdynamic",
            name: "HospitalAdmissions_Table",
            columns: [
              {
                name: "TreatmentProcedure",
                cellType: "text",
                width: "20",
              },
              {
                name: "Hospital",
                cellType: "text",
                width: "20",
              },
              {
                name: "Year",
                cellType: "dropdown",
              },
            ],
            choices: ["2020", "2019"],
            rowCount: 1,
          },
        ],
      },
    ],
  });
  var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  survey.setValue("HospitalAdmissions_Table", [
    {
      TreatmentProcedure: "A",
      Hospital: "B",
      Year: "2020",
    },
  ]);
  assert.equal(question.visibleRows.length, 1, "There is one row");
  assert.equal(question.isAnswered, true, "matrix is answered");
});
QUnit.test(
  "Use survey.storeOthersAsComment in matrix, cellType = dropdown",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2, 3],
              hasOther: true,
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var cellQuestion = <QuestionDropdownModel>(
      question.visibleRows[0].cells[0].question
    );
    assert.equal(
      cellQuestion.getType(),
      "dropdown",
      "Cell question was created correctly"
    );
    cellQuestion.value = cellQuestion.otherItem.value;
    cellQuestion.comment = "My Comment";
    assert.deepEqual(
      question.value,
      [{ col1: "other", "col1-Comment": "My Comment" }],
      "Has comment"
    );
    question.value = [{ col1: 1 }];
    assert.equal(cellQuestion.value, 1, "value sets correctly into cell");
    assert.equal(
      cellQuestion.comment,
      "",
      "comment clears correctly in cell question"
    );
    question.value = [{ col1: "other", "col1-Comment": "New Comment" }];
    assert.equal(
      cellQuestion.value,
      "other",
      "value other sets correctly into cell"
    );
    assert.equal(
      cellQuestion.comment,
      "New Comment",
      "comment sets correctly into cell question"
    );
    question.value = [{ col1: 1 }];
    question.value = [{ col1: "NotInList" }];
    assert.equal(
      cellQuestion.value,
      "other",
      "value other sets correctly into cell using NotInList"
    );
    assert.equal(
      cellQuestion.comment,
      "NotInList",
      "comment sets correctly into cell question using NotInList"
    );
  }
);
QUnit.test(
  "Use survey.storeOthersAsComment in matrix, cellType = checkbox",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3],
              hasOther: true,
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var cellQuestion = <QuestionCheckboxModel>(
      question.visibleRows[0].cells[0].question
    );
    assert.equal(
      cellQuestion.getType(),
      "checkbox",
      "Cell question was created correctly"
    );
    cellQuestion.value = [1, cellQuestion.otherItem.value];
    cellQuestion.comment = "My Comment";
    assert.deepEqual(
      question.value,
      [{ col1: [1, "other"], "col1-Comment": "My Comment" }],
      "Has comment"
    );
    question.value = [{ col1: [1] }];
    assert.deepEqual(cellQuestion.value, [1], "value sets correctly into cell");
    assert.equal(
      cellQuestion.comment,
      "",
      "comment clears correctly in cell question"
    );
    question.value = [{ col1: [1, "other"], "col1-Comment": "New Comment" }];
    assert.deepEqual(
      cellQuestion.value,
      [1, "other"],
      "value other sets correctly into cell"
    );
    assert.equal(
      cellQuestion.comment,
      "New Comment",
      "comment sets correctly into cell question"
    );
    question.value = [{ col1: [1] }];
    question.value = [{ col1: [1, "NotInList"] }];
    assert.deepEqual(
      cellQuestion.value,
      [1, "other"],
      "value other sets correctly into cell using NotInList"
    );
    assert.equal(
      cellQuestion.comment,
      "NotInList",
      "comment sets correctly into cell question using NotInList"
    );
  }
);
QUnit.test(
  "Use survey.storeOthersAsComment = false in matrix, cellType = checkbox",
  function(assert) {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "checkbox",
              choices: [1, 2, 3],
              hasOther: true,
            },
          ],
          rowCount: 1,
        },
      ],
    });
    var question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var cellQuestion = <QuestionCheckboxModel>(
      question.visibleRows[0].cells[0].question
    );
    assert.equal(
      cellQuestion.getType(),
      "checkbox",
      "Cell question was created correctly"
    );
    cellQuestion.value = [1, cellQuestion.otherItem.value];
    cellQuestion.comment = "My Comment";
    assert.deepEqual(
      question.value,
      [{ col1: [1, "My Comment"] }],
      "Has comment in value"
    );
    question.value = [{ col1: [1] }];
    assert.deepEqual(cellQuestion.value, [1], "value sets correctly into cell");
    assert.equal(
      cellQuestion.comment,
      "",
      "comment clears correctly in cell question"
    );
    question.value = [{ col1: [1, "New Comment"] }];
    assert.deepEqual(
      cellQuestion.value,
      [1, "New Comment"],
      "value other sets correctly into cell"
    );
    assert.equal(
      cellQuestion.comment,
      "New Comment",
      "comment sets correctly into cell question"
    );
    question.value = [{ col1: [1] }];
    question.value = [{ col1: [1, "NotInList"] }];
    assert.deepEqual(
      cellQuestion.value,
      [1, "NotInList"],
      "value other sets correctly into cell using NotInList"
    );
    assert.equal(
      cellQuestion.comment,
      "NotInList",
      "comment sets correctly into cell question using NotInList"
    );
  }
);
QUnit.test(
  "Use survey.storeOthersAsComment in matrix, cellType = dropdown, set comment from survey",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              choices: [1, 2, 3],
              hasOther: true,
            },
          ],
        },
      ],
    });
    survey.data = {
      q1: [{ col1: 1 }, { col1: "other", "col1-Comment": "a comment" }],
    };
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    assert.equal(
      matrix.visibleRows[1].cells[0].question.comment,
      "a comment",
      "The comment set correctly"
    );
  }
);

QUnit.test("Detail panel, get/set values", function(assert) {
  var survey = new SurveyModel({});
  survey.css = {
    matrixdynamic: { detailIcon: "icon1", detailIconExpanded: "icon2" },
  };
  survey.addNewPage("p1");
  var matrix = new QuestionMatrixDynamicModel("q1");
  survey.pages[0].addQuestion(matrix);
  var column = matrix.addColumn("col1");
  column.cellType = "text";
  matrix.detailPanel.addNewQuestion("text", "q2");
  matrix.value = [
    { col1: "r1v1", q2: "r1v2" },
    { col1: "r2v1", q2: "r2v2" },
  ];
  assert.equal(matrix.detailPanelMode, "none", "Default value");
  assert.equal(matrix.visibleRows[0].hasPanel, false, "There is no panel here");
  assert.equal(matrix.visibleRows[0].detailPanel, null, "Panel is not created");
  matrix.detailPanelMode = "underRow";
  assert.equal(
    matrix.visibleRows[0].hasPanel,
    true,
    "The panel has been created"
  );
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    false,
    "detail panel is not showing"
  );
  assert.equal(
    matrix.visibleRows[0].detailPanel,
    null,
    "Panel is not created, it is hidden"
  );
  assert.equal(
    matrix.getDetailPanelIconCss(matrix.visibleRows[0]),
    "icon1",
    "detail button is closed"
  );
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    true,
    "detail panel is showing"
  );
  assert.ok(matrix.visibleRows[0].detailPanel, "Detail Panel is created");
  assert.equal(
    matrix.getDetailPanelIconCss(matrix.visibleRows[0]),
    "icon1 icon2",
    "detail button is opened"
  );
  assert.equal(
    matrix.visibleRows[0].detailPanel.questions.length,
    1,
    "There is one question here"
  );
  assert.equal(
    matrix.visibleRows[0].detailPanel.questions[0].value,
    "r1v2",
    "The value is set correctly"
  );
  matrix.visibleRows[0].detailPanel.questions[0].value = "r1v2_changed";
  assert.deepEqual(
    matrix.value,
    [
      { col1: "r1v1", q2: "r1v2_changed" },
      { col1: "r2v1", q2: "r2v2" },
    ],
    "matrix value changed from detail panel"
  );
  matrix.value = [
    { col1: "r1v1", q2: "r1v2_changed_2" },
    { col1: "r2v1", q2: "r2v2_changed" },
  ];
  assert.equal(
    matrix.visibleRows[0].detailPanel.questions[0].value,
    "r1v2_changed_2",
    "The value in detail panel changed correctly from outside"
  );
  matrix.visibleRows[0].hideDetailPanel();
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    false,
    "detail panel is closed"
  );
  assert.equal(
    matrix.getDetailPanelIconCss(matrix.visibleRows[0]),
    "icon1",
    "detail button is closed again"
  );
});
QUnit.test("Detail panel in matrix dropdown, get/set values", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        detailPanelMode: "underRow",
        detailElements: [{ type: "text", name: "q1" }],
        rows: ["row1", "row2"],
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "text", name: "col2" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
  assert.equal(matrix.visibleRows[0].hasPanel, true, "Panel is here");
  assert.equal(matrix.visibleRows[0].detailPanel, null, "Panel is not created");
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    false,
    "detail panel is not showing"
  );
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    true,
    "detail panel is showing"
  );
  assert.ok(matrix.visibleRows[0].detailPanel, "Detail Panel is created");
  matrix.visibleRows[0].detailPanel.getQuestionByName("q1").value = 1;
  assert.deepEqual(
    survey.data,
    { matrix: { row1: { q1: 1 } } },
    "Survey data set correctly"
  );
  survey.data = { matrix: { row1: { q1: 2 }, row2: { col1: 1, q1: 3 } } };
  assert.equal(
    matrix.visibleRows[0].detailPanel.getQuestionByName("q1").value,
    2,
    "The value set from the survey correctly into opened detail panel question"
  );
  matrix.visibleRows[1].showDetailPanel();
  assert.equal(
    matrix.visibleRows[1].detailPanel.getQuestionByName("q1").value,
    3,
    "The value set from the survey correctly into closed detail panel question"
  );
});
QUnit.test(
  "Detail panel column and detail Panel have the same names, get/set values",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "q1" }],
          rows: ["row1", "row2"],
          columns: [{ cellType: "text", name: "q1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>(
      survey.getQuestionByName("matrix")
    );
    var row = matrix.visibleRows[0];
    row.showDetailPanel();
    row.getQuestionByColumnName("q1").value = "val1";
    assert.equal(
      row.getQuestionByColumnName("q1").value,
      "val1",
      "Value is changed in row, #1"
    );
    assert.equal(
      row.detailPanel.getQuestionByName("q1").value,
      "val1",
      "Value is changed in detail, #1"
    );
    row.detailPanel.getQuestionByName("q1").value = "val2";
    assert.equal(
      row.getQuestionByColumnName("q1").value,
      "val2",
      "Value is changed in row, #2"
    );
    assert.equal(
      row.detailPanel.getQuestionByName("q1").value,
      "val2",
      "Value is changed in detail, #2"
    );
    row.getQuestionByColumnName("q1").value = "val3";
    assert.equal(
      row.getQuestionByColumnName("q1").value,
      "val3",
      "Value is changed in row, #3"
    );
    assert.equal(
      row.detailPanel.getQuestionByName("q1").value,
      "val3",
      "Value is changed in detail, #3"
    );
  }
);

QUnit.test("Detail panel, run conditions", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        detailPanelMode: "underRow",
        columns: [{ name: "col1" }, { name: "col2" }],
        detailElements: [
          { type: "text", name: "q1", visibleIf: "{question1} = 'val1'" },
          { type: "text", name: "q2", visibleIf: "{row.col1} = 'val2'" },
          { type: "text", name: "q3", visibleIf: "{row.q2} = 'val3'" },
          { type: "text", name: "q4", visibleIf: "{question1} != 'val1'" },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  assert.equal(
    matrix.detailPanelMode,
    "underRow",
    "detail panel mode load correctly"
  );
  assert.equal(
    matrix.detailElements.length,
    4,
    "detail elements loads correctly"
  );
  matrix.visibleRows[0].showDetailPanel();
  assert.ok(matrix.visibleRows[0].detailPanel, "Detail Panel is created");
  var panel = matrix.visibleRows[0].detailPanel;
  assert.equal(
    panel.questions[0].isVisible,
    false,
    "first question is invisible"
  );
  assert.equal(
    panel.questions[1].isVisible,
    false,
    "second question is invisible"
  );
  assert.equal(
    panel.questions[2].isVisible,
    false,
    "third question is invisible"
  );
  assert.equal(
    panel.questions[3].isVisible,
    true,
    "fourth question is invisible"
  );
  survey.setValue("question1", "val1");
  assert.equal(
    panel.questions[0].isVisible,
    true,
    "first question is visible now"
  );
  assert.equal(
    panel.questions[3].isVisible,
    false,
    "fourth question is invisible now"
  );
  matrix.visibleRows[0].cells[0].question.value = "val2";
  assert.equal(
    panel.questions[1].isVisible,
    true,
    "second question is visible now"
  );
  panel.getQuestionByName("q2").value = "val3";
  assert.equal(
    panel.questions[2].isVisible,
    true,
    "third question is visible now"
  );
});
QUnit.test("Detail panel, rendered table", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        detailPanelMode: "underRow",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        detailElements: [{ type: "text", name: "q1" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  var rows = matrix.renderedTable.rows;
  assert.equal(rows.length, 2, "There are two rows in rendering table");
  assert.equal(
    rows[0].cells.length,
    5,
    "detail cell + 3 columns + delete button"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    5,
    "Header has for detail button space two"
  );
  assert.equal(
    rows[0].cells[0].isActionsCell,
    true,
    "it is a detail cell (in actions cell)"
  );
  var lastrowId = rows[1].id;
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(rows.length, 3, "detail row is added");
  assert.equal(
    matrix.renderedTable.rows[2].id,
    lastrowId,
    "We use the same rows"
  );
  assert.equal(
    rows[1].cells.length,
    3,
    "There are only 3 cells in detail panel row"
  );
  assert.equal(
    rows[1].cells[0].colSpans,
    1,
    "the first cell in detail panel has one colspan"
  );
  assert.equal(
    rows[1].cells[0].isEmpty,
    true,
    "the first cell in detail panel is empty"
  );
  assert.equal(
    rows[1].cells[1].colSpans,
    3,
    "colSpans set correctly for detail panel cell"
  );
  assert.equal(
    rows[1].cells[2].colSpans,
    1,
    "the last cell in detail panel has one colspan"
  );
  assert.equal(
    rows[1].cells[2].isEmpty,
    true,
    "the last cell in detail panel is empty"
  );
  matrix.addRow();
  assert.equal(rows.length, 4, "We added a new row");
  matrix.removeRow(1);
  assert.equal(rows.length, 3, "We removed one row");
  assert.equal(rows[1].isDetailRow, true, "We removed correct row");
  matrix.removeRow(0);
  assert.equal(rows.length, 1, "We removed data and detail panel row");
  assert.equal(rows[0].isDetailRow, false, "We removed correct row");
});
QUnit.test("Detail panel, create elements in code", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        detailPanelMode: "underRow",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  matrix.onHasDetailPanelCallback = (
    row: MatrixDropdownRowModelBase
  ): boolean => {
    return true;
  };
  var createThirdQuestion = false;
  matrix.onCreateDetailPanelCallback = (
    row: MatrixDropdownRowModelBase,
    panel: PanelModel
  ) => {
    panel.addNewQuestion("text", "q1");
    panel.addNewQuestion("text", "q2");
    if (createThirdQuestion) {
      panel.addNewQuestion("text", "q3");
    }
  };
  assert.equal(matrix.visibleRows[0].hasPanel, true, "There is a panel");
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(
    matrix.visibleRows[0].detailPanel.questions.length,
    2,
    "There are two questions"
  );
  matrix.visibleRows[0].hideDetailPanel();
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(
    matrix.visibleRows[0].detailPanel.questions.length,
    2,
    "There are still two questions"
  );
  createThirdQuestion = true;
  matrix.visibleRows[0].hideDetailPanel(true);
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(
    matrix.visibleRows[0].detailPanel.questions.length,
    3,
    "We have 3 questions now"
  );
});
QUnit.test("Detail panel, detailPanelShowOnAdding property", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        detailPanelMode: "underRow",
        detailPanelShowOnAdding: true,
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        detailElements: [{ type: "text", name: "q1" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  assert.equal(matrix.detailPanelShowOnAdding, true, "load property correctly");
  assert.equal(
    matrix.visibleRows[1].isDetailPanelShowing,
    false,
    "We show detail panels collapsed"
  );
  matrix.addRow();
  assert.equal(
    matrix.visibleRows[2].isDetailPanelShowing,
    true,
    "Show detail panel on adding row"
  );
  matrix.detailPanelShowOnAdding = false;
  matrix.addRow();
  assert.equal(
    matrix.visibleRows[3].isDetailPanelShowing,
    false,
    "Do not show detail panel on adding row"
  );
});
QUnit.test("Do not clear all rows if minRowCount is set", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "q1",
        columns: [
          {
            name: "col1",
            cellType: "dropdown",
            choices: [1, 2, 3],
          },
        ],
        rowCount: 1,
        minRowCount: 1,
      },
    ],
  });
  survey.data = {
    q1: [{ col1: 1 }, { col1: 2 }],
  };
  var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  assert.equal(matrix.rowCount, 2, "There are two rows");
  survey.clear();
  assert.equal(matrix.rowCount, 1, "We should have one row");
});
QUnit.test("Detail panel in designer", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
      },
    ],
  });
  survey.setDesignMode(true);
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  assert.equal(
    matrix.visibleRows.length,
    2,
    "There are two visible rows by default"
  );
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    false,
    "We do not have detail row"
  );
  matrix.detailPanelMode = "underRow";
  assert.equal(
    matrix.visibleRows[0].isDetailPanelShowing,
    true,
    "We show the first detail panel now"
  );
  assert.equal(
    matrix.visibleRows[1].isDetailPanelShowing,
    false,
    "We do not show detail panel for the second row"
  );
  assert.equal(
    matrix.visibleRows[1].hasPanel,
    true,
    "Second row still has panel"
  );
  assert.equal(
    matrix.visibleRows[0].detailPanel.id,
    matrix.detailPanel.id,
    "We use matrix detail panel in designer"
  );
  assert.equal(
    matrix.detailPanel.isDesignMode,
    true,
    "detail panel in design mode"
  );
});
QUnit.test("Detail panel, show errors in panels", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        detailPanelMode: "underRow",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        detailElements: [{ type: "text", name: "q1", isRequired: true }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  var rows = matrix.visibleRows;
  rows[0].showDetailPanel();
  assert.equal(
    matrix.hasErrors(true),
    true,
    "There is an error in the first row"
  );
  rows[0].detailPanel.getQuestionByName("q1").value = "val1";
  assert.equal(
    matrix.hasErrors(true),
    true,
    "There is an error in the second row"
  );
  assert.equal(
    rows[1].isDetailPanelShowing,
    true,
    "We show the detail panel in the second row"
  );
  rows[1].detailPanel.getQuestionByName("q1").value = "val2";
  assert.equal(matrix.hasErrors(true), false, "There is no errors anymore");
});
QUnit.test("Detail panel, underRowSingle", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 3,
        detailPanelMode: "underRowSingle",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        detailElements: [{ type: "text", name: "q1", isRequired: true }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  var rows = matrix.visibleRows;
  rows[0].showDetailPanel();
  rows[1].showDetailPanel();
  assert.equal(
    rows[1].isDetailPanelShowing,
    true,
    "Second row shows detail panel"
  );
  assert.equal(
    rows[0].isDetailPanelShowing,
    false,
    "We automatically hide detail panel in the first row"
  );
});
QUnit.test(
  "Detail panel, show errors in panels and underRowSingle mode, Bug#2530",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          detailPanelMode: "underRowSingle",
          columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
          detailElements: [{ type: "text", name: "q1", isRequired: true }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    assert.equal(
      rows[0].isDetailPanelShowing || rows[1].isDetailPanelShowing,
      false,
      "The the first and second rows are hidden by default"
    );
    assert.equal(
      matrix.hasErrors(true),
      true,
      "There is an error in the first row"
    );
    assert.equal(
      rows[0].isDetailPanelShowing,
      true,
      "We show the detail panel in the first row"
    );
    assert.equal(
      rows[1].isDetailPanelShowing,
      false,
      "We do not show the detail panel in the second row yet"
    );
    rows[0].detailPanel.getQuestionByName("q1").value = "val1";
    assert.equal(
      matrix.hasErrors(true),
      true,
      "There is an error in the second row"
    );
    assert.equal(
      rows[1].isDetailPanelShowing,
      true,
      "We show the detail panel in the second row"
    );
    rows[1].detailPanel.getQuestionByName("q1").value = "val2";
    assert.equal(matrix.hasErrors(true), false, "There is no errors anymore");
  }
);
QUnit.test("Detail panel, rendered table and className", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        detailPanelMode: "underRow",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        detailElements: [{ type: "text", name: "q1" }],
        rows: ["row1", "row2"],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  matrix.visibleRows[0].showDetailPanel();
  assert.equal(
    matrix.renderedTable.headerRow.cells[1].className,
    "sv_matrix_cell_header",
    "Set header cell"
  );
  var rows = matrix.renderedTable.rows;
  assert.equal(
    rows[0].cells[0].className,
    "sv_matrix_cell sv_matrix_cell_actions",
    "Detail button css (in actions cell)"
  );

  assert.equal(
    rows[0].cells[1].className,
    "sv_matrix_cell sv_matrix_cell_detail_rowtext",
    "row text css"
  );
  assert.equal(
    rows[0].cells[2].className,
    "sv_matrix_cell",
    "row question cell css"
  );
  assert.equal(
    rows[1].cells[1].className,
    "sv_matrix_cell_detail_panel",
    "panel cell css"
  );
});

QUnit.test("Detail panel, Process text in titles", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "rootQ" },
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        detailPanelMode: "underRow",
        columns: [{ name: "col1" }, { name: "col2" }, { name: "col3" }],
        detailElements: [
          {
            type: "text",
            name: "q1",
            title:
              "rowIndex:{rowIndex},rootQ:{rootQ},row.col1:{row.col1},row.q2:{row.q2}",
          },
          { type: "text", name: "q2" },
        ],
      },
    ],
  });
  survey.data = {
    rootQ: "rootVal",
    matrix: [{}, { col1: "val1", q2: "valQ2" }],
  };
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

  matrix.visibleRows[1].showDetailPanel();
  var q1 = matrix.visibleRows[1].detailPanel.getQuestionByName("q1");
  assert.equal(
    q1.locTitle.renderedHtml,
    "rowIndex:2,rootQ:rootVal,row.col1:val1,row.q2:valQ2",
    "Text preprocessed correctly"
  );
});

QUnit.test("copyvalue trigger for dropdown matrix cell", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        rows: ["item1", "Item2"],
        columns: [{ name: "c1", cellType: "text" }],
      },
      {
        type: "matrixdropdown",
        name: "q2",
        rows: ["item1", "Item2"],
        columns: [{ name: "c1", cellType: "text" }],
      },
    ],
    triggers: [
      {
        type: "copyvalue",
        expression: "{q1.item1.c1} notempty",
        setToName: "q2.item1.c1",
        fromName: "q1.item1.c1",
      },
      {
        type: "copyvalue",
        expression: "{q1.Item2.c1} notempty",
        setToName: "q2.Item2.c1",
        fromName: "q1.Item2.c1",
      },
    ],
  });
  var q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  var q2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
  q1.visibleRows[0].cells[0].value = "val1";
  q1.visibleRows[1].cells[0].value = "val2";
  assert.equal(
    q2.visibleRows[0].cells[0].value,
    "val1",
    "copy value for item1"
  );
  assert.equal(
    survey.runCondition("{q1.Item2.c1} notempty"),
    true,
    "The expression returns true"
  );
  assert.equal(
    survey.runExpression("{q1.Item2.c1}"),
    "val2",
    "The expression returns val2"
  );
  assert.equal(
    q2.visibleRows[1].cells[0].value,
    "val2",
    "copy value for Item2"
  );
});
QUnit.test(
  "MatrixDynamic, test renderedTable.showTable&showAddRowOnBottom",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 0,
          hideColumnsIfEmpty: true,
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(matrix.renderedTable.showTable, false, "There is no rows");
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      false,
      "Do not show add button"
    );
    matrix.addRow();
    assert.equal(matrix.renderedTable.showTable, true, "There is a row");
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      true,
      "Show add button"
    );
    matrix.removeRow(0);
    assert.equal(
      matrix.renderedTable.showTable,
      false,
      "Matrix is empty again"
    );
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      false,
      "Do not show add button again"
    );
    matrix.hideColumnsIfEmpty = false;
    assert.equal(
      matrix.renderedTable.showTable,
      true,
      "hideColumnsIfEmpty is false"
    );
    survey.setDesignMode(true);
    matrix.hideColumnsIfEmpty = true;
    assert.equal(matrix.renderedTable.showTable, true, "survey in design mode");
  }
);
QUnit.test(
  "MatrixDynamic, Hide/show add row button on changing allowAddRows",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          maxRowCount: 3,
          hideColumnsIfEmpty: true,
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      true,
      "We have a row here"
    );
    matrix.allowAddRows = false;
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      false,
      "We do not allow add rows"
    );
    matrix.allowAddRows = true;
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      true,
      "We have a row here again"
    );
    matrix.addRow();
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      false,
      "max row count is 3"
    );
    matrix.rowCount = 1;
    assert.equal(
      matrix.renderedTable.showAddRowOnBottom,
      true,
      "row count is 1"
    );
  }
);

QUnit.test("Matrixdynamic change column.readOnly property", function(assert) {
  var question = new QuestionMatrixDynamicModel("matrixDynamic");
  question.rowCount = 2;
  question.columns.push(new MatrixDropdownColumn("column1"));
  question.columns[0].readOnly = true;
  assert.equal(
    question.columns[0].templateQuestion.isReadOnly,
    true,
    "set correctly"
  );
});

QUnit.test("Row actions, check onGetMatrixRowActions Event", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: ["row1"],
      },
    ],
  });
  var options;
  var surveyFromEvent;
  survey.onGetMatrixRowActions.add((s, opt) => {
    options = opt;
    surveyFromEvent = s;
  });
  const matrix = survey.getQuestionByName("matrix");
  (<QuestionMatrixDynamicModel>matrix).renderedTable.rows;
  assert.ok(surveyFromEvent == survey);
  assert.ok(options.question == matrix);
  assert.ok(options.row == matrix.visibleRows[0]);
  assert.deepEqual(options.actions, []);
});

QUnit.test("Row actions, check getUpdatedMatrixRowActions", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: ["row1"],
      },
    ],
  });
  var expectedActions = [{ title: "Action 1" }, { title: "Action 2" }];
  survey.onGetMatrixRowActions.add((survey, opt) => {
    opt.actions = expectedActions;
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  var actions = [];
  assert.deepEqual(
    survey.getUpdatedMatrixRowActions(matrix, matrix.visibleRows[0], actions),
    expectedActions
  );
});

QUnit.test("Row actions, drag action", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "matrix",
        choices: [
          {
            value: 1,
            text: "Yes",
          },
          {
            value: 0,
            text: "Sometimes",
          },
          {
            value: -1,
            text: "No",
          },
        ],
        columns: [
          {
            name: "subject",
            cellType: "dropdown",
            title: "Select a subject",
            isRequired: true,
            minWidth: "300px",
            choices: [
              "English: American Literature",
              "English: British and World Literature",
            ],
          },
          {
            name: "explains",
            title: "Clearly explains the objectives",
          },
        ],
        rowCount: 2,
      },
    ],
  });

  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");

  assert.deepEqual(matrix.renderedTable["rowsActions"][0][1].id, "drag-row");

  matrix.allowRowsDragAndDrop = false;
  assert.deepEqual(matrix.renderedTable["rowsActions"][0].length, 1);

  matrix.allowRowsDragAndDrop = true;
  assert.deepEqual(matrix.renderedTable["rowsActions"][0].length, 2);
});

QUnit.test("moveRowByIndex test", function (assert) {
  var matrixD = new QuestionMatrixDynamicModel("q1");
  matrixD.value = [{v1: "v1"}, {v2: "v2"}];
  matrixD["moveRowByIndex"](1, 0);
  assert.deepEqual(matrixD.value, [{v2: "v2"}, {v1: "v1"}]);
});

QUnit.test("Row actions, rendered table and className", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: ["row1"],
      },
    ],
  });
  survey.onGetMatrixRowActions.add((_, opt) => {
    opt.actions = [
      { title: "Action 1" },
      { title: "Action 2", location: "end" },
    ];
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    4,
    "Actions headers should appear"
  );
  var rows = matrix.renderedTable.rows;
  assert.equal(
    rows[0].cells[0].className,
    "sv_matrix_cell sv_matrix_cell_actions",
    "Actions cell css"
  );
  const leftActions = rows[0].cells[0].item.getData().actions;
  assert.ok(leftActions.length === 1, "left actions count: 1");
  assert.ok(
    leftActions[0].title === "Action 1",
    "action 1 in left actions cell"
  );
  assert.ok(
    leftActions[0] instanceof Action,
    "actions in cell are instances of Action"
  );
  assert.equal(rows[0].cells[1].className, "sv_matrix_cell", "text cell");
  assert.equal(rows[0].cells[1].className, "sv_matrix_cell", "ordinary cell");
  assert.equal(
    rows[0].cells[3].className,
    "sv_matrix_cell sv_matrix_cell_actions",
    "Actions cell css"
  );
  const rightActions = rows[0].cells[3].item.getData().actions;
  assert.ok(rightActions.length === 1, "right actions count: 1");
  assert.ok(
    rightActions[0].title === "Action 2",
    "action 2 in right actions cell"
  );
  assert.ok(
    rightActions[0] instanceof Action,
    "actions in cell are instances of Action"
  );
});
QUnit.test("onGetMatrixRowActions should be called 1 time", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1" }],
        rows: ["row1"],
      },
    ],
  });
  var count = 0;
  survey.onGetMatrixRowActions.add((_, opt) => {
    count++;
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  matrix.renderedTable;
  assert.equal(count, 1);
});

QUnit.test(
  "Matrixdynamic change column.question.choices on changing choices in matrix",
  function(assert) {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 2;
    question.choices = ["item1", "item2", "item3"];
    question.addColumn("col1");
    question.addColumn("col2").cellType = "checkbox";
    assert.equal(question.choices.length, 3, "There are 5 choices in matrix");
    var rows = question.visibleRows;
    assert.equal(
      rows[0].cells[0].question.choices.length,
      3,
      "There are 3 items in col1 question "
    );
    assert.equal(
      rows[0].cells[1].question.choices.length,
      3,
      "There are 3 items in col2 question "
    );
    question.choices.push(new ItemValue("item4"));
    rows = question.visibleRows;
    assert.equal(
      rows[0].cells[0].question.choices.length,
      4,
      "There are 4 items in col1 question "
    );
    assert.equal(
      rows[0].cells[1].question.choices.length,
      4,
      "There are 4 items in col2 question "
    );
    question.choices[0].value = "item11";
    question.choices[3].text = "text4";
    rows = question.visibleRows;
    assert.equal(
      rows[0].cells[0].question.choices[0].value,
      "item11",
      "value item in col1 question changed"
    );
    assert.equal(
      rows[0].cells[1].question.choices[0].value,
      "item11",
      "value item in col2 question changed"
    );
    assert.equal(
      rows[0].cells[0].question.choices[3].text,
      "text4",
      "text item in col1 question changed"
    );
    assert.equal(
      rows[0].cells[1].question.choices[3].text,
      "text4",
      "text item in col2 question changed"
    );
  }
);
QUnit.test(
  "survey.onMatrixRowRemoving. Clear the row if it is the last one",
  function(assert) {
    var survey = new SurveyModel();
    var removedRowIndex = -1;
    var visibleRowsCount = -1;
    survey.onMatrixRowRemoving.add(function(survey, options) {
      removedRowIndex = options.rowIndex;
      visibleRowsCount = options.question.visibleRows.length;
      options.allow = options.question.rowCount > 1;
      if (!options.allow) {
        options.row.clearValue();
      }
    });
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
    page.addElement(q1);
    q1.addColumn("col1");
    q1.rowCount = 3;
    q1.value = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
    assert.equal(q1.rowCount, 3, "there are three rows");
    q1.removeRow(1);
    assert.equal(q1.rowCount, 2, "there are two rows");
    assert.equal(
      removedRowIndex,
      1,
      "onMatrixRowRemoved event has been fired correctly"
    );
    assert.equal(
      visibleRowsCount,
      3,
      "There should be three visible rows in event"
    );
    q1.removeRow(1);
    assert.equal(q1.rowCount, 1, "there is one row now");
    assert.deepEqual(q1.value, [{ col1: 1 }], "We have value in the cell");
    q1.removeRow(0);
    assert.equal(q1.rowCount, 1, "We do not allow to remove the row");
    assert.deepEqual(q1.value, [], "We clear value in the row");
  }
);
QUnit.test("Text processing in rows and columns, rendered table", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValue: "value1",
      },
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1", title: "Col:{q1}" }],
        rows: [{ value: "row1", text: "Row:{q1}" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    2,
    "Row column + column"
  );
  assert.equal(
    matrix.renderedTable.headerRow.cells.length,
    2,
    "Row column + column"
  );

  assert.equal(
    matrix.renderedTable.headerRow.cells[1].locTitle.textOrHtml,
    "Col:value1",
    "column text"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[0].locTitle.textOrHtml,
    "Row:value1",
    "row text"
  );
  survey.setValue("q1", "val2");
  assert.equal(
    matrix.renderedTable.headerRow.cells[1].locTitle.textOrHtml,
    "Col:val2",
    "column text, #2"
  );
  assert.equal(
    matrix.renderedTable.rows[0].cells[0].locTitle.textOrHtml,
    "Row:val2",
    "row text, #2"
  );
});
QUnit.test("getDisplayValue() function in matrix dynamic, Bug#", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 2,
        columns: [
          {
            name: "col1",
            title: "Column 1",
            choices: [
              { value: 1, text: "A" },
              { value: 2, text: "B" },
              { value: 3, text: "C" },
            ],
          },
        ],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  matrix.value = [{ col1: 1 }, { col1: 3 }];
  var counter = 0;
  survey.onValueChanged.add((sender, options) => {
    counter++;
  });
  var displayValue = matrix.getDisplayValue(true, [{ col1: 2 }]);
  assert.deepEqual(displayValue, [{ "Column 1": "B" }], "Do not use value");
  assert.deepEqual(
    matrix.value,
    [{ col1: 1 }, { col1: 3 }],
    "Value is still the same"
  );
  assert.equal(counter, 0, "We do not change the value during processing");
});

QUnit.test("getDisplayValue() function in matrix Dropdown, Bug#", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          {
            name: "col1",
            title: "Column 1",
            choices: [
              { value: 1, text: "A" },
              { value: 2, text: "B" },
              { value: 3, text: "C" },
            ],
          },
        ],
        rows: [{ value: "row1", text: "Row 1" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
  matrix.value = { row1: { col1: 1 } };
  var counter = 0;
  survey.onValueChanged.add((sender, options) => {
    counter++;
  });
  var displayValue = matrix.getDisplayValue(true, { row1: { col1: 2 } });
  assert.deepEqual(
    displayValue,
    { "Row 1": { "Column 1": "B" } },
    "Do not use value"
  );
  assert.deepEqual(
    matrix.value,
    { row1: { col1: 1 } },
    "Value is still the same"
  );
  assert.equal(counter, 0, "We do not change the value during processing");
});
QUnit.test(
  "Error on setting properties into column cellType:'text', Bug#2897",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1",
              cellType: "text",
            },
          ],
          rows: [{ value: "row1", text: "Row 1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdownModel>(
      survey.getQuestionByName("matrix")
    );
    var rows = matrix.visibleRows;
    matrix.columns[0].inputType = "date";
    assert.equal(
      rows[0].cells[0].question.inputType,
      "date",
      "Set the property correctly"
    );
  }
);
QUnit.test(
  "MatrixDynamic, test renderedTable column locString on adding new column",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 1,
      "We have one column and delete row"
    );
    assert.equal(
      matrix.renderedTable.headerRow.cells[0].locTitle.renderedHtml,
      "col1",
      "Title rendered from JSON"
    );
    matrix.addColumn("col2");
    assert.equal(
      matrix.renderedTable.headerRow.cells[1].locTitle.renderedHtml,
      "col2",
      "Title rendered from addColumn"
    );
    matrix.columns.push(new MatrixDropdownColumn("col3"));
    assert.equal(
      matrix.renderedTable.headerRow.cells[2].locTitle.renderedHtml,
      "col3",
      "Title rendered from columns.push"
    );
  }
);
QUnit.test(
  "MatrixDynamic, test renderedTable, do not render empty locTitle in header",
  function(assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 1,
      "We have one column and delete row"
    );
    assert.equal(
      matrix.renderedTable.headerRow.cells[0].hasTitle,
      true,
      "column header"
    );
    assert.equal(
      matrix.renderedTable.headerRow.cells[1].hasTitle,
      false,
      "nothing"
    );
    matrix.columnLayout = "vertical";
    assert.equal(
      matrix.renderedTable.rows[0].cells[0].hasTitle,
      true,
      "column header, vertical"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[0].hasTitle,
      false,
      "nothing, vertical"
    );
  }
);
QUnit.test(
  "Focus first visible enabled cell on adding a new row from UI",
  function(assert) {
    var focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function(elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          cellType: "text",
          minRowCount: 1,
          maxRowCount: 2,
          rowCount: 1,
          columns: [
            { name: "col1", visible: false },
            { name: "col2", readOnly: true },
            { name: "col3" },
            { name: "col4" },
          ],
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.addRowUI();
    assert.equal(
      focusedQuestionId,
      matrix.visibleRows[1].cells[2].question.inputId,
      "focus correct value"
    );
    focusedQuestionId = "";
    matrix.addRowUI();
    assert.equal(focusedQuestionId, "", "new row can't be added");
    SurveyElement.FocusElement = oldFunc;
  }
);
