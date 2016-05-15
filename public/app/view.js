define(["models", "jquery","Handlebars"],function(models, $, Handlebars){

	var localData = {};
	function CartModel() {

        this.p_id = "";
        this.p_name = "";
        this.p_price = "";
        this.p_originalprice = "";
        this.p_gender = "";
        this.p_style = "";
        this.p_discount_percent = "";
        this.p_image = "";
        this.p_is_flat_discount = "";
        this.p_selected_color = {};
        this.p_selected_size = {};
        this.c_currency = "";
        this.p_quantity = "";
    }

    function registerListeners() {
        $("#cart-holder").on("change", ".quantity-fld", function (event) {
            var p_id = event.currentTarget.id.split("_")[3];
            if (event.currentTarget.value < 0)
            {
                $("#cart-" + p_id + " .quantity-fld").val(0);
            }
            else {
                $("#cart-" + p_id + " .quantity-fld").val(event.currentTarget.value);
                updateCartData(p_id, event.currentTarget.value, "update");
                
            } 
        });
        
        $("#apply-promotion").on("click", function (event) {

           	var promoCode = $("#promo-code").val().trim();
           	var discountPercent = verifyPromo(promoCode);
           	if(discountPercent === 0){
           		$(".is-promotion-code-applied").css("display", "none");
           		models.setDiscount(null);
           	}
           	else{
           		$(".is-promotion-code-applied").css("display", "table-row");

           		

		        $(".fill-promotion-code").empty();
		        var pcodeObject = { promoCode: promoCode };
		        template = Handlebars.compile("{{promoCode}}");
		        $(".fill-promotion-code").html(template(pcodeObject));
		        models.setDiscount(discountPercent);
		        
           	}
           	cartItemsTotalAmount();
            return false;
        });
        $("#cart-holder").on("click", ".x_remove", function (event) {

            var p_id = event.currentTarget.id.split("_")[2];

            updateCartData(p_id, "", "delete");
            return false;
        });
    }
    function verifyPromo(promoCode){
    	var discountPercent = 0;
    	var promoCodeList = models.getPromos();
    	if(promoCodeList.length > 0){

    		for(var obj in promoCodeList){
    			var codeObject = promoCodeList[obj];
    			if(codeObject.p_offer_code === promoCode){
    				discountPercent = codeObject.p_discount_percent;
    				break;
    			}
    		}
    	}
    	
    	return discountPercent;
    }
    function cartItemsTotalAmount() {

        var totalCartItem = localData.filterItems.length;
        var totalAmount = 0;
        var promoDiscount = 0;
        var discountAmount = 0;
        for (var i = 0; i < totalCartItem; i++) {

        	var flatDiscount = Number(localData.filterItems[i].p_is_flat_discount);
        	var discountPercent = (flatDiscount >0 ) ? (Number(localData.filterItems[i].p_discount_percent) + flatDiscount) : Number(localData.filterItems[i].p_discount_percent);
        	var totalAmountWithQuantity = Number(Number(localData.filterItems[i].p_price) * Number(localData.filterItems[i].p_quantity));
        	var discountedPrice = (discountPercent > 0) ? (totalAmountWithQuantity * discountPercent) : 0;
        	var percentMinusAmount = Number(Number(totalAmountWithQuantity) - Number(discountedPrice));
        	
            totalAmount = totalAmount + percentMinusAmount;
        }
        
        if (models.getDiscount() !== null) {
        	
            promoDiscount = totalAmount * Number(models.getDiscount());

        }
       

        $(".sub-total").empty();
        var amountObject = { subTotal: totalAmount };
        template = Handlebars.compile("{{decimal subTotal}}");
        $(".sub-total").html(template(amountObject));

        if(promoDiscount >0 ){
        	$(".promo-discount").empty();
	        var pamountObject = { promoDiscount: promoDiscount };
	        var template = Handlebars.compile("{{decimal promoDiscount}}");
	        $(".promo-discount").html(template(pamountObject));
        }
        
        

        $(".estimated-total").empty();
        var eTotalObject = { estimatedTotal: Number(totalAmount - promoDiscount) };
        template = Handlebars.compile("{{decimal estimatedTotal}}");
        $(".estimated-total").html(template(eTotalObject));

        $(".item-count").empty();
        var totalCart = { totalCartItem: totalCartItem };
        template = Handlebars.compile("{{totalCartItem}}");
        $(".item-count").html(template(totalCart));
       
    }
    function populateProduct() {

    	var  data = models.getProduct();
        var tempArray = [];
        for (var objLevel1 in data)
        {
            var cModel = new CartModel();
            var mObj = data[objLevel1];
            for (var objLevel2 in mObj) { 
                for (var obj in cModel) {
                    if (objLevel2 === obj) {
                        cModel[obj] = mObj[objLevel2];                        
                    }
                }
            }
            tempArray.push(cModel);
        }
        localData = { filterItems: tempArray};    

        if(tempArray.length> 0){
        	var templateSource = $("#cart-template").html();
	        var template = Handlebars.compile(templateSource);

	        $("#cart-holder").empty();
	        var html = template(localData);
	        $("#cart-holder").html(html);   
	        registerListeners();
        	cartItemsTotalAmount(); 
        }
       
    }
    function updateCartData(p_id, value, action) {
        
        if (action === "update") {
            for (var i = 0; i < localData.filterItems.length; i++) {
                if (localData.filterItems[i].p_id === p_id) {
                    var objq = localData.filterItems[i];
                    objq.p_quantity = value;
                    localData.filterItems[i] = objq;
                    break;
                }
            }
            
        }
        if (action === "delete") {
            for (var i = 0; i < localData.filterItems.length; i++) {
                if (localData.filterItems[i].p_id === p_id) {

                    localData.filterItems.splice(i, 1);
                    break;
                }
            }
            
            populateProductList();
        }
        cartItemsTotalAmount();

    }
	function initView(){
		/*Helpers*/
        Handlebars.registerHelper('decimal', function (number) {
            return parseFloat(Math.round(number * 100) / 100).toFixed(2);
        });
        Handlebars.registerHelper('ifComp', function (v1, operator, v2, options) {
            switch (operator) {
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    break;
                default:
                    return options.inverse(this);
                
            }
        
        });
		$(document).ready(function () {
			populateProduct();
		});
       
	}
	function populateProductList() {
       
        var templateSource = $("#cart-template").html();
        var template = Handlebars.compile(templateSource);
        $("#cart-holder").empty();
        var html = template(localData);
        $("#cart-holder").html(html);

        registerListeners();
        cartItemsTotalAmount();
    }
	return{
		initView: initView
	}
});
