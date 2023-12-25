import * as vscode from "vscode";
import { createProject } from "./projects";

import boilerplatecode from "./json/boilerplatecode.json";
import { ADevAIchatbot } from "./utils/ADevAIchatbot";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "DevAIchatbot" is now active!');

  let helloWorld = vscode.commands.registerCommand("DevAIchatbot.startup", () => {
    vscode.commands.executeCommand(
      "DevAIchatbot.showInfoNotification",
      "Welcome to DevAIchatbot!"
    );
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("askDevAIchatbot.start", async () => {
      const aDevAIchatbot = new ADevAIchatbot();

      await aDevAIchatbot.askQuestion();
      aDevAIchatbot.showWebView();
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
    "DevAIchatbot.createCProject",
    () => {
      createProject("c");
    }
  );

  const cppProject = vscode.commands.registerCommand(
    "DevAIchatbot.createCPPProject",
    () => {
      createProject("cpp");
    }
  );

  const reactProject = vscode.commands.registerCommand(
    "DevAIchatbot.createReactProject",
    () => {
      createProject("react");
    }
  );

  const djangoProject = vscode.commands.registerCommand(
    "DevAIchatbot.createdjangoProject",
    () => {
      createProject("django");
    }
  );

  const nodeProject = vscode.commands.registerCommand(
    "DevAIchatbot.createNodeProject",
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
    "DevAIchatbot.showInfoNotification",
    (message) => {
      vscode.window.showInformationMessage(message);
    }
  );
  const showWarningNotification = vscode.commands.registerCommand(
    "DevAIchatbot.showWarningNotification",
    (message) => {
      vscode.window.showWarningMessage(message);
    }
  );
  const showErrorNotification = vscode.commands.registerCommand(
    "DevAIchatbot.showErrorNotification",
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
