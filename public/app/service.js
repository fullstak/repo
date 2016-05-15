define(["models","jquery","view"],function(models,$,view){

	var jsonProductUrl = "../data/products.json";
    var jsonPromoUrl = "../data/promodiscount.json";

    function fetchProduct(){
        $.getJSON(jsonProductUrl, function (data) {               
            var items = data.productsInCart.map(function (item) {
                return item;
                });
                models.setProduct(items);
                fetchPromos();
            }).error(function (error) {
                console.log(error);
            });
    }
    function fetchPromos(){
        $.getJSON(jsonPromoUrl, function (data) {               
                var items = data.promo.map(function (item) {
                    return item;
                });
                models.setPromos(items);
                view.initView();
            }).error(function (error) {
                console.log(error);
            });
    }

	return{
		fetchProduct: fetchProduct,
        fetchPromos: fetchPromos
	}
});
