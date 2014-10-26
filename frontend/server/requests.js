getRequest = function(serverHost, serverPort, path, next) {
    var url = serverHost + ":" + serverPort + path;
    Meteor.http.call("GET", url, function(error, result) {
        next(error, result);
    });
};

postRequest = function(serverHost, serverPort, path, object, next) {
    var url = serverHost + ":" + serverPort + path;
    Meteor.http.call("POST", url, {
        data: object
    }, function(error, result) {
        next(error, result);
    });
};

deleteRequest = function(serverHost, serverPort, path, next) {
    var url = serverHost + ":" + serverPort + path;
    Meteor.http.call("DELETE", url, function(error, result) {
        next(error, result);
    });
};
