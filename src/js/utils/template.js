'use strict';

var fs = require('fs');

function makeStringRenderer(templateString) {
    var render = function(data) {
        var output = templateString;
        var re = /\{\s*([-_a-zA-Z0-9]*)\s*\}/;
        var match = re.exec(output);

        if (!data)
            data = {};

        while (match) {
            var val = (match[1] in data)? data[match[1]] : '';
            output = output.replace(match[0], val);
            match = re.exec(output);
        }

        return output;
    };

    return render;
}

function makeFileRenderer(templatePath) {
    var tpl = fs.readFileSync(templatePath).toString('utf-8');

    return makeStringRenderer(tpl);
}

module.exports = {
    makeStringRenderer: makeStringRenderer,
    makeFileRenderer: makeFileRenderer
};
