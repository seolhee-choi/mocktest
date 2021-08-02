import { Helpers } from "../src/helpers";
import { EmailValidator } from "../src/validator";
import { SurveyModel } from "../src/survey";
import { ProcessValue } from "../src/conditionProcessValue";
import { Base } from "../src/base";
import { property } from "../src/jsonobject";

export default QUnit.module("Helpers");

QUnit.test("Event hasEvents property", function(assert) {
  assert.ok(Helpers.isArrayContainsEqual([1], [1]), "Arrays are equal");
  assert.notOk(Helpers.isArrayContainsEqual([1], [1, 2]), "Different length");
  assert.notOk(
    Helpers.isArrayContainsEqual([1, 3], [1, 2]),
    "The content of array is not the same"
  );
  assert.ok(
    Helpers.isArrayContainsEqual([2, 1], [1, 2]),
    "The content of array is the same"
  );
  assert.ok(
    Helpers.isArraysEqual([2, 1], [1, 2], true),
    "Ignore Order = true: We believe it is the same arrays"
  );
  assert.notOk(
    Helpers.isArraysEqual([2, 1], [1, 2]),
    "Ignore Order = false: We believe it is not the same arrays"
  );
});
QUnit.test("Helpers.isValueEmpty function", function(assert) {
  assert.equal(Helpers.isValueEmpty(false), false, "false is not empty value");
  assert.equal(Helpers.isValueEmpty(0), false, "0 is not empty value");
  assert.equal(Helpers.isValueEmpty(null), true, "null is empty value");
  assert.equal(Helpers.isValueEmpty(""), true, "empty string is empty value");
  assert.equal(Helpers.isValueEmpty([]), true, "empty array is empty value");
  assert.equal(Helpers.isValueEmpty({}), true, "empty object is empty value");
  assert.equal(
    Helpers.isValueEmpty(new Date()),
    false,
    "date is not empty value"
  );
  assert.equal(
    Helpers.isValueEmpty({ val: "something" }),
    false,
    "the object is not empty"
  );
  assert.equal(
    Helpers.isValueEmpty({ val: false }),
    false,
    "the object is not empty, false"
  );
  assert.equal(
    Helpers.isValueEmpty({ val: "" }),
    true,
    "the object is empty, empty string"
  );
});
QUnit.test("isTwoValueEquals with validators", function(assert) {
  var survey = new SurveyModel();
  var validators1 = [];
  var validator1 = new EmailValidator();
  validator1.errorOwner = survey;
  validator1.text = "en-text";
  validators1.push(validator1);

  var validators2 = [];
  var validator2 = new EmailValidator();
  validator2.errorOwner = survey;
  validator2.text = "en-text";
  validators2.push(validator2);
  survey.locale = "de";
  validator2.text = "de-text";
  assert.equal(
    Helpers.isTwoValueEquals(validators1, validators2),
    false,
    "These two arrays are not equal"
  );
  survey.locale = "";
});

QUnit.test("isTwoValueEquals, undefined", function(assert) {
  assert.equal(
    Helpers.isTwoValueEquals([], undefined),
    true,
    "Empty array equals undefined"
  );

  assert.equal(
    Helpers.isTwoValueEquals(undefined, []),
    true,
    "Undefined equals empty array"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, "undefined"),
    false,
    "undefined vs 'undefined'"
  );
  assert.equal(
    Helpers.isTwoValueEquals("undefined", null),
    false,
    "null vs 'undefined'"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, null),
    true,
    "null vs undefined"
  );
});

QUnit.test("Return correct value for array.length", function(assert) {
  var process = new ProcessValue();
  assert.equal(
    process.getValue("ar.length", { ar: [1, 2] }),
    2,
    "There are two values in array"
  );
  assert.equal(
    process.getValue("ar.length", { ar: [] }),
    0,
    "Return 0 for empty array"
  );
  assert.equal(
    process.getValue("ar.length", { ar: null }),
    0,
    "Return 0 for null value"
  );
  assert.equal(
    process.getValue("ar.length", {}),
    0,
    "Return 0 for undefined array"
  );
  //Test for bug: #1243
  assert.equal(process.getValue("region", {}), null, "Return null string");
  //Test for bug: https://surveyjs.answerdesk.io/ticket/details/t2558
  assert.equal(
    process.getValue("a.b.c.D", { "a.b": 1, "a.b.c.D": 2 }),
    2,
    "Ignore a.b"
  );
});

