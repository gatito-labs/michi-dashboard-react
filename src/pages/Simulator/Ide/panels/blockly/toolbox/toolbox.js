import * as BuiltinCategories from './builtinCategories';
import * as CustomCategories from './customCategories';

const Toolbox = {
  contents: [
    CustomCategories.MovementCategory,
    CustomCategories.SensorsCategory,
    BuiltinCategories.Separator,
    BuiltinCategories.LogicCategory,
    BuiltinCategories.LoopsCategory,
    BuiltinCategories.MathCategory,
    BuiltinCategories.TextCategory,
    BuiltinCategories.ListsCategory,
    BuiltinCategories.ColourCategory,
    BuiltinCategories.Separator,
    BuiltinCategories.VariablesCategory,
    BuiltinCategories.FunctionsCategory,
  ],
  id: 'toolbox',
};

export default Toolbox;
