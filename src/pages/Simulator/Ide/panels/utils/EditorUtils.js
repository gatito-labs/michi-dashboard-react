const commands = require("./commands.json");

const _getCommands = name => {
  return commands[name];
}

const _createCompletionItem = (command, range, monaco) => {
  const args = command.parameters.map(p => p.label);
  
  return {
    label: command.name, // title
    detail: ""+args, // subtitle at the right
    kind: monaco.languages.CompletionItemKind.Function, // symbol
    documentation: command.documentation, // text folded at the right
    insertText: command.insertText, // text inserted when it is selected
    range: range, // range of text that should be replaced by this completion item
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }
};

const _createCompletionItems = (range, monaco) => {
  const data = [];
  Object.values(commands).forEach(signatures => {
    signatures.forEach(signature => {
      data.push(_createCompletionItem(signature, range, monaco));
    })
  });
  return data;
};

const _createSignatureHelpResult = (commands, activeSignature, activeParameter) => {
  const signatures = [];
  commands.forEach(command => {
    signatures.push({
      label: `void ${command.label}`,
      documentation: command.documentation,
      parameters: command.parameters.map(p => ({label: p.label})),
    });
  });

  return {
    dispose: () => {},
    value: {
      signatures: signatures,
      activeSignature: activeSignature,
      activeParameter: activeParameter,
    }
  };
}

const _setUpCompletionItems = (monaco, language) => {
  monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems: function (model, position) {
      const match = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      if (!match) {
        return { suggestions: [] };
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      return {
        suggestions: _createCompletionItems(range, monaco)
      };
    }
  });
};

const _setUpSignaturesHelp = (monaco, language) => {
  monaco.languages.registerSignatureHelpProvider(language, {

    signatureHelpTriggerCharacters: ["(", ","],
    provideSignatureHelp: function(model, position, token, context) {

      const match = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
  
      if (!match) {
        return { dispose: () => {}, value: {} };
      }

      const penultimateParenthesis = match.lastIndexOf("(", match.lastIndexOf("(") - 1);
      const lastParenthesis = match.lastIndexOf("(");

      console.log(penultimateParenthesis, lastParenthesis);

      const commandName = match.slice(
        penultimateParenthesis + 1,
        lastParenthesis
      );

      console.log(commandName)
      
      const commands = _getCommands(commandName);
      
      if (commands) {
        const activeSignature = 0;
        const activeParameter = -1;
        //const activeParameter = (match.match(",") || []).length;
        return _createSignatureHelpResult(commands, activeSignature, activeParameter);
      } else {
        return { dispose: () => {}, value: {} };
      }
    }
  });
};

export default function setUpMustakisEditor(monaco) {
  _setUpCompletionItems(monaco, "cpp");
  _setUpSignaturesHelp(monaco, "cpp");
};
