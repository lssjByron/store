/**
* RESTService
* - service to process all REST calls for the application from
* Glassfish Server's JAX-RS resources
*/
var RESTService = (function () {
    /**
    * constructor - values supplied by static injection
    * @param http: angular http service
    * @param location: angular q (promise) service
    */
    function RESTService(http, q) {
        this.http = http;
        this.q = q;
        //class members
        this.baseUrl = "case1/";
    }
    /**
    * callServer - workhorse method to call JAX-RS service on Server
    * @param action: GET, POST, PUT, DELETE
    * @param url: server side JAX-RS resource to invoke
    * @param id: id of model to put or delete
    * @param model: model data to post or put
    * @returns deferred task's promise
    */
    RESTService.prototype.callServer = function (action, url, id, model) {
        var defTask = this.q.defer(); // defTask used to return a promise to caller
        switch (action) {
            case "get":
                this.http.get(this.baseUrl + url) // IHttpService call returns it's own promise
                    .then(function (success) { return defTask.resolve(success.data); }) //load restsvc promise with data
                    .catch(function (error) { return defTask.reject("server error"); }); // load restvc promise with failure
                break; // get
            case "post":
                this.http.post(this.baseUrl + url, model)
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("server error"); });
                break; //post
            case "put":
                this.http.put(this.baseUrl + url, model)
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("server error"); });
                break; //put
            case "delete":
                this.http.delete(this.baseUrl + url + "/" + id)
                    .then(function (success) { return defTask.resolve(success.data); })
                    .catch(function (error) { return defTask.reject("server error"); });
                break; //delete
        } //switch
        return defTask.promise; // return restsvc promise
    }; //callServer
    //static injection
    RESTService.$inject = ["$http", "$q"];
    return RESTService;
})();
// add this Service to the application
app.service("RESTService", RESTService);
//# sourceMappingURL=rest.service.js.map