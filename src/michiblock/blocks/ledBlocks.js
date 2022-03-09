import Blockly from "blockly";

Blockly.Blocks["write_led_screen"] = {
  init: function () {
    this.jsonInit({
      type: "write_led_screen",
      message0: "Escribir en Pantalla LED %1 Columna %2 Fila %3 Texto %4",
      args0: [
        { type: "input_dummy" },

        {
          type: "input_value",
          name: "COL",
          check: "Number",
          align: "RIGHT",
        },
        {
          type: "input_value",
          name: "ROW",
          check: "Number",
          align: "RIGHT",
        },
        {
          type: "input_value",
          name: "TEXT",
          check: ["Number", "String"],
          align: "RIGHT",
        },
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["led_screen_off"] = {
  init: function () {
    this.jsonInit({
      type: "led_screen_off",
      message0: "Apagar Pantalla LED",
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["led_screen_on"] = {
  init: function () {
    this.jsonInit({
      type: "led_screen_on",
      message0: "Encender Pantalla LED",
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["led_screen_clear"] = {
  init: function () {
    this.jsonInit({
      type: "led_screen_clear",
      message0: "Limpiar Pantalla LED",
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "",
      helpUrl: "",
    });
  },
};

Blockly.Python["write_led_screen"] = function (block) {
  var fil = Blockly.Python.valueToCode(
    block,
    "ROW",
    Blockly.Python.ORDER_ATOMIC
  );
  var col = Blockly.Python.valueToCode(
    block,
    "COL",
    Blockly.Python.ORDER_ATOMIC
  );
  var text = Blockly.Python.valueToCode(
    block,
    "TEXT",
    Blockly.Python.ORDER_ATOMIC
  );

  var code = `robot.lcd.write(${col}, ${fil}, ${text})\n`;
  return code;
};

Blockly.Python["led_screen_off"] = function () {
  var code = "robot.lcd.off()\n";
  return code;
};

Blockly.Python["led_screen_on"] = function () {
  var code = "robot.lcd.on()\n";
  return code;
};

Blockly.Python["led_screen_clear"] = function () {
  var code = "robot.lcd.clear()\n";
  return code;
};
