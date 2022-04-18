const commands = require("./commands.json");

const _getCommandsNames = name => {
  return commands[name];
}

const _createCompletionItem = (command, monaco) => {
  const args = command.parameters.map(p => p.label);
  
  return {
    label: command.name, // title
    detail: ""+args, // subtitle at the right
    kind: monaco.languages.CompletionItemKind.Function, // symbol
    documentation: command.documentation, // text folded at the right
    insertText: command.insertText, // text inserted when it is selected
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }
};

const _createCompletionItems = (monaco) => {
  const data = [];
  Object.values(commands).forEach(signatures => {
    signatures.forEach(signature => {
      data.push(_createCompletionItem(signature, monaco));
    })
  });
  return data;
};

const _createSignatureHelpResult = (commands, activeSignature, activeParameter) => {
  const signatures = [];
  commands.forEach(command => {
    signatures.push({
      label: `void ${command.label}`,
      documentation: [
        command.documentation,
        "",
        command.parameters.map((parameter => (
          parameter.label + " : " + parameter.documentation
        ))).join("\n"),
      ].join("\n"),
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
    provideCompletionItems: function() {
      return { suggestions: _createCompletionItems(monaco) }
    }
  });
};

const _setUpSignaturesHelp = (monaco, language) => {
  monaco.languages.registerSignatureHelpProvider(language, {

    signatureHelpTriggerCharacters: ["(", ","],
    provideSignatureHelp: function(model, position, token, context) {

      let match = model.getValueInRange({
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

      const commandName = match.slice(
        penultimateParenthesis + 1,
        lastParenthesis
      );

      const commands = _getCommandsNames(commandName);
      
      if (commands) {
        const activeSignature = 0;
        const activeParameter = -1;
        //const activeParameter = commandFull.split(",").length - 1;
        // también detecta las comas (,) que se encuentran dentro de strings
        // TO-DO: resolver el bug para contar las comas efectivas que separan parámetros
        return _createSignatureHelpResult(commands, activeSignature, activeParameter);
      } else {
        return { dispose: () => {}, value: {} };
      }
    }
  });
};

export function setUpArduinoCompletions(monaco) {
  monaco.languages.registerCompletionItemProvider("cpp", {
    provideCompletionItems: function() {
      return {
        suggestions: [
          {
            label: "setup",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "void setup() {",
              "\t$0",
              "}",
            ].join("\n"),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "Setup Function",
          },
          {
            label: "loop",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              "void loop() {",
              "\t$0",
              "}",
            ].join("\n"),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: "Loop Function",
          },
        ]
      };
    }
  });
}

export function setUpHighlighting(monaco, language) {
  monaco.editor.defineTheme('mustakisTheme', {
    base: 'vs-dark',
    inherit: true, // can also be false to completely replace the builtin rules
    rules: [],
    colors: {}
  });

  monaco.editor.setTheme("mustakisTheme");
}


export default function setUpMustakisEditor(monaco) {;
  setUpHighlighting(monaco,'python');
};
