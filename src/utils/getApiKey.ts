import * as vscode from "vscode";

export function getApiKey() {
  const config = vscode.workspace.getConfiguration("askDevAI");

  if (config.apiKey.length <= 0) {
    vscode.commands.executeCommand(
      "DevAI.showErrorNotification",
      "Please, set up your api key"
    );
    return "";
  }

  return config.apiKey;
}
