/**
 * HomeController
 * - controller for home.html partial
 */
class HomeController {
    label: string;

    constructor() {
        this.label = "Byron";
    } 
}
app.controller("HomeController", [HomeController]);