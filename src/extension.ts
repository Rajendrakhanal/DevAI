import * as vscode from "vscode";
import { createProject } from "./projects";

import boilerplatecode from "./json/boilerplatecode.json";
import { ADevAI } from "./utils/ADevAI";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "DevAI" is now active!');

  let helloWorld = vscode.commands.registerCommand("DevAI.startup", () => {
    vscode.commands.executeCommand(
      "DevAI.showInfoNotification",
      "Welcome to DevAI!"
    );
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("askDevAI.start", async () => {
      const aDevAI = new ADevAI();

      await aDevAI.askQuestion();
      aDevAI.showWebView();
    })
  );

  registerLanguageCompletion();
  registerProjectBoilerPlateCode(context);
  registerNotification(context);

  context.subscriptions.push(helloWorld);
}

function registerLanguageCompletion() {
  getLanguageCompletion("c");
  getLanguageCompletion("cpp");
  getLanguageCompletion("java");
  getLanguageCompletion("go");
  getLanguageCompletion("csharp");
}

function registerProjectBoilerPlateCode(context: vscode.ExtensionContext) {
  const cProject = vscode.commands.registerCommand(
    "DevAI.createCProject",
    () => {
      createProject("c");
    }
  );

  const cppProject = vscode.commands.registerCommand(
    "DevAI.createCPPProject",
    () => {
      createProject("cpp");
    }
  );

  const reactProject = vscode.commands.registerCommand(
    "DevAI.createReactProject",
    () => {
      createProject("react");
    }
  );

  const djangoProject = vscode.commands.registerCommand(
    "DevAI.createdjangoProject",
    () => {
      createProject("django");
    }
  );

  const nodeProject = vscode.commands.registerCommand(
    "DevAI.createNodeProject",
    () => {
      createProject("node");
    }
  );

  context.subscriptions.push(
    cppProject,
    nodeProject,
    cProject,
    reactProject,
    djangoProject
  );
}

function registerNotification(context: vscode.ExtensionContext) {
  const showInfoNotification = vscode.commands.registerCommand(
    "DevAI.showInfoNotification",
    (message) => {
      vscode.window.showInformationMessage(message);
    }
  );
  const showWarningNotification = vscode.commands.registerCommand(
    "DevAI.showWarningNotification",
    (message) => {
      vscode.window.showWarningMessage(message);
    }
  );
  const showErrorNotification = vscode.commands.registerCommand(
    "DevAI.showErrorNotification",
    (message) => {
      vscode.window.showErrorMessage(message);
    }
  );

  context.subscriptions.push(
    showErrorNotification,
    showInfoNotification,
    showWarningNotification
  );
}

export function deactivate() {}

function getLanguageCompletion(
  language: "c" | "cpp" | "java" | "csharp" | "go"
): vscode.Disposable {
  return vscode.languages.registerCompletionItemProvider(language, {
    provideCompletionItems() {
      const snippetCompletion = new vscode.CompletionItem(
        boilerplatecode[language].prefix
      );

      let body = boilerplatecode[language].body.join("");

      snippetCompletion.insertText = new vscode.SnippetString(body);

      return [snippetCompletion];
    },
  });
}
