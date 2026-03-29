// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * CodeMirror 6 SQL editor with schema-aware autocomplete for block_configurable_reports.
 *
 * @module     block_configurable_reports/editor
 * @copyright  2025 Marcus Green
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    EditorState,
    EditorView,
    basicSetup,
    sql,
    MySQL,
} from './codemirror-lazy';

/**
 * Initialise a CodeMirror 6 SQL editor replacing the textarea with the given id.
 * Reads table/column schema from the hidden tablejson field for autocomplete hints.
 *
 * @param {string} targetid - The id of the textarea element to replace
 * @param {Object} options - Optional configuration (reserved for future use)
 */
export const init = (targetid, options = {}) => { // eslint-disable-line no-unused-vars
    const textarea = document.getElementById(targetid);
    if (!textarea) {
        return;
    }

    const schemaElement = document.getElementById('tablejson');
    let schema = {};
    if (schemaElement) {
        try {
            schema = JSON.parse(schemaElement.value);
        } catch (e) {
            // Schema unavailable; autocomplete will still work for SQL keywords.
        }
    }

    const heightTheme = EditorView.theme({
        "&": {height: "190px"},
        ".cm-scroller": {overflow: "auto"},
    });

    const state = EditorState.create({
        doc: textarea.value,
        extensions: [
            basicSetup,
            sql({dialect: MySQL, schema: schema, upperCaseKeywords: true}),
            EditorView.lineWrapping,
            heightTheme,
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    textarea.value = update.state.doc.toString();
                }
            }),
        ],
    });

    const container = document.createElement('div');
    container.className = 'codemirror-sql-editor';
    container.style.width = '100%';
    textarea.parentNode.insertBefore(container, textarea);
    textarea.style.display = 'none';

    new EditorView({
        state,
        parent: container,
    });

    if (textarea.form) {
        textarea.form.addEventListener('submit', () => {
            textarea.value = state.doc.toString();
        });
    }
};
