const dependencyProposals = require("./dependencyProposals.json");

export const createDependencyProposals = (range, monaco) => {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup
  const data = [];
  dependencyProposals.forEach(dependencyProposal => {
    data.push({
      range: range,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      ...dependencyProposal,
    });
  });
  return data;
}

