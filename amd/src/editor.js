// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny tiny_html for Moodle.
 *
 * @module      tiny_html/plugin
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


import {
    component,
    pluginName,
    codeMirrorStyle
} from './common';

/* eslint-disable camelcase */

import {
    html_beautify
} from './beautify/beautify-html';


import {
    get_strings
} from 'core/str';
/* eslint-enable camelcase */
import {
    EditorState,
    EditorView,
    basicSetup,
    lang,
} from './codemirror-lazy';

/**
 * Options for the html_beautify function.
 * We disable the camelCase check here as these are
 * variables that we are passing to the js-beautify library.
 */
/* eslint-disable camelcase */
const beautifyOptions = {
    indent_size: 2,
    wrap_line_length: 80,
    unformatted: [],
};
/* eslint-enable camelcase */
export const init = (targetid) => {

    debugger;
    const content = document.getElementById('id_querysql').value;
    // Beautify the content using html_beautify
    const beautifiedContent = html_beautify(content, beautifyOptions);

    // Create the CodeMirror instance
    let cmInstance;

    let state = EditorState.create({
        doc: beautifiedContent,
        // This is where basicSetup should go as [basicSetup, ...].
        extensions: [
            basicSetup,
            EditorState.tabSize.of(2),
            // Bring in all language extensions.
            ...Object.entries(lang).map(([, languagePlugin]) => languagePlugin()),
        ],
    });


    const container = document.getElementById('ph_querysql');
    // Create a shadow root for the CodeMirror instance.
    // This is required to prevent the TinyMCE editor styles from overriding the CodeMirror ones.
    const shadowRoot = container.attachShadow({
        mode: "open"
    });

    // Add the styles to the shadow root
    const style = document.createElement('style');
    style.textContent = codeMirrorStyle;
    shadowRoot.appendChild(style);

    // Create a new div and add the class 'my-codemirror-container'
    const div = document.createElement('div');
    div.classList.add('CodeMirror');
    shadowRoot.appendChild(div);

    // Create the CodeMirror instance
    cmInstance = new EditorView({
        state,
        parent: div,
    });
};