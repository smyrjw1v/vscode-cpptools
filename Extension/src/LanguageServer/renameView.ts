/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All Rights Reserved.
 * See 'LICENSE' in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import * as vscode from 'vscode';
import { ReferencesResult, ReferencesResultCallback } from './references';
import { ReferencesModel } from './referencesModel';
import { ReferenceDataProvider } from './referencesProvider';

// export class RenameView {
//     private renamePendingDataProvider: RenameDataProvider;
//     private renameCandidatesDataProvider: RenameDataProvider;
//     private model: RenameModel;
//     private visible: boolean = false;

//     constructor() {
//         this.renamePendingDataProvider = new RenameDataProvider(true);
//         this.renameCandidatesDataProvider = new RenameDataProvider(false);
//         vscode.window.createTreeView(
//             'CppRenamePendingView',
//             { treeDataProvider: this.renamePendingDataProvider, showCollapseAll: false });

//         vscode.window.createTreeView(
//             'CppRenameCandidatesView',
//             { treeDataProvider: this.renameCandidatesDataProvider, showCollapseAll: false });
//     }

//     show(showView: boolean): void {
//         vscode.commands.executeCommand(`setContext`, 'cppRename:hasResults', showView);
//         if (showView) {
//             this.visible = true;
//             vscode.commands.executeCommand(`CppRenamePendingView.focus`);
//         } else if (this.visible) {
//             this.visible = false;
//             this.model.cancel();
//             this.model = null;
//             this.clearData();
//         }
//     }

//     setData(results: ReferencesResult, resultsCallback: ReferencesResultCallback): void {
//         this.model = new RenameModel(results, this.renamePendingDataProvider, this.renameCandidatesDataProvider, resultsCallback);
//         this.renamePendingDataProvider.setModel(this.model);
//         this.renameCandidatesDataProvider.setModel(this.model);
//     }

//     clearData(): void {
//         this.renamePendingDataProvider.clear();
//         this.renameCandidatesDataProvider.clear();
//     }
// }

export class RenameView {
    private referencesModel: ReferencesModel;
    private renamePendingDataProvider: ReferenceDataProvider;
    private renameCandidatesDataProvider: ReferenceDataProvider;
    private visible: boolean = false;

    constructor() {
        this.renamePendingDataProvider = new ReferenceDataProvider(false);
        this.renameCandidatesDataProvider = new ReferenceDataProvider(true);
        vscode.window.createTreeView(
            'CppRenamePendingView',
            { treeDataProvider: this.renamePendingDataProvider, showCollapseAll: false });
        vscode.window.createTreeView(
            'CppRenameCandidatesView',
            { treeDataProvider: this.renameCandidatesDataProvider, showCollapseAll: false });
    }

    show(showView: boolean): void {
        vscode.commands.executeCommand(`setContext`, 'cppRename:hasResults', showView);
        if (showView) {
            this.visible = true;
            vscode.commands.executeCommand(`CppRenamePendingView.focus`);
        } else if (this.visible) {
            this.visible = false;
            this.referencesModel.cancelRename();
            this.referencesModel = null;
            this.clearData();
        }
    }

    // toggleGroupView(): void {
    //     // TODO
    // }

    refresh(): void {
        this.renamePendingDataProvider.refresh();
        this.renameCandidatesDataProvider.refresh();
    }

    setData(results: ReferencesResult, resultsCallback: ReferencesResultCallback): void {
        this.referencesModel = new ReferencesModel(results, true, false, resultsCallback, () => { this.refresh(); });
        this.renamePendingDataProvider.setModel(this.referencesModel);
        this.renameCandidatesDataProvider.setModel(this.referencesModel);
    }

    clearData(): void {
        this.renamePendingDataProvider.clear();
        this.renameCandidatesDataProvider.clear();
    }
}
