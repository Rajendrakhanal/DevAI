import * as vscode from "vscode";

export function getApiKey() {
  const config = vscode.workspace.getConfiguration("askDevAIchatbot");

  if (config.apiKey.length <= 0) {
    vscode.commands.executeCommand(
      "DevAIchatbot.showErrorNotification",
      "Please, set up your api key"
    );
    return "";
  }

  return config.apiKey;
}
