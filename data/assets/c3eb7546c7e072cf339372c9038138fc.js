;/* js/util.js */
function bz_findPosX(obj)
{
var curleft = 0;
if (obj.offsetParent) {
while (obj) {
curleft += obj.offsetLeft;
obj = obj.offsetParent;
}
}
else if (obj.x) {
curleft += obj.x;
}
return curleft;
}
function bz_findPosY(obj)
{
var curtop = 0;
if (obj.offsetParent) {
while (obj) {
curtop += obj.offsetTop;
obj = obj.offsetParent;
}
}
else if (obj.y) {
curtop += obj.y;
}
return curtop;
}
function bz_getFullHeight(fromObj)
{
var scrollY;
if (fromObj.scrollHeight > fromObj.offsetHeight) {
scrollY = fromObj.scrollHeight;
}  else {
scrollY = fromObj.offsetHeight;
}
return scrollY;
}
function bz_getFullWidth(fromObj)
{
var scrollX;
if (fromObj.scrollWidth > fromObj.offsetWidth) {
scrollX = fromObj.scrollWidth;
}  else {
scrollX = fromObj.offsetWidth;
}
return scrollX;
}
function bz_overlayBelow(item, parent) {
var elemY = bz_findPosY(parent);
var elemX = bz_findPosX(parent);
var elemH = parent.offsetHeight;
item.style.position = 'absolute';
item.style.left = elemX + "px";
item.style.top = elemY + elemH + 1 + "px";
}
function bz_isValueInArray(aArray, aValue)
{
for (var run = 0, len = aArray.length ; run < len; run++) {
if (aArray[run] == aValue) {
return true;
}
}
return false;
}
function bz_isValueInArrayIgnoreCase(aArray, aValue)
{
var re = new RegExp(aValue.replace(/([^A-Za-z0-9])/g, "\\$1"), 'i');
for (var run = 0, len = aArray.length ; run < len; run++) {
if (aArray[run].match(re)) {
return true;
}
}
return false;
}
function bz_createOptionInSelect(aSelect, aTextValue, aValue) {
var myOption = new Option(aTextValue, aValue);
aSelect.options[aSelect.length] = myOption;
return myOption;
}
function bz_clearOptions(aSelect) {
var length = aSelect.options.length;
for (var i = 0; i < length; i++) {
aSelect.removeChild(aSelect.options[0]);
}
}
function bz_populateSelectFromArray(aSelect, aArray) {
bz_clearOptions(aSelect);
for (var i = 0; i < aArray.length; i++) {
var item = aArray[i];
bz_createOptionInSelect(aSelect, item[1], item[0]);
}
}
function bz_valueSelected(aSelect, aValue) {
var options = aSelect.options;
for (var i = 0; i < options.length; i++) {
if (options[i].selected && options[i].value == aValue) {
return true;
}
}
return false;
}
function bz_selectedOptions(aSelect) {
if (aSelect.selectedOptions) {
return aSelect.selectedOptions;
}
var start_at = aSelect.selectedIndex;
if (start_at == -1) return [];
var first_selected =  aSelect.options[start_at];
if (!aSelect.multiple) return first_selected;
var selected = [first_selected];
var options_length = aSelect.options.length;
for (var i = start_at + 1; i < options_length; i++) {
var this_option = aSelect.options[i];
if (this_option.selected) selected.push(this_option);
}
return selected;
}
function bz_preselectedOptions(aSelect) {
var options = aSelect.options;
var selected = new Array();
for (var i = 0, l = options.length; i < l; i++) {
var attributes = options[i].attributes;
for (var j = 0, m = attributes.length; j < m; j++) {
if (attributes[j].name == 'selected') {
if (!aSelect.multiple) return options[i];
selected.push(options[i]);
}
}
}
return selected;
}
function bz_optionIndex(aSelect, aValue) {
for (var i = 0; i < aSelect.options.length; i++) {
if (aSelect.options[i].value == aValue) {
return i;
}
}
return -1;
}
function bz_fireEvent(anElement, anEvent) {
if (document.createEvent) {
var evt = document.createEvent("HTMLEvents");
evt.initEvent(anEvent, true, true);
return !anElement.dispatchEvent(evt);
} else {
var evt = document.createEventObject();
return anElement.fireEvent('on' + anEvent, evt);
}
}
function bz_toggleClass(anElement, aClass) {
if (YAHOO.util.Dom.hasClass(anElement, aClass)) {
YAHOO.util.Dom.removeClass(anElement, aClass);
}
else {
YAHOO.util.Dom.addClass(anElement, aClass);
}
}
