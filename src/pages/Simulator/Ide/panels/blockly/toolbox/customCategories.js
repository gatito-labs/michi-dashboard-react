/**
 * Aquí pedimos registrar los bloques al importar CustomBlocks
 * y los exportamos luego de agruparlos en categorías.
 */
import './customBlocks';

const MovementCategory = {
  kind: "category",
  name: "Movimiento",
  colour: "#5CA699",
  contents: [
    {
      kind: "block",
      type: "avanzar",
    },
    {
      kind: "block",
      type: "rotar",
    },
  ],
}

const SensorsCategory = {
  kind: "category",
  name: "Sensores",
  colour: "#5CA699",
  contents: [
    {
      kind: "block",
      type: "sensor_luz",
    },
  ],
}

export {
  MovementCategory,
  SensorsCategory
};