QUnit.test("isConvertibleToNumber", function(assert) {
  assert.equal(
    Helpers.isConvertibleToNumber("0"),
    true,
    "Zero is convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(0),
    true,
    "Number is convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(null),
    false,
    "null is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(undefined),
    false,
    "undefined is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber("undefined"),
    false,
    "'undefined' is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber([1]),
    false,
    "array is not convertible to number"
  );
  assert.equal(
    Helpers.isConvertibleToNumber(["1"]),
    false,
    "array of string is not convertible to number"
  );
});

QUnit.test("isTwoValueEquals, undefined, null and empty string", function(
  assert
) {
  assert.equal(
    Helpers.isTwoValueEquals(undefined, null),
    true,
    "null and undefined are equals"
  );
  assert.equal(
    Helpers.isTwoValueEquals(undefined, ""),
    true,
    "undefined and empty string are equals"
  );
  assert.equal(
    Helpers.isTwoValueEquals(null, ""),
    true,
    "null and empty string are equals"
  );
});
QUnit.test("isTwoValueEquals, 0 and '0'", function(assert) {
  assert.equal(
    Helpers.isTwoValueEquals(0, "0"),
    true,
    "Zeroes equal as number and text"
  );
  assert.equal(
    Helpers.isTwoValueEquals(0, "0a"),
    false,
    "Zero dosnt' equal '0a'"
  );
  assert.equal(Helpers.isTwoValueEquals(undefined, 0), false, "undefined vs 0");
  assert.equal(
    Helpers.isTwoValueEquals(undefined, "0"),
    false,
    "undefined vs '0'"
  );
  assert.equal(
    Helpers.isTwoValueEquals("undefined", "0"),
    false,
    "'0' vs 'undefined'"
  );
  assert.equal(Helpers.isTwoValueEquals(1, "1"), true, "1 is '1'");
  assert.equal(Helpers.isTwoValueEquals(1.5, "1.5"), true, "1.5 is '1.5'");
  assert.equal(Helpers.isTwoValueEquals(1, "1.5"), false, "1 is not '1.5'");
  assert.equal(Helpers.isTwoValueEquals(2, "1.5"), false, "2 is not '1.5'");
  assert.equal(
    Helpers.isTwoValueEquals(true, "true"),
    true,
    "'true' equals true"
  );
  assert.equal(
    Helpers.isTwoValueEquals(false, "false"),
    true,
    "'false' equals false"
  );
  assert.equal(
    Helpers.isTwoValueEquals("True", true),
    true,
    "'True' equals true"
  );
  assert.equal(
    Helpers.isTwoValueEquals("False", false),
    true,
    "'False' equals false"
  );
});

QUnit.test(
  "isTwoValueEquals, numbers and string + string and string, Bug# 2000",
  function(assert) {
    assert.equal(Helpers.isTwoValueEquals(10, "10"), true, "10 equals '10'");
    assert.equal(Helpers.isTwoValueEquals(10, "010"), true, "10 equals '010'");
    assert.equal(
      Helpers.isTwoValueEquals("10", "010"),
      false,
      "'10' not equals '010'"
    );
  }
);
QUnit.test("isTwoValueEquals, undefined vs 'undefined', Bug# ", function(
  assert
) {
  assert.equal(
    Helpers.isTwoValueEquals(undefined, "undefined"),
    false,
    "undefined not equals 'undefined'"
  );
});
QUnit.test("Helpers.isNumber", function(assert) {
  assert.equal(Helpers.isNumber("1"), true, "1 is a number");
  assert.equal(Helpers.isNumber("0xabcd"), true, "0xabcd is a number");
  assert.equal(Helpers.isNumber("23.3"), true, "23.3 is a number");
  assert.equal(Helpers.isNumber("abcd"), false, "abcd is not a number");
  assert.equal(
    Helpers.isNumber("0xbe0eb53f46cd790cd13851d5eff43d12404d33e8"),
    false,
    "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8 is not a number"
  );
});
QUnit.test("Helpers.getNumberByIndex", function(assert) {
  assert.equal(Helpers.getNumberByIndex(0, "1."), "1.", "0/1.");
  assert.equal(Helpers.getNumberByIndex(2, "1."), "3.", "2/3.");
  assert.equal(Helpers.getNumberByIndex(2, "a)"), "c)", "2/a)");
  assert.equal(Helpers.getNumberByIndex(2, "#1)"), "#3)", "2/#1)");
  assert.equal(Helpers.getNumberByIndex(2, "Q1."), "Q3.", "2/Q1.");
  assert.equal(Helpers.getNumberByIndex(2, "(10)"), "(12)", "2/(10)");
  assert.equal(Helpers.getNumberByIndex(2, "# (a)"), "# (c)", "2/# (a)");
  assert.equal(Helpers.getNumberByIndex(2, "1.2"), "1.4", "2/1.2");
  assert.equal(Helpers.getNumberByIndex(2, "1.2."), "1.4.", "2/1.2.");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11"), "1.2.13", "2/1.2.11");
  assert.equal(Helpers.getNumberByIndex(2, "1.2.11."), "1.2.13.", "2/1.2.11.");
});

