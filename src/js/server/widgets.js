import express from 'express';

const widgets = express.Router();

widgets.get('/action_response', function(req, res) {
    res.send('{}');
});

widgets.get('/organizer_notes', function(req, res) {
    res.send('{}');
});

widgets.get('/today', function(req, res) {
    res.send('{}');
});

widgets.get('/upcoming_actions', function(req, res) {
    res.send('{}');
});

export default widgets;
