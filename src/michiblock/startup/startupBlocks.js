export const defaultInitialBlock =
  '<xml><block type="start" deletable="false" movable="false"></block></xml>';

export const loopBlock = `
<xml>
    <block type="procedures_defnoreturn" deletable="false" movable="false" x="0" y="0">
        <field name="NAME" editable="false">setup</field>
    </block>
    <block type="procedures_defnoreturn" deletable="false" movable="true" x="200" y="0">
        <field name="NAME" editable="false">loop</field>
    </block>
</xml>`;
