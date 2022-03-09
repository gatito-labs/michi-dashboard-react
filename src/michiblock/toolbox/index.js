import * as BuiltinCategories from './BuiltinCategories';
import * as CustomCategories from './CustomCategories';

const toolbox = {
  contents: [
    CustomCategories.MovementCategory,
    CustomCategories.SensorsCategory,
    CustomCategories.ScreenCategory,
    BuiltinCategories.Separator,
    BuiltinCategories.LogicCategory,
    BuiltinCategories.LoopsCategory,
    BuiltinCategories.MathCategory,
    BuiltinCategories.TextCategory,
    BuiltinCategories.ListsCategory,
    // BuiltinCategories.ColourCategory,
    BuiltinCategories.Separator,
    BuiltinCategories.VariablesCategory,
    BuiltinCategories.FunctionsCategory,
  ],
  id: 'toolbox',
  style: 'display: none',
};

export default toolbox;
