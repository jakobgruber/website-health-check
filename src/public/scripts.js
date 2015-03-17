(function() {

    function ResultPanel() {
        var el = document.getElementById('result-panel');
        var msgTemplateScript = document.getElementById('new-msg-template').innerHTML;
        var resultTemplateScript = document.getElementById('new-result-template').innerHTML;

        var msgTemplate = Handlebars.compile(msgTemplateScript);
        var resultTemplate = Handlebars.compile(resultTemplateScript);

        this.clearPanel = function() {
            el.innerHTML = "";
        };

        this.addStatus = function(statusMsg) {
            var context = {
                class: 'status-msg',
                msg: statusMsg
            };

            el.innerHTML += msgTemplate(context);
        };

        this.addError = function(errorMsg) {
            var context = {
                class: 'error-msg',
                msg: errorMsg
            };

            el.innerHTML += msgTemplate(context);
        };

        this.addResult = function(result) {
            var context = {
                feedUrl: result.feedUrl,
                successCount: result.successCount,
                failedCount: result.failedCount
            };

            el.innerHTML += resultTemplate(context);
        };

    }

    function ServerWrapper() {
        var socket = io();

        this.setupServerListeners = function(resultPanel) {
            socket.on('new-status', resultPanel.addStatus);
            socket.on('new-error', resultPanel.addError);
            socket.on('new-result', resultPanel.addResult);
        };

        this.sendNewCheckRequest = function() {
            socket.emit('start-new-url-check');
        };
    }

    function MainPanel(resultPanel, serverWrapper) {
        var startBtn = document.getElementById('start-check');

        this.init = function() {
            startBtn.addEventListener('click', startNewCheck, false);
            serverWrapper.setupServerListeners(resultPanel);
        };

        var startNewCheck = function() {
            resultPanel.clearPanel();
            serverWrapper.sendNewCheckRequest();
        };
    }

    var resultPanel = new ResultPanel();
    var serverWrapper = new ServerWrapper();

    var mainPanel = new MainPanel(resultPanel, serverWrapper);
    mainPanel.init();
})();