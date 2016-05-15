define(function(){

	var product = null;
	var promos = null;
	var discount = null;

	function getProduct()
	{
		return product;
	}
	function setProduct(val)
	{
		product =  val;
	}

	function getDiscount(){
		return discount;  
	}

	function setDiscount(val){
		discount = val;
	}

	function getPromos()
	{
		return promos;
	}
	function setPromos(val)
	{
		promos =  val;
	}

	return{

		setProduct: setProduct,
		getProduct: getProduct,
		setPromos: setPromos,
		getPromos: getPromos,
		getDiscount: getDiscount,
		setDiscount: setDiscount
	}
});
