'use strict';

var test = require('tape');
var template = require('../zetkin/utils/template');

test('string template (with whitespace)', function(t) {
    var tpl = '<h1>{ template_var }</h1>';
    var render = template.makeStringRenderer(tpl);
    var output = render({ template_var: 'foo' });

    t.equal(output, '<h1>foo</h1>');
    t.end();
});

test('string template (no whitespace)', function(t) {
    var tpl = '<h1>{template_var}</h1>';
    var render = template.makeStringRenderer(tpl);
    var output = render({ template_var: 'foo' });

    t.equal(output, '<h1>foo</h1>');
    t.end();
});

test('string template (no data)', function(t) {
    var tpl = '<h1>{ template_var }</h1>';
    var render = template.makeStringRenderer(tpl);
    var output = render();

    t.equal(output, '<h1></h1>');
    t.end();
});

test('file template', function(t) {
    var render = template.makeFileRenderer('tests/misc/template.html');
    var output = render({ template_var: 'foo' });

    t.equal(output, '<h1>foo</h1>\n');
    t.end();
});
