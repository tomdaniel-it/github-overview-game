module.exports = function(app) {
    app.get('/notes', (req, res)=>{
        let testObj = {
            name:"Name",
            description:"THIS IS A DESCRIPTION MAANNN"
        };
        res.send(JSON.stringify(testObj));
    });

    app.get("*", (req, res)=>{
        sendError(res, 404, "This page does not exist.");
    });

    app.post("*", (req, res)=>{ sendError(res, 404, "You cannot POST to this API."); });
    app.head("*", (req, res)=>{ sendError(res, 404, "You cannot HEAD to this API."); });
    app.put("*", (req, res)=>{ sendError(res, 404, "You cannot PUT to this API."); });
    app.delete("*", (req, res)=>{ sendError(res, 404, "You cannot DELETE to this API."); });
    app.trace("*", (req, res)=>{ sendError(res, 404, "You cannot TRACE to this API."); });
    app.options("*", (req, res)=>{ sendError(res, 404, "You cannot OPTIONS to this API."); });
    app.connect("*", (req, res)=>{ sendError(res, 404, "You cannot CONNECT to this API."); });
    app.patch("*", (req, res)=>{ sendError(res, 404, "You cannot PATCH to this API."); });
    app.link("*", (req, res)=>{ sendError(res, 404, "You cannot LINK to this API."); });

    function sendError(res, statusCode, errorMessage){
        res.send({statusCode:statusCode, errorMessage:errorMessage}, statusCode);
    }
}