class ObjectWithDecoratedProperties extends Base {
  @property({ defaultValue: true }) boolPropertyWithDefault: boolean;
  @property() boolPropertyNoDefault: boolean;
  @property({ defaultValue: "test" }) stringPropertyWithDefault: string;
  @property() stringPropertyNoDefault: string;
}

QUnit.test("boolPropertyWithDefault", function(assert) {
  const instance: ObjectWithDecoratedProperties = new ObjectWithDecoratedProperties();
  assert.equal(instance.boolPropertyNoDefault, undefined);
  assert.equal(instance.boolPropertyWithDefault, true);
  assert.equal(instance.stringPropertyNoDefault, undefined);
  assert.equal(instance.stringPropertyWithDefault, "test");

  instance.boolPropertyNoDefault = false;
  instance.boolPropertyWithDefault = false;
  instance.stringPropertyNoDefault = "no default";
  instance.stringPropertyWithDefault = "";

  assert.equal(instance.boolPropertyNoDefault, false);
  assert.equal(instance.boolPropertyWithDefault, false);
  assert.equal(instance.stringPropertyNoDefault, "no default");
  assert.equal(instance.stringPropertyWithDefault, "");

  instance.boolPropertyNoDefault = null;
  instance.boolPropertyWithDefault = true;
  instance.stringPropertyNoDefault = null;
  instance.stringPropertyWithDefault = "text";

  assert.equal(instance.boolPropertyNoDefault, null);
  assert.equal(instance.boolPropertyWithDefault, true);
  assert.equal(instance.stringPropertyNoDefault, null);
  assert.equal(instance.stringPropertyWithDefault, "text");

  instance.boolPropertyNoDefault = true;
  instance.boolPropertyWithDefault = null;
  instance.stringPropertyNoDefault = "hole";
  instance.stringPropertyWithDefault = null;

  assert.equal(instance.boolPropertyNoDefault, true);
  assert.equal(instance.boolPropertyWithDefault, null);
  assert.equal(instance.stringPropertyNoDefault, "hole");
  assert.equal(instance.stringPropertyWithDefault, null);
});
QUnit.test("isTwoValueEquals compare Base objects", function(assert) {
  var json = {
    elements: [{ type: "text", name: "q1" }],
  };
  var survey1 = new SurveyModel(json);
  var survey2 = new SurveyModel(json);
  assert.equal(
    Helpers.isTwoValueEquals(survey1, survey2),
    true,
    "Two surveys use the same JSON"
  );
  survey1.dispose();
  assert.equal(
    Helpers.isTwoValueEquals(survey1, survey2),
    false,
    "The first survey is disposed"
  );
  survey1 = new SurveyModel(json);
  assert.equal(
    Helpers.isTwoValueEquals(
      survey1.getAllQuestions()[0],
      survey2.getAllQuestions()[0]
    ),
    true,
    "The first survey is disposed"
  );
  survey1.getAllQuestions()[0].name = "q2";
  assert.equal(
    Helpers.isTwoValueEquals(
      survey1.getAllQuestions()[0],
      survey2.getAllQuestions()[0]
    ),
    false,
    "The first survey is disposed"
  );
  assert.equal(
    Helpers.isTwoValueEquals(survey1.pages[0], survey2.getAllQuestions()[0]),
    false,
    "The first survey is disposed"
  );
});
