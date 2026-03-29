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
 * Table sorting for block_configurable_reports using Tablesort.
 *
 * @module     block_configurable_reports/tablesort
 * @copyright  2025 Marcus Green
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Tablesort from './tablesort-lib';

/**
 * Initialise sortable columns on a table.
 *
 * @param {string} selector - CSS selector for the table element
 */
export const init = (selector) => {
    const table = document.querySelector(selector);
    if (table) {
        new Tablesort(table);
    }
};
