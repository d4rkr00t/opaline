"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function indent(text, level = 1) {
    return `${"".padStart(level * 2, " ")}${text}`;
}
exports.indent = indent;
function print(text, level = 1) {
    if (Array.isArray(text)) {
        text.forEach(item => {
            if (Array.isArray(item)) {
                print(item, level + 1);
            }
            else {
                console.log(indent(item, level));
            }
        });
    }
    else {
        console.log(indent(text, level));
    }
}
exports.print = print;
function printList(list, formatTitle = s => s, customMinLength = 0) {
    let minLength = Math.max(list.reduce((acc, item) => (item[0].length > acc ? item[0].length : acc), 0) + 4, customMinLength);
    return list.reduce((acc, item) => acc.concat(formatTitle(item[0].padEnd(minLength, " ")) + item[1]), []);
}
exports.printList = printList;
