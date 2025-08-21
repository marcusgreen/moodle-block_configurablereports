/**
 * Plain JavaScript version of configurable_reports.js
 * Converted from YUI to vanilla JavaScript and Fetch API.
 */

var editor_querysql = null;
var editor_remotequerysql = null;

/* Namespace for configurable reports plain JS */
M.block_configurable_reports = {

    init: function() {
        // Documentation for CodeMirror: http://codemirror.net/
        editor_querysql = CodeMirror.fromTextArea(
            document.getElementById('id_querysql'), {
                mode: 'text/x-mysql',
                rtlMoveVisually: true,
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true
            }
        );

        editor_remotequerysql = CodeMirror.fromTextArea(
            document.getElementById('id_remotequerysql'), {
                mode: 'text/x-mysql',
                rtlMoveVisually: true,
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true
            }
        );
    },

    loadReportCategories: function() {
        var select = document.getElementById('id_crreportcategories');
        var url = M.cfg.wwwroot +
            '/blocks/configurable_reports/repository.php' +
            '?action=listreports&sesskey=' + encodeURIComponent(M.cfg.sesskey);

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                Object.keys(data).forEach(function(key) {
                    var opt = document.createElement('option');
                    opt.value = data[key].path;
                    opt.textContent = data[key].name;
                    select.appendChild(opt);
                });
            })
            .catch(function() {
                window.alert('Repository unreachable');
            });
    },

    onchange_crreportcategories: function(select) {
        var selectNames = document.getElementById('id_crreportnames');
        var category = select.options[select.selectedIndex].value;
        var url = M.cfg.wwwroot +
            '/blocks/configurable_reports/repository.php' +
            '?action=listcategory&category=' + encodeURIComponent(category) +
            '&sesskey=' + encodeURIComponent(M.cfg.sesskey);

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                selectNames.innerHTML = '';
                var defaultOpt = document.createElement('option');
                defaultOpt.value = '-1';
                defaultOpt.textContent = '...';
                selectNames.appendChild(defaultOpt);

                Object.keys(data).forEach(function(key) {
                    var opt = document.createElement('option');
                    opt.value = data[key].git_url;
                    opt.textContent = data[key].name;
                    selectNames.appendChild(opt);
                });
            })
            .catch(function() {
                window.alert('Repository unreachable');
            });
    },

    onchange_crreportnames: function(select) {
        var path = select.options[select.selectedIndex].value;
        window.location.href =
            window.location.href +
            '&importurl=' + encodeURIComponent(path);
    },

    onchange_reportcategories: function(select) {
        var wrapper = document.getElementById('id_reportsincategory');
        wrapper.style.visibility = 'hidden';

        var category = select.options[select.selectedIndex].value;
        var url = M.cfg.wwwroot +
            '/blocks/configurable_reports/list_reports_in_category.php' +
            '?category=' + encodeURIComponent(category) +
            '&sesskey=' + encodeURIComponent(M.cfg.sesskey);

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                var list = document.createElement('select');
                list.id = 'id_reportsincategory';
                list.name = 'reportsincategory';
                list.classList.add('custom-select');
                list.style.visibility = 'hidden';

                var defaultOpt = document.createElement('option');
                defaultOpt.value = '-1';
                defaultOpt.textContent = 'Choose...';
                list.appendChild(defaultOpt);

                Object.keys(data).forEach(function(key) {
                    var opt = document.createElement('option');
                    opt.value = data[key].fullname;
                    opt.textContent = data[key].name;
                    list.appendChild(opt);
                });

                list.onchange = function() {
                    M.block_configurable_reports.onchange_reportsincategory(list);
                };

                wrapper.parentNode.replaceChild(list, wrapper);
                list.style.visibility = 'visible';
            })
            .catch(function() {
                wrapper.style.visibility = 'hidden';
            });
    },

    onchange_reportsincategory: function(select) {
        var textarea = document.getElementById('id_remotequerysql');
        var report = select.options[select.selectedIndex].value;
        var url = M.cfg.wwwroot +
            '/blocks/configurable_reports/get_remote_report.php' +
            '?reportname=' + encodeURIComponent(report) +
            '&sesskey=' + encodeURIComponent(M.cfg.sesskey);
        fetch(url)
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                textarea.value = text;
                if (editor_remotequerysql) {
                    editor_remotequerysql.setValue(text);
                }
            })
            .catch(function() {
                select.style.visibility = 'hidden';
            });
    }
};

function menuplugin(event, args) {
    var select = document.getElementById('menuplugin');
    window.location.href = args.url + select.value;
}
