(function(window, document, $, undefined){
	
	validateSelf = function(arg) {
		/* 
			Usage for inputs & textarea: $("input textarea").on("focusout", function(e){ validateSelf(this); });
			Usage for select: $("select").on("change", function(e){ validateSelf(this); });
			Behaviour: Can be attached to any text input, select, textarea. !!!Password field check is hardcoded and needs to be updated!!!
			WIP: Separate password field check from the function.
		*/
		var value = arg.value;
		var name = arg.name;
		var type = arg.type;
		var tag = arg.tagName

		// Password Field Configuration START - !Hardcoded!
		var passwordField = "NewPassword";
		var passwordFieldConfirm = "NewPasswordConfirm";
		var passwordFieldID = "#" + passwordField;
		var passwordFieldConfirmID = "#" + passwordFieldConfirm;
		// Password Field Configuration END - !Hardcoded!
		
		
		if (type === "radio" || type === "checkbox") { //ignores radio and checkbox inputs
			return false;
		}

		// Password TWO Field Check START
		if ((name.search(passwordField) !== -1) && (value === "")) { //hardcoded resets confirm password if password is deleted
	  	$(passwordFieldConfirmID).val("")
	  	validateStateEvent($(passwordFieldConfirmID)[0],"neutral");
	  }
	  if ((name.search(passwordField) !== -1) && (value !=="") && ($(passwordFieldConfirmID).val() !== "")) { //hardcoded if passwords changes recheck confirmed password
	  	verifyPassword(passwordFieldID,passwordFieldConfirmID); 
	  	return;
	  }	  	 
	  if ((name.search(passwordFieldConfirm) !== -1)) { //hardcoded checks password
	  	verifyPassword(passwordFieldID,passwordFieldConfirmID); 
	  	return;
	  }
	  // Password TWO Field Check END

	  //If FIELD is Empty
		if (value === "") { 
	    validateStateEvent(arg,"neutral");
	    return;
	  }

	  //If FIELD is Email
	  if (name.search("Email") !== -1 || name.search("E-mail") !== -1 || type === "email") { 
	    if (value.search(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/) !== -1) {
	      validateStateEvent(arg,"valid");
	    } else {      
	    	arg.value = "";
	      validateStateEvent(arg,"invalid-email");
	    }
	    return;
	  }

	  //If FIELD is Phone
	  if (name.search("Phone") !== -1 || type === "phone") { 
	    if ((value.search(/(?:\(?\+\d{2}\)?\s*)?\d+(?:[ -]*\d+)*$/) !== -1) && (value.length === 10)) {
	      validateStateEvent(arg,"valid"); 
	    } else {  	      
	      arg.value = "";
	      validateStateEvent(arg,"invalid-phone");
	    }
	    return;
	  }

	  
	  validateStateEvent(arg,"valid");
	} 

	validateStateEvent = function(arg,state) {
		/*
			Usage with objects: validateStateEvent(this,"state");
			Usage with jQuery elements: validateStateEvent($(this)[0],"state");
			Behaviour: Adds/Removes classes based on event triggered by the "state" argument of the function. Can further customized on demand.
		*/
		var classList = arg.classList;
		var correct = "input-valid"; //css class for valid input
		var error = "input-invalid"; //css class for invalid input
		var emailError = "Please fill in a valid email address."; //email invalid error message -- special event
		var phoneError = "Please fill in a valid phone number."; //phone invalid error message -- special event
		if (state === "neutral") { 
			classList.remove(error);
  		classList.remove(correct);
			return;
		}
		if (state === "valid") {
			classList.remove(error);
  		classList.add(correct);
			return;
		}
		if (state === "invalid") {
			classList.remove(correct);
  		classList.add(error);
  		return;
		}
		if (state === "invalid-email") {
			classList.remove(correct);
  		classList.add(error);
  		showTooltipster(arg,emailError);
  		return;
		}
		if (state === "invalid-phone") {
			classList.remove(correct);
  		classList.add(error);  		
	    showTooltipster(arg,phoneError);	   
  		return;
		}
		classList.add(correct);
	}

	
	showTooltipster = function(arg,message){
		/* 
			Usage: showTooltipster($(this),"A tooltip message");
			Behaviour: Show tooltips with Tooltipster that are triggered on demand and fade out after 2500ms
		*/
		$(arg).tooltipster({
	      content: message,
	   		animation: 'fade',
	   		theme: 'tooltipster-theme',
	   		arrowColor: '#000',
	   		trigger: "custom"
	    });
		$(arg).tooltipster("show");
		setTimeout(function(){
	   	$(arg).tooltipster("hide");
	  }, 2500);
	} 


	displayActiveFields = function(arg, option){
		/*
			Usage: displayActiveFields($('targetelement'),"option"); Ex: displayActiveFields($('[data-filter]'),"Alba");
			Behvaiour: Triggers show/hide events on a form based on an option !Events must be previously declared in document.ready!
		*/
		$(arg).each(function(){
      var string = $(this).attr("data-filter"); // !hardcoded - what attribute value to take    
      if (string.search(option) > -1) {
        $(this).trigger("data-visible");
      } else {
        $(this).trigger("data-hidden");
      }
    });
	} 

	verifyPassword = function(fieldone, fieldtwo){
		/* 
			Usage: verifyPassword("#NewPassword","#NewPasswordConfirm");
			Behaviour: Verify if two fields have the same value and applies logic to it. Can be extended to other fields. !!!Hardcoded password mismatch message!!!
		*/
		var password = $(fieldone).val();
		var confirmedpassword = $(fieldtwo).val();
		if (password !== confirmedpassword) {
			validateStateEvent($(fieldtwo)[0], "invalid");
			showTooltipster($(fieldtwo),"Passwords don't match");
			$(fieldtwo).val("");
			return;
		}
		if (password !== "") {
			validateStateEvent($(fieldtwo)[0], "valid");
		}
		return
	}

	verifyRequirement = function(arg){
		/* 
		  Usage: verifyRequirement($(element));
			Behaviour: Verifies if a condition has been met for the next step to take place 
			!!! Used if a general requirement can be made throughout the page. Atm it just checks value which can be done with $(arg).val() !!!			
		*/
		var target = $(arg).val();
		if (target !== "") {
			return true;
		}
		return false;
	} 


	populateRegions = function(arg){
	  $.ajax({
	      type:"POST",
	      url:"http://www.ppt.ro/Files/Extra/SirutaJudete.aspx",
	      dataType: "json",
	      data:{ judet:'all' },
	      cache: true
	    }).done(function(data){      
	    	var ID = '#' + arg;
	      var region = data;
	      var options = "";      
	      $.each(region, function(key,val){
				    options += '<option value="' + val + '">' + val + '</option>';    
				});
	      $(ID).append(options).focusout();	      
	      return;      
	    }).fail(function(){
	      alert("Error loading regions");
	    });
	}
	populateCities = function(arg){
		
		  if (region.length === 0) {
		     $('#EcomOrderCustomerCity, #EcomOrderDeliveryCity').find("option").slice(1,-1).remove();
		     $('#EcomOrderCustomerCity, #EcomOrderDeliveryCity').focusout();
		     return false;
		  }
		  $.ajax({
		      type:"POST",
		      url:"/Files/Extra/Localitati.aspx",
		      data:{localitate:'all', judet:region},
		      cache: false
		    }).done(function(data){        
		      cities = $.parseJSON(data);
		      var options = "";
		      for (var i=0; i <= cities.length - 1;  i++) {
		        options += '<option value="' + cities[i] + '">' + cities[i] + '</option>';      
		      }
		      $('#EcomOrderCustomerCity, #EcomOrderDeliveryCity').find("option").slice(1,-1).remove();
		      $('#EcomOrderCustomerCity, #EcomOrderDeliveryCity').append(options).focusout();
		      return;
		    }).fail(function(){
		        alert("Error loading cities");
		    });



	}
	populateRegionsLocal = function(arg){
	  $.ajax({
	      type:"GET",
	      url:"http://localhost:3000/assets/json/judete.json",
	      dataType: "json",
	      cache: true
	    }).done(function(data){ 
	      var region = data;
	      var options = "";  
	      $.each(region, function(key,val){
				    // do something with key and val
				    options += '<option value="' + val + '">' + val + '</option>';    
				});
	      $(arg).append(options).focusout();	      
	      return;      
	    }).fail(function(){
	      alert("Error loading regions");
	    });
	}
	populateCitiesLocal = function(arg, region){
	  $.ajax({
	  	type: "GET",
	    url:"http://localhost:3000/assets/json/localitati.json",
			cache: false
	    }).done(function(data){        
	      cities = data;
	      var options = "";
	      $.each(cities, function(key,val){
			    options += '<option value="' + val + '">' + val + '</option>';    
			});
	      $(arg).find("option").slice(1,-1).remove();
	      $(arg).append(options).focusout();
	      return;
	    }).fail(function(){
	        alert("Error loading cities");
	    });
	}

	constructValidationObject = function(arg, options){
		var sendForm = {};
		sendForm.inputList = [];
		sendForm.validationList = [];
		$(arg).find("input, select, textarea").each(function(){
			var type = $(this)[0].type;
			var name = $(this).attr("name");			
			if (!$(this).prop("disabled")) {				
				sendForm.validationList.push(name);
			}
		});
		return sendForm;
	}

})(window, document, jQuery);

