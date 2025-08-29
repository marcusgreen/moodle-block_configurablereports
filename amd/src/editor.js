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

/*
 * JavaScript to add popup sql hints in the editor
 *
 * @package block_configurable_reports
 * @copyright 2021 Marcus Green
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import CodeMirror from 'block_configurable_reports/codemirror/lib/cm6pro-lazy';
import 'block_configurable_reports/codemirror/mode/sql/sql';
import 'block_configurable_reports/codemirror/addon/hint/show-hint';
import 'block_configurable_reports/codemirror/addon/hint/sql-hint';

export const init = () => {
    const tablejson = document.getElementById('tablejson');
    const AUTOCOMPLETE_TABLES = JSON.parse(tablejson.value);
    const textarea = document.getElementById('id_querysql');
    const view = new CodeMirror.EditorView({
        parent: textarea.parentElement,
        state: CodeMirror.EditorState.create({
            doc: textarea.value,
            extensions: [
                CodeMirror.basicSetup,
                CodeMirror.autocompletion({
                    override: [
                        (ctx) => CodeMirror.showHint
                            ? CodeMirror.showHint(ctx, CodeMirror.hint.sql, {
                                  tables: AUTOCOMPLETE_TABLES,
                                  disableKeywords: true
                              })
                            : null
                    ]
                })
            ]
        })
    });
    view.dom.style.width = '100%';
    view.dom.style.height = '50px';
};
