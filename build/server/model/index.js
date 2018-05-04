"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var dynamo = require('dynamodb');
dynamo.AWS.config.update({
    accessKeyId: 'AKIAIPMZTEODQOZYSNQA',
    region: 'eu-west-1',
    secretAccessKey: '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'
});
__export(require("./event"));
__export(require("./user"));
exports.createTables = function () {
    dynamo.createTables(function (err) {
        if (err) {
            console.log('Error creating tables: ', err);
        }
        else {
            console.log('Tables have been created');
        }
    });
};
//# sourceMappingURL=index.js.map