/**
* RESTService
* - service to process all REST calls for the application from
* Glassfish Server's JAX-RS resources
*/
class RESTService {
    //static injection
    static $inject = ["$http", "$q"];

    //class members
    baseUrl: string = "http://localhost:8080/APPOCase1/case1/";

    /**
    * constructor - values supplied by static injection
    * @param http: angular http service
    * @param location: angular q (promise) service
    */
    constructor(public http: ng.IHttpService, public q: ng.IQService) { }

    /**
    * callServer - workhorse method to call JAX-RS service on Server
    * @param action: GET, POST, PUT, DELETE
    * @param url: server side JAX-RS resource to invoke
    * @param id: id of model to put or delete
    * @param model: model data to post or put
    * @returns deferred task's promise
    */
    public callServer(action: string, url?: string, id?: string, model?: any) {

        var defTask = this.q.defer(); // defTask used to return a promise to caller

        switch (action) {
            case "get":
                this.http.get(this.baseUrl + url) // IHttpService call returns it's own promise
                    .then((success: any) => defTask.resolve(success.data))  //load restsvc promise with data
                    .catch((error: any) => defTask.reject("server error")); // load restvc promise with failure
                break; // get
            case "post":
                this.http.post(this.baseUrl + url, model)
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("server error"));
                break; //post
            case "put":
                this.http.put(this.baseUrl + url, model)
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("server error"));
                break; //put
            case "delete":
                this.http.delete(this.baseUrl + url + "/" + id)
                    .then((success: any) => defTask.resolve(success.data))
                    .catch((error: any) => defTask.reject("server error"));
                break; //delete
        }//switch

        return defTask.promise; // return restsvc promise
    } //callServer
}

// add this Service to the application
app.service("RESTService", RESTService);