/**

 */
import "../blocks/movementBlocks";
import "../blocks/sensingBlocks";
import "../blocks/ledBlocks";

const MovementCategory = {
  kind: "category",
  name: "Movimiento",
  colour: "#5CA699",
  contents: [
    {
      kind: "block",
      type: "avanzar",
      blockxml:
        "<block type='avanzar'><value name='vel'><shadow type='math_number'><field name='NUM'>1</field> </shadow> </value></block>",
    },

    {
      kind: "block",
      type: "retroceder",
      blockxml:
        "<block type='retroceder'><value name='vel'><shadow type='math_number'><field name='NUM'>1</field> </shadow> </value></block>",
    },

    {
      kind: "block",
      type: "rotar",
      blockxml:
        "<block type='rotar'><value name='vel'><shadow type='math_number'><field name='NUM'>0</field></shadow></value></block>",
    },

    {
      kind: "block",
      type: "ruedas",
      blockxml: `<block type='ruedas'>  </block>`,
    },

    {
      kind: "block",
      type: "detenerse",
    },

    {
      kind: "block",
      type: "pause",
      blockxml: `<block type='pause'><value name='TIME'><shadow type='math_number'><field name='NUM'>0</field></shadow></value></block>`,
    },
  ],
};

const SensorsCategory = {
  kind: "category",
  name: "Sensores",
  colour: "#A55B80",
  contents: [
    {
      kind: "block",
      type: "sensor_luz",
    },
    {
      kind: "block",
      type: "sensor_obstaculo",
    },
  ],
};

const ScreenCategory = {
  kind: "category",
  name: "Pantalla",
  colour: "#A5745B",
  contents: [
    {
      kind: "block",
      type: "write_led_screen",
      blockxml: `<block type='write_led_screen'>
         <value name='COL'>
           <shadow type='math_number'><field name='COL'>0</field></shadow>
         </value>
         <value name='ROW'>
           <shadow type='math_number'><field name='COL'>0</field></shadow>
         </value>
       </block>`,
    },
    {
      kind: "block",
      type: "led_screen_on",
    },
    {
      kind: "block",
      type: "led_screen_off",
    },
    {
      kind: "block",
      type: "led_screen_clear",
    },
  ],
};

export { MovementCategory, SensorsCategory, ScreenCategory };
