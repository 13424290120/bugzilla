;/* js/bug.js */
YAHOO.bugzilla.dupTable = {
counter: 0,
dataSource: null,
updateTable: function(dataTable, product_name, summary_field) {
if (summary_field.value.length < 4) return;
YAHOO.bugzilla.dupTable.counter = YAHOO.bugzilla.dupTable.counter + 1;
YAHOO.util.Connect.setDefaultPostHeader('application/json', true);
var json_object = {
version : "1.1",
method : "Bug.possible_duplicates",
id : YAHOO.bugzilla.dupTable.counter,
params : {
Bugzilla_api_token: BUGZILLA.api_token,
product : product_name,
summary : summary_field.value,
limit : 7,
include_fields : [ "id", "summary", "status", "resolution",
"update_token" ]
}
};
var post_data = YAHOO.lang.JSON.stringify(json_object);
var callback = {
success: dataTable.onDataReturnInitializeTable,
failure: dataTable.onDataReturnInitializeTable,
scope:   dataTable,
argument: dataTable.getState()
};
dataTable.showTableMessage(dataTable.get("MSG_LOADING"),
YAHOO.widget.DataTable.CLASS_LOADING);
YAHOO.util.Dom.removeClass('possible_duplicates_container',
'bz_default_hidden');
dataTable.getDataSource().sendRequest(post_data, callback);
},
doUpdateTable: function(e, args) {
var dt = args[0];
var product_name = args[1];
var summary = YAHOO.util.Event.getTarget(e);
clearTimeout(YAHOO.bugzilla.dupTable.lastTimeout);
YAHOO.bugzilla.dupTable.lastTimeout = setTimeout(function() {
YAHOO.bugzilla.dupTable.updateTable(dt, product_name, summary) },
600);
},
formatBugLink: function(el, oRecord, oColumn, oData) {
el.innerHTML = '<a href="show_bug.cgi?id=' + oData + '">'
+ oData + '</a>';
},
formatStatus: function(el, oRecord, oColumn, oData) {
var resolution = oRecord.getData('resolution');
var bug_status = display_value('bug_status', oData);
if (resolution) {
el.innerHTML = bug_status + ' '
+ display_value('resolution', resolution);
}
else {
el.innerHTML = bug_status;
}
},
formatCcButton: function(el, oRecord, oColumn, oData) {
var url = 'process_bug.cgi?id=' + oRecord.getData('id')
+ '&addselfcc=1&token=' + escape(oData);
var button = document.createElement('a');
button.setAttribute('href',  url);
button.innerHTML = YAHOO.bugzilla.dupTable.addCcMessage;
el.appendChild(button);
new YAHOO.widget.Button(button);
},
init_ds: function() {
var new_ds = new YAHOO.util.XHRDataSource("jsonrpc.cgi");
new_ds.connTimeout = 30000;
new_ds.connMethodPost = true;
new_ds.connXhrMode = "cancelStaleRequests";
new_ds.maxCacheEntries = 3;
new_ds.responseSchema = {
resultsList : "result.bugs",
metaFields : { error: "error", jsonRpcId: "id" }
};
new_ds.doBeforeParseData =
function(oRequest, oFullResponse, oCallback) {
if (oFullResponse.error) {
oFullResponse.result = {};
oFullResponse.result.bugs = [];
if (console) {
console.log("JSON-RPC error:", oFullResponse.error);
}
}
return oFullResponse;
}
this.dataSource = new_ds;
},
init: function(data) {
if (this.dataSource == null) this.init_ds();
data.options.initialLoad = false;
var dt = new YAHOO.widget.DataTable(data.container, data.columns,
this.dataSource, data.options);
YAHOO.util.Event.on(data.summary_field, 'keyup', this.doUpdateTable,
[dt, data.product_name]);
}
};
function set_assign_to(use_qa_contact) {
var form = document.Create;
var assigned_to = form.assigned_to.value;
if (use_qa_contact) {
var qa_contact = form.qa_contact.value;
}
var index = -1;
if (form.component.type == 'select-one') {
index = form.component.selectedIndex;
} else if (form.component.type == 'hidden') {
index = 0;
}
if (index != -1) {
var owner = initialowners[index];
var component = components[index];
if (assigned_to == last_initialowner
|| assigned_to == owner
|| assigned_to == '') {
form.assigned_to.value = owner;
last_initialowner = owner;
}
document.getElementById('initial_cc').innerHTML = initialccs[index];
document.getElementById('comp_desc').innerHTML = comp_desc[index];
if (use_qa_contact) {
var contact = initialqacontacts[index];
if (qa_contact == last_initialqacontact
|| qa_contact == contact
|| qa_contact == '') {
form.qa_contact.value = contact;
last_initialqacontact = contact;
}
}
var flag_rows = YAHOO.util.Dom.getElementsByClassName('bz_flag_type', 'tbody');
for (var i = 0; i < flag_rows.length; i++) {
var flag_select = YAHOO.util.Dom.getElementsByClassName('flag_select',
'select',
flag_rows[i])[0];
var type_id = flag_select.id.split('-')[1];
var can_set = flag_select.options.length > 1 ? 1 : 0;
var show = 0;
for (var j = 0; j < flags[index].length; j++) {
if (flags[index][j] == type_id) {
show = 1;
break;
}
}
if (show && can_set) {
flag_select.disabled = false;
YAHOO.util.Dom.removeClass(flag_rows[i], 'bz_default_hidden');
} else {
flag_select.disabled = true;
YAHOO.util.Dom.addClass(flag_rows[i], 'bz_default_hidden');
}
}
}
}
(function(){
'use strict';
var JSON = YAHOO.lang.JSON;
YAHOO.bugzilla.bugUserLastVisit = {
update: function(bug_id) {
var args = JSON.stringify({
version: "1.1",
method: 'BugUserLastVisit.update',
params: {
Bugzilla_api_token: BUGZILLA.api_token,
ids: bug_id
}
});
var callbacks = {
failure: function(res) {
if (console)
console.log("failed to update last visited: "
+ res.responseText);
}
};
YAHOO.util.Connect.setDefaultPostHeader('application/json', true);
YAHOO.util.Connect.asyncRequest('POST', 'jsonrpc.cgi', callbacks,
args)
},
get: function(done) {
var args = JSON.stringify({
version: "1.1",
method: 'BugUserLastVisit.get',
params: {
Bugzilla_api_token: BUGZILLA.api_token
}
});
var callbacks = {
success: function(res) { done(JSON.parse(res.responseText)) },
failure: function(res) {
if (console)
console.log("failed to get last visited: "
+ res.responseText);
}
};
YAHOO.util.Connect.setDefaultPostHeader('application/json', true);
YAHOO.util.Connect.asyncRequest('POST', 'jsonrpc.cgi', callbacks,
args)
}
};
})();