$(document).ready(function(){

	//Form Pick Show/Hide Event
	$('[data-filter]').on("data-visible", function(){
    $(this).show();
    $(this).find('input, select, textarea').each(function(){
      $(this).removeAttr("disabled");
    });
  }).on("data-hidden", function(){
  		$(this).hide();
    	$(this).find('input, select, textarea').each(function(){
      	$(this).attr("disabled","");
   		 });
  });


	//Main Thread
	var form = $("#accountCreation");

	$("input, textarea").on("focusout", function(e){
		validateSelf(this);
	});
	$("select").on("change", function(e){
		validateSelf(this);
	});

	//On Submit Click
	form.find("button").on("click", function(e){
		e.preventDefault();
		var terms = $('#terms').prop("checked");
		if (terms !== true) {
			alert("You need to agree the Terms & Conditions to continue.");
			return ;
		}
		alert("Success ! Form submitted");
	});

	//Form Pick Trigger
	var trigger = $("#AccountType");
	displayActiveFields("[data-filter]",trigger.val()); //Trigger Pick OnLoad
  trigger.on("change", function(e){
  	var value = e.target.value;
  	if (value === "") {
  		return;
  	}
    displayActiveFields("[data-filter]", value);
  });

  //Populate State/City
  populateRegionsLocal("#State");
  $("#City").addClass("disabled")
  $('#City').on("mouseenter",function(e){
  	e.preventDefault();
  	var $this = $(this);
  	if ($this.hasClass("disabled")) {
  		showTooltipster($this,"Please select a State first.");
  	}
  })
  $("#State").on("change",function(){
  	var value = $(this).val();
  	var city = 	$("#City");
  	if (value === "") {
  		city.find("option").slice(1,-1).remove();
  		city.addClass("disabled");
  		validateStateEvent(city[0],"neutral");
  	} else {
  		city.find("option").slice(1,-1).remove();
  		city.removeClass("disabled");
  		populateCitiesLocal("#City");
  	}
  });
  

  // populateCitiesLocal("City");

  // form.on("checkType", function(){
  //   sendForm = new {listInput,listValidation};
  //   sendForm.listInput = [];
  //   sendForm.listValidation = [];
  //   $(this).find("input:checked");
  //   var option = $(this).find("input:checked").val();   
  //   $('[data-send]').each(function(){
  //     var string = $(this).attr("data-send");   
  //     if (string.search(option) > -1) {
  //       $(this).trigger("data-visible");
  //       $(this).find('input, select, textarea').each(function(){
  //         var name = $(this).attr("name");
  //         sendForm.listInput.push(name); 
  //         if ($(this).attr("required")) {
  //           sendForm.listValidation.push(name);
  //         }         
  //       });
  //     } else {
  //       $(this).trigger("data-hidden");       
  //     }
  //   }); 
  //   console.dir(sendForm);
  //   return sendForm;
  // }); //checkout form type event


});