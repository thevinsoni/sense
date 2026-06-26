import * as vscode from 'vscode';
import { auditFile } from 'fivosense';

let diagnosticCollection: vscode.DiagnosticCollection;
let statusBarItem: vscode.StatusBarItem;

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('FivoSense extension activated');

  // Create diagnostic collection
  diagnosticCollection = vscode.languages.createDiagnosticCollection('fivosense');
  context.subscriptions.push(diagnosticCollection);

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = '$(shield) FivoSense';
  statusBarItem.tooltip = 'FivoSense Security Scanner';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('fivosense.scanFile', scanCurrentFile),
    vscode.commands.registerCommand('fivosense.scanWorkspace', scanWorkspace),
    vscode.commands.registerCommand('fivosense.roast', roastMode),
    vscode.commands.registerCommand('fivosense.badge', showBadge)
  );

  // Register event handlers
  const config = vscode.workspace.getConfiguration('fivosense');
  
  if (config.get('scanOnSave')) {
    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument(document => {
        if (shouldScanDocument(document)) {
          scanDocument(document);
        }
      })
    );
  }

  if (config.get('enableRealTime')) {
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(event => {
        if (shouldScanDocument(event.document)) {
          // Debounce real-time scanning
          debounce(() => scanDocument(event.document), 1000);
        }
      })
    );
  }

  // Scan active editor on start
  if (vscode.window.activeTextEditor) {
    scanDocument(vscode.window.activeTextEditor.document);
  }
}

/**
 * Extension deactivation
 */
export function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

/**
 * Check if document should be scanned
 */
function shouldScanDocument(document: vscode.TextDocument): boolean {
  const supportedLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
  return supportedLanguages.includes(document.languageId) && 
         document.uri.scheme === 'file';
}

/**
 * Scan a document
 */
async function scanDocument(document: vscode.TextDocument) {
  try {
    statusBarItem.text = '$(sync~spin) Scanning...';
    
    const result = await auditFile(document.uri.fsPath);
    const diagnostics: vscode.Diagnostic[] = [];

    // Convert vulnerabilities to VS Code diagnostics
    for (const vuln of result.vulnerabilities) {
      const severity = getSeverity(vuln.severity);
      const line = vuln.location?.line || 1;
      const range = new vscode.Range(
        line - 1, 0,
        line - 1, 1000
      );

      const evidenceText = vuln.evidence
        ?.filter((e: any) => e.line)
        .map((e: any) => `${e.type} at line ${e.line}`)
        .join(', ') || 'No evidence';

      const diagnostic = new vscode.Diagnostic(
        range,
        `[${vuln.category}] ${vuln.finding}\n${evidenceText}`,
        severity
      );

      diagnostic.code = vuln.cwe;
      diagnostic.source = 'FivoSense';
      
      // Add taint path as related info
      if (vuln.path && vuln.path.length > 0) {
        diagnostic.relatedInformation = [
          new vscode.DiagnosticRelatedInformation(
            new vscode.Location(document.uri, range),
            `Taint path: ${vuln.path.join(' → ')}`
          )
        ];
      }

      diagnostics.push(diagnostic);
    }

    // Convert secrets to VS Code diagnostics
    for (const secret of result.secrets) {
      const range = new vscode.Range(
        secret.line - 1, 0,
        secret.line - 1, 1000
      );

      const diagnostic = new vscode.Diagnostic(
        range,
        `[Secret] ${secret.type} detected: ${secret.match}`,
        vscode.DiagnosticSeverity.Warning
      );

      diagnostic.code = 'CWE-798';
      diagnostic.source = 'FivoSense';
      diagnostic.relatedInformation = [
        new vscode.DiagnosticRelatedInformation(
          new vscode.Location(document.uri, range),
          'Fix: Use environment variables instead of hardcoded secrets'
        )
      ];

      diagnostics.push(diagnostic);
    }

    // Convert destructive commands to VS Code diagnostics
    for (const cmd of result.destructive) {
      const range = new vscode.Range(
        cmd.line - 1, 0,
        cmd.line - 1, 1000
      );

      const diagnostic = new vscode.Diagnostic(
        range,
        `[Destructive] ${cmd.command} - ${cmd.reason}`,
        vscode.DiagnosticSeverity.Error
      );

      diagnostic.source = 'FivoSense';
      diagnostic.relatedInformation = [
        new vscode.DiagnosticRelatedInformation(
          new vscode.Location(document.uri, range),
          `Suggestion: ${cmd.suggestion}`
        )
      ];

      diagnostics.push(diagnostic);
    }

    diagnosticCollection.set(document.uri, diagnostics);

    // Update status bar
    const { critical, high, medium } = result.summary;
    if (result.summary.total === 0) {
      statusBarItem.text = '$(shield-check) FivoSense: Clean';
      statusBarItem.backgroundColor = undefined;
    } else if (critical > 0) {
      statusBarItem.text = `$(shield-x) FivoSense: ${critical} Critical`;
      statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    } else if (high > 0) {
      statusBarItem.text = `$(warning) FivoSense: ${high} High`;
      statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
      statusBarItem.text = `$(info) FivoSense: ${medium} Issues`;
      statusBarItem.backgroundColor = undefined;
    }

  } catch (error: any) {
    statusBarItem.text = '$(shield-x) FivoSense: Error';
    vscode.window.showErrorMessage(`FivoSense scan failed: ${error.message}`);
  }
}

