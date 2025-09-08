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
 * SQL editor module for CodeMirror
 *
 * @module     block_configurable_reports/sql
 * @copyright  2025 Marcus Green
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    basicSetup
} from '@codemirror/basic-setup';
import {
    sql,
    StandardSQL,
    PostgreSQL,
    MySQL,
    MariaSQL,
    MSSQL,
    SQLite,
    Cassandra,
    PLSQL
} from '@codemirror/lang-sql';
import {
    oneDark
} from '@codemirror/theme-one-dark';
import {
    EditorState,
    EditorView
} from '@codemirror/state';
import {
    placeholder
} from '@codemirror/view';

/**
 * Base class for editor configuration
 */
class Base {
    #extensions = [];
    #options = {};

    /**
     * Create a new Base instance
     *
     * @param {Array} extensions - Array of editor extensions
     * @param {Object} options - Configuration options
     */
    constructor(extensions, options = {}) {
        for (const extension of extensions) {
            this.#extensions.push(extension);
        }
        this.#options = options;
    }

    /**
     * Create a new editor state
     *
     * @param {string} content - Initial content
     * @param {Object} options - Configuration options
     * @returns {EditorState} Editor state
     */
    newState(content, options = {}) {
        const extensions = this.#extensions.slice();

        if ("placeholder" in options) {
            extensions.push(placeholder(options.placeholder));
        }

        if ("focus" in options) {
            extensions.push(EditorView.updateListener.of((event) => {
                if (event.focusChanged) {
                    options.focus.value = event.view.state.doc.toString();
                }
            }));
        }

        if ("extensions" in this.#options && typeof this.#options.extensions === "object") {
            for (const [name, extension] of Object.entries(this.#options.extensions)) {
                if (name in options && options[name] === true) {
                    extensions.push(extension);
                }
            }
        }

        return EditorState.create({
            doc: content,
            extensions
        });
    }

    /**
     * Create a new editor view
     *
     * @param {HTMLElement} element - Parent element
     * @param {EditorState} state - Editor state
     * @param {Object} options - Configuration options
     * @returns {EditorView} Editor view
     */
    newView(element, state, options = {}) {
        const viewOptions = {
            lineWrapping: "lineWrapping" in options ? options.lineWrapping : true
        };

        return new EditorView(Object.assign({}, viewOptions, {
            parent: element,
            state
        }));
    }

    /**
     * Create a new editor
     *
     * @param {HTMLElement} element - Parent element
     * @param {string} content - Initial content
     * @param {Object} options - Configuration options
     * @returns {EditorView} Editor view
     */
    newEditor(element, content, options = {}) {
        const state = this.newState(content, options);
        return this.newView(element, state, options);
    }

    /**
     * Initialize editor from an HTML element
     *
     * @param {HTMLElement} element - Element to initialize from
     * @param {Object} options - Configuration options
     * @returns {EditorView} Editor view
     */
    fromElement(element, options = {}) {
        if (element.nodeName === "TEXTAREA") {
            return this.#textarea(element, options);
        }

        const content = element.innerHTML;
        element.innerHTML = "";
        return this.newEditor(element, content, options);
    }

    /**
     * Initialize editor from a textarea element
     *
     * @param {HTMLTextAreaElement} textarea - Textarea element
     * @param {Object} options - Configuration options
     * @returns {EditorView} Editor view
     */
    textarea(element, options = {}) {
        return this.fromElement(element, options);
    }

    /**
     * Internal method to handle textarea initialization
     *
     * @private
     * @param {HTMLTextAreaElement} textarea - Textarea element
     * @param {Object} options - Configuration options
     * @returns {EditorView} Editor view
     */
    #textarea(textarea, options = {}) {
        const placeholder = textarea.getAttribute("placeholder");
        if (placeholder && placeholder.length) {
            options.placeholder = placeholder;
        }
        options.focus = textarea;

        const element = document.createElement("div");
        element.className = "codemirror";

        const view = this.newEditor(element, textarea.value, options);
        textarea.parentNode.insertBefore(element, textarea);
        textarea.style.display = "none";

        if (textarea.form) {
            textarea.form.addEventListener("submit", () => {
                textarea.value = view.state.doc.toString();
            });
        }

        return view;
    }
}

const extensions = [
    basicSetup,
    sql()
];

const options = {
    extensions: {
        dark: oneDark
    }
};

/**
 * Load the SQL editor module
 *
 * @returns {Base} Base instance configured for SQL editing
 */
export function load() {
    return new Base(extensions, options);
}