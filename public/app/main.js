requirejs.config({
    "paths": {
      "jquery": "../components/jquery/dist/jquery.min",
      "Handlebars": "../components/handlebars/handlebars.min"
    }
});


require(["app"],function(app){
  app.init();
});