/**
 * Convert severity to VS Code diagnostic severity
 */
function getSeverity(severity: string): vscode.DiagnosticSeverity {
  switch (severity.toLowerCase()) {
    case 'critical':
    case 'high':
      return vscode.DiagnosticSeverity.Error;
    case 'medium':
      return vscode.DiagnosticSeverity.Warning;
    case 'low':
      return vscode.DiagnosticSeverity.Information;
    default:
      return vscode.DiagnosticSeverity.Hint;
  }
}

/**
 * Scan current file command
 */
async function scanCurrentFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  if (!shouldScanDocument(editor.document)) {
    vscode.window.showWarningMessage('File type not supported');
    return;
  }

  await scanDocument(editor.document);
  vscode.window.showInformationMessage('FivoSense scan completed');
}

/**
 * Scan workspace command
 */
async function scanWorkspace() {
  const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx}', '**/node_modules/**');
  
  let totalFindings = 0;
  let criticalCount = 0;

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'FivoSense: Scanning workspace...',
    cancellable: false
  }, async (progress) => {
    for (let i = 0; i < files.length; i++) {
      progress.report({ 
        increment: (100 / files.length),
        message: `${i + 1}/${files.length} files`
      });

      const document = await vscode.workspace.openTextDocument(files[i]);
      const result = await auditFile(document.uri.fsPath);
      
      totalFindings += result.summary.total;
      criticalCount += result.summary.critical;

      if (result.summary.total > 0) {
        await scanDocument(document);
      }
    }
  });

  vscode.window.showInformationMessage(
    `FivoSense: Scanned ${files.length} files. Found ${totalFindings} issues (${criticalCount} critical)`
  );
}

/**
 * Roast mode command
 */
async function roastMode() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  const result = await auditFile(editor.document.uri.fsPath);
  
  let roast = '';
  if (result.summary.total === 0) {
    roast = '🎉 Your code is cleaner than your browser history!';
  } else if (result.summary.critical > 0) {
    roast = '🔥 Even script kiddies are embarrassed for you. This code has more holes than Swiss cheese!';
  } else if (result.summary.high > 0) {
    roast = '😬 Living dangerously, I see. Your security posture is... creative.';
  } else {
    roast = '🤔 Not terrible, but I\'ve seen better security at a lemonade stand.';
  }

  vscode.window.showInformationMessage(roast, { modal: true });
}

/**
 * Show security badge command
 */
async function showBadge() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  const result = await auditFile(editor.document.uri.fsPath);
  
  // Calculate grade
  let grade = 'A+';
  let score = 100;
  
  if (result.summary.critical > 0) {
    grade = 'F';
    score = 40;
  } else if (result.summary.high > 0) {
    grade = 'D';
    score = 60;
  } else if (result.summary.medium > 0) {
    grade = 'B';
    score = 80;
  }

  const message = `🛡️ Security Grade: ${grade}\nScore: ${score}/100\n\nFindings:\n` +
    `Critical: ${result.summary.critical}\n` +
    `High: ${result.summary.high}\n` +
    `Medium: ${result.summary.medium}`;

  vscode.window.showInformationMessage(message, { modal: true });
}

/**
 * Debounce utility
 */
let debounceTimer: NodeJS.Timeout;
function debounce(func: Function, delay: number) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => func(), delay);
}
