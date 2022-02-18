import Blockly from 'blockly';

/////////////////////////////////
Blockly.Blocks['avanzar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Avanzar");
    this.appendValueInput("distancia_a_avanzar")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["metros","metros"], ["kilómetros","kilometros"]]), "unidad_de_medida");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
 this.setTooltip("Comando para avanzar X metros/kilómetros");
 this.setHelpUrl("avanzar");
  }
};

Blockly.JavaScript['avanzar'] = function(block) {
  var value_distancia_a_avanzar = Blockly.JavaScript.valueToCode(block, 'distancia_a_avanzar', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_unidad_de_medida = block.getFieldValue('unidad_de_medida');
  // TODO: Assemble JavaScript into code variable.
  var code = 'console.log("Se está avanzando ' + eval(value_distancia_a_avanzar) + ' ' + dropdown_unidad_de_medida + '");\n';
  return code;
};

/////////////////////////////////
Blockly.Blocks['rotar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rotar");
    this.appendValueInput("angulo_a_rotar")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["grados","grados"], ["radianes","radianes"]]), "unidad_de_medida");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
 this.setTooltip("Comando para rotar X grados/radianes");
 this.setHelpUrl("rotar");
  }
};

Blockly.JavaScript['rotar'] = function(block) {
  var value_angulo_a_rotar = Blockly.JavaScript.valueToCode(block, 'angulo_a_rotar', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_unidad_de_medida = block.getFieldValue('unidad_de_medida');
  // TODO: Assemble JavaScript into code variable.
  var code = 'console.log("Se está rotando ' + eval(value_angulo_a_rotar) + ' ' + dropdown_unidad_de_medida + '");\n';
  return code;
};


/////////////////////////////////
Blockly.Blocks['sensor_luz'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sensor de luz:")
        .appendField(new Blockly.FieldLabelSerializable("0", "", {}), "sensor_luz_label");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(330);
 this.setTooltip("Input para leer intensidad de luz");
 this.setHelpUrl("sensor_luz");
  }
};

Blockly.JavaScript['sensor_luz'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  //var code = 'console.log("Leyendo el sensor de Luz... Lectura: " + LEER_SENSOR_DE_LUZ());';
  var code = 'console.log("Leyendo el sensor de Luz... Lectura: " + Math.random())';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
