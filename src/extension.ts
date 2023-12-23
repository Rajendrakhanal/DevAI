import * as vscode from "vscode";
import { createProject } from "./projects";

import boilerplatecode from "./json/boilerplatecode.json";
import { askDevAI } from "./utils/askDevAI";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "DevAI" is now active!');

  let helloWorld = vscode.commands.registerCommand("DevAI.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from DevAI!");
    console.log(vscode.window.activeTextEditor?.document.fileName);
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("askDevAI.start", async () => {
      const question = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: "Enter your question...",
        prompt: "Question",
      });
      if (question !== undefined) {
        const response = await askDevAI(question);
        const panel = vscode.window.createWebviewPanel(
          "AskDevAI", // Identifies the type of the webview. Used internally
          "AskDevAI", // Title of the panel displayed to the user
          vscode.ViewColumn.One, // Editor column to show the new webview panel in.
          {} // Webview options. More on these later.
        );
        // And set its HTML content
        panel.webview.html = getWebviewContent(question, response);
      }
    })
  );

  const c = getLanguageCompletion("c");
  const cpp = getLanguageCompletion("cpp");
  const java = getLanguageCompletion("java");
  const go = getLanguageCompletion("go");
  const csharp = getLanguageCompletion("csharp");

  const showInfoNotification = vscode.commands.registerCommand(
    "DevAI.showInfoNotification",
    () => {
      vscode.window.showInformationMessage("Information from DevAI");
    }
  );
  const showWarningNotification = vscode.commands.registerCommand(
    "DevAI.showWarningNotification",
    () => {
      vscode.window.showWarningMessage("Warning from DevAI");
    }
  );
  const showErrorNotification = vscode.commands.registerCommand(
    "DevAI.showErrorNotification",
    () => {
      vscode.window.showErrorMessage("Error from DevAI");
    }
  );

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
    djangoProject,
    helloWorld,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification
  );
}

const getLanguageCompletion = (
  language: "c" | "cpp" | "java" | "csharp" | "go"
): vscode.Disposable => {
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
};

export function deactivate() {}

function getWebviewContent(question: string, response: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AVUS</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: black;
          margin: 20px;
          height: 100vh;
        }
  
        #question {
          /* margin: 10px; */
          width: 100%;
          height: fit-content;
  
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          flex-grow: 1;
          flex-shrink: 1;
  
          border-bottom: #ccc 4px solid;
        }
  
        #question-input {
          margin: 10px;
          margin-top: 20px;
          padding: 2px;
          font-size: 1.15rem;
          width: 80%;
  
          border-radius: 5px;
          border: 0;
  
          box-shadow: 0 0 0 4px aliceblue;
        }
  
        #question-input:focus {
          outline: orange solid 3px;
        }
  
        .btn {
          margin: 12px;
          padding: 8px;
          font-size: 1.25rem;
          width: 10rem;
          border: 0;
          border-radius: 2rem;
          cursor: pointer;
        }
  
        .btn-primary {
          font-weight: 500;
          background-color: rgb(7, 144, 255);
          color: white;
          letter-spacing: 1.5px;
        }
  
        #response {
          color: aliceblue;
          margin-top: 20px;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div id="question">
        <input
          id="question-input"
          type="text"
          autofocus
          placeholder="${question}"
        />
      </div>
  
      <div id="response">
        ${response}
      </div>

    </body>
  </html>
`;
}
