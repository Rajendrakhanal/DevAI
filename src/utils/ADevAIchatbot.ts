import * as vscode from "vscode";

import { WebViewPanel } from "../components/abstract/webViewPanel";
import { askOpenAI } from "./askOpenAI";
import { showInputBox } from "./showInputBox";

export class ADevAIchatbot extends WebViewPanel {
  viewPanelHTML: string;
  private question: string | undefined;
  private answer: string | undefined;

  public constructor() {
    super("Ask DevAIchatbot", "AskDevAIchatbot");
    this.viewPanelHTML = this.getWebviewContent("", "");
  }

  setWebViewPanelHTMLContent(data: (string | undefined)[]): void {
    this.viewPanelHTML = this.getWebviewContent(data[0], data[1]);
  }

  public showWebView() {
    this.viewPanelInstance.webview.html = this.viewPanelHTML;
  }

  public async askQuestion() {
    this.question = await showInputBox("Enter your question...", "Question");
    if (typeof this.question === undefined) {
      this.answer = "Invalid Question";

      vscode.commands.executeCommand(
        "DevAIchatbot.showErrorNotification",
        "Invalid question"
      );
    } else {
      this.answer = await askOpenAI(this.question);
    }

    this.setWebViewPanelHTMLContent([this.question, this.answer]);
    return this.answer;
  }

  private getWebviewContent(
    question: string | undefined,
    response: string | undefined
  ): string {
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
        background-color:  #2D2B55;
    }
    
    #DevAIchatbot {
      margin: 20px 10px;
      padding: 16px;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    
    }
    .DevAIchatbot_div{
        background-color: #1a1b21;
       
        padding: 1.5rem;
        border-radius: 5px;
       box-shadow: -5px 3px 12px 4px #A599E9;
    -webkit-box-shadow: -5px 3px 12px 4px #A599E9;
    -moz-box-shadow: -5px 3px 12px 4px #A599E9;
    }
    
    #question {
      margin: 2px;
      color: rgb(192,192,192);
      font-size: 1.8rem;
      text-align: center;
    }
    
    #question::after {
      content: "";
      display: block;
      margin-top: 5px;
      border: rgb(192,192,192) solid 2px;
    }
    
    #answer {
      margin-top: 16px;
      color: rgb(192,192,192);
      font-size: 1rem;
      letter-spacing: 2px;
      line-height: 1.3rem;
    }
    
      </style>
    </head>
    
    <body>
    <div id="DevAIchatbot">
    <div class="DevAIchatbot_div">
    <div id="question">${question}
    </div>
    <div id="answer">
    ${response}
    </div>
    </div>
    </div>
    </body>
    
    </html>
  `;
  }
}
