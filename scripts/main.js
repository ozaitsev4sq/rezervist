// order filter

$(document).ready(function () {
	$("#order-search").on("keyup", function () {
		var value = $(this).val().toLowerCase();
		$(".order-header").filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});
});

$(".order-header").click(function () {

	$header = $(this);

	$content = $header.next();

	$content.slideToggle(300, function () {

		$header.text(function () {

			//return $content.is(":visible") ? "Collapse" : "Expand";
		});
	});

});




$(document).on('click', 'a[href^="#"]', function (event) {
	event.preventDefault();
	$('html, body').animate({
		scrollTop: $($.attr(this, 'href')).offset().top
	}, 500);
});

function Get_NP_Towns(data) {


	let townsDropdown = document.getElementById('Cities');
	let selectedDepartment = document.getElementById('Dep');

	if (data != 1) {
		townsDropdown.innerHTML = null;
		townsDropdown.value = null;
		townsDropdown.textContent = null;
		selectedDepartment.value = null;
		selectedDepartment.textContent = null;
		selectedDepartment.required = false;
		return;
	}
	let currentValue = document.getElementById('city').value;
	
	if (currentValue.length !== 0) {
		Get_NP_Departments(currentValue)
	}

	selectedDepartment.required = true;
	$.ajax({
		type: "POST",
		url: "/umbraco/surface/values/GetNovaPoshtaDepartments",
		success: function (context) {
			let fragment = document.createDocumentFragment();
			let newOption;
			for (let i = 0; i < context.length; i++) {
				newOption = document.createElement("option");
				newOption.value = context[i];
				newOption.textContent = context[i];
				fragment.appendChild(newOption);
			}
			townsDropdown.appendChild(fragment);
			//return context;
		},
		error: function (context) {
		}
	});
};

function Get_NP_Departments(town) {

	let departmentsDropdown = document.getElementById('dep');
	departmentsDropdown.innerHTML = '';
	departmentsDropdown.value = '';
	departmentsDropdown.textContent = '';


	let selectedDepartment = document.getElementById('Dep');
	selectedDepartment.value = '';
	selectedDepartment.textContent = '';


	if (town === '' || town === null || town === undefined) {
		return;
	}

	$.ajax({
		type: "POST",
		url: `/umbraco/surface/values/GetNovaPoshtaDepartments/`,
		data: { town },
		success: function (context) {
			if (context.length == 1) {
				selectedDepartment.value = context[0];
				selectedDepartment.textContent = context[0];
			}

			let fragment = document.createDocumentFragment();
			let newOption;
			for (let i = 0; i < context.length; i++) {
				newOption = document.createElement("option");
				newOption.value = context[i];
				newOption.textContent = context[i];
				fragment.appendChild(newOption);
			}
			departmentsDropdown.appendChild(fragment);
		},
		error: function (context) {
		}
	});
};

$(document).ready(function () {

	$(window).scroll(function () {
		var btn = $('.NavHelper');
		if ($(window).scrollTop() >= 300 && !btn.hasClass('showBut')) {
			btn.addClass('showBut');
			btn.fadeIn();
			//console.log('300px');
		} else if ($(window).scrollTop() < 300) {
			btn.removeClass('showBut');
		}
	});


	let formError = $(".form-error");

	$('.order-form').submit(function (e) {
		e.preventDefault();

		let loader = $(".loader-cart").show(400);



		var form = $(this);
		var url = form.attr('action');

		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			data: form.serialize(),
			success: function (res) {
				console.log(res);
				$(".loader-cart").hide(400);
				if (res.Done) {
					if (res.Model.Done) {
						window.location.replace(window.location.origin + "/thanks");
					} else {
						let htmlString = `<form id="lqform" action="https://www.liqpay.ua/api/3/checkout" name="checkout" method="post" style="display:none;"><input type="text" name="data" value="${res.Model.data}" /><input type="text" name="signature" value="${res.Model.signature}" /></form>`;
						document.querySelector('#data-form').insertAdjacentHTML('beforeend', htmlString);

						$('#lqform').submit();
					}
				} else {
					$(".loader-cart").hide(400);
				}

			}
		});
	});

	$('.deliveryType').click(function () {

		if ($(this).val() == 1) {
			$('.np-group').removeClass('d-none');
			$('.other-group').addClass('d-none');


			$('.other-group .sign-input-group .sign-input').each(function () {
				$(this).attr("required", false);
			});
		} else if ($(this).val() == 3) {
			$('.other-group').addClass('d-none');
			$('.np-group').addClass('d-none');

		}
		else if (($(this).val() == 4)) {
			$('.other-group').removeClass('d-none');
			$('.region').addClass('d-none');
			$('.np-group').addClass('d-none');
			$('.other-group .sign-input-group .sign-input').each(function () {
				$(this).attr("required", true);
			});
			$('.region .sign-input-group .sign-input').each(function () {
				$(this).attr("required", false);
			});

		}
		else {
			$('.np-group').addClass('d-none');
			$('.other-group').removeClass('d-none');
			$('.region').removeClass('d-none');
			$('.other-group .sign-input-group .sign-input').each(function () {
				$(this).attr("required", true);
			});
		}
	});

	$('.sort-way-btn').click(function () {
		$('.sort-way-modal_overlay').removeClass('d-none');
	});

	$('.sort-way-modal-close').click(function () {
		$('.sort-way-modal_overlay').addClass('d-none');
	});


	function commentShow() {
		$('#addFeedback_main').click(function (e) {
			e.preventDefault();


			$('#add_comment_idmain').removeClass('d-none');

			//if (thisForm.attr('data-id') == '')
			//{
			//    thisForm.removeClass('d-none');
			//}

			return false;
		});

		$('#addFeedback').click(function (e) {
			e.preventDefault();


			$('#add_comment_id').removeClass('d-none');

			//if (thisForm.attr('data-id') == '')
			//{
			//    thisForm.removeClass('d-none');
			//}

			return false;
		});

		$('.reset-comment').click(function () {
			$('.add-coomment-form').addClass('d-none');
			$('.comment-input').val("");
		});
	}

	commentShow();

	$('.add-coomment-form').submit(function (event) {
		event.preventDefault();

		var $form = $(this),
			Text = $form.find('.comment-input').val(),
			ProductId = $form.find('.productCode').attr('data-productCode'),
			CommentId = $form.find('.commentId').attr('data-commentId');

		if (CommentId == null || CommentId == '') {
			$.ajax('/umbraco/surface/shopapi/AddComment', {
				type: "POST",
				data: { Text, ProductId, CommentId },
				success: function (data) {
					if (data != null) {
						$.ajax(`/umbraco/surface/shopapi/GetComment?id=${data}`,
							{
								success: function (comment) {
									console.log(comment);
									let mainCommentList = document.getElementById('main_comment_list');

									mainCommentList.insertAdjacentHTML('afterbegin', `
                          <div class="comment-list__item" data-id="${comment.Id}">
                                <div class="comment-list__personal">
                                    <p class="comment-list__commentator">${comment.UserName}</p>
                                    <p class="comment-list__date">${new Date(comment.Time).toLocaleDateString()} ${new Date(comment.Time).getHours()}:${new Date(comment.Time).getMinutes()}</p>
                                </div>
                                <div class="comment-list__feedback">
                                    <p class="comment-list__feedback-text">${comment.Text}</p>
                                </div>
                            </div>`);

									let CommentList = document.getElementById('comment_list');

									CommentList.insertAdjacentHTML('afterbegin', `
                          <div class="comment-list__item" data-id="${comment.Id}">
                                <div class="comment-list__personal">
                                    <p class="comment-list__commentator">${comment.UserName}</p>
                                    <p class="comment-list__date">${new Date(comment.Time).toLocaleDateString()} ${new Date(comment.Time).getHours()}:${new Date(comment.Time).getMinutes()}</p>
                                </div>
                                <div class="comment-list__feedback">
                                    <p class="comment-list__feedback-text">${comment.Text}</p>
                                </div>
                            </div>`);

									$('.add-coomment-form').addClass('d-none');
									$('.comment-input').val("");


									let newCount = parseInt(document.getElementById('comments_count').innerText) + 1;
									document.getElementById('comments_count').innerText = newCount;

									document.getElementById('main_comments_count').innerText = newCount;
								}
							});

					}
				}

			});
		}
		else {

		}
	})



	//var posting = $.post(url, { mess: text });



	var ratingVal = $('#rateYo');
	//var dataRVal = $('.rating-val').attr('data-rating-value', ratingVal);

	var ratingValMain = $('#rateYo_main');


	$("#rateYo").rateYo({
		multiColor: {

			"startColor": "#FF0000", //RED
			"endColor": "#00FF00"  //GREEN
		},
		onChange: function (rating) {
			ratingVal.attr('data-rateyo-rating', rating)
			$(this).next().text(ratingVal.attr('data-rateyo-rating'));
			$('.rating-val').attr('data-rating-value', rating);

		},
		onSet: function (rating) {
			$(this).next().text(ratingVal.attr('data-rateyo-rating'));
			let productCode = $('#rating_productCode').attr('data-productCode');
			$.ajax(`/umbraco/surface/shopapi/RateProduct?productCode=${productCode}&value=${rating}`, {
				type: "POST",
				success: function (data) {
					if (data != null) {
						//ratingValMain.attr('data-rateyo-rating', data)
						//$('#rateYo_main_preview').attr('data-rating-value', rating);

						//document.getElementById('rateYo_main_preview').setAttribute('data-rating-value', data);
					}
				}
			});
		}
	});


	$("#rateYo_main").rateYo({
		starWidth: "20px",
		multiColor: {

			"startColor": "#FF0000", //RED
			"endColor": "#00FF00"  //GREEN
		},
		onChange: function (rating) {
			ratingValMain.attr('data-rateyo-rating', rating)
			$(this).next().text(ratingValMain.attr('data-rateyo-rating'));
			$('#rateYo_main_preview').attr('data-rating-value', rating);
		},
		onSet: function (rating) {

		}
	});

	//Product Counter


	//$(document).ready(function () {
	//	$('button').click(function (e) {
	//		var button_classes, value = +$('.counter').val();
	//		button_classes = $(e.currentTarget).prop('class');
	//		if (button_classes.indexOf('up_count') !== -1) {
	//			value = (value) + 1;
	//		} else {
	//			value = (value) - 1;
	//		}
	//		value = value < 0 ? 0 : value;
	//		$('.counter').val(value);
	//	});
	//	$('.counter').click(function () {
	//		$(this).focus().select();
	//	});
	//});

	$(document).ready(function () {
		$('.minus_counter').click(function () {
			var $input = $(this).parent().find('input');
			var count = parseInt($input.val()) - 1;
			count = count < 1 ? 1 : count;
			$input.val(count);
			$input.change();


		});
		$('.plus_counter').click(function () {
			var $input = $(this).parent().find('input');
			$input.val(parseInt($input.val()) + 1);
			$input.change();

			let value = $input.val();

			console.log(value);

			let procudtId = $('input[name="counter"]').attr('id');

			console.log(procudtId);

			//$.post(`/umbraco/surface/shopapi/IncrementCartItem?cartItemId=${procudtId}`,
			$.post(``,
				function (data) {
					if (data) {
						if (value > 1) {
							value = value - 1;
						}
						else {
							value = 1;
						}
						$input.val(value);


					}
				});


		});
	});

	//$('.minus-count').on('click', function (e) {
	//    e.preventDefault();
	//    var $this = $(this);
	//    var $input = $this.closest('div').find('input');
	//    var value = parseInt($input.val());

	//    $.post(`/DecrementCartItem?cartItemId=${this.getAttribute("data-CartItemId")}`,
	//        function (data)
	//        {
	//            if (data)
	//            {
	//                if (value > 1)
	//                {
	//                    value = value - 1;
	//                }
	//                else
	//                {
	//                    value = 1;
	//                }
	//                $input.val(value);


	//            }
	//        });

	//});

	//$('.plus-count').on('click', function (e)
	//{
	//    e.preventDefault();
	//    var $this = $(this);
	//    var $input = $this.closest('div').find('input');
	//    var value = parseInt($input.val());

	//    $.post(`/IncrementCartItem?cartItemId=${this.getAttribute("data-CartItemId")}`,
	//        function (data)
	//        {
	//            if (data)
	//            {
	//                if (value < 100)
	//                {
	//                    value = value + 1;
	//                }
	//                else
	//                {
	//                    value = 100;
	//                }
	//                $input.val(value);


	//            }
	//        });
	//});


	//var amount_value = $('#amount_value').val();

	
	//$("#amount_value")('change', function postinput() {
			
	//}) ;target.getAttribute("data-CostPerOne");

// show colors 




	$(document).ready(function () {


		$(".amount_value").on('change keyup paste keypress select focus focusout hover', function postinput() {
			

			let amountValue = $(this).val();

			let productCost = $(this).attr('data-CostPerOne');

			let total = amountValue * productCost;

			let itemCardId = $(this).attr('id');



			$.ajax({
				url: `/umbraco/surface/shopapi/SetCartItemAmount`,
				data: {
					cartItemId: itemCardId,
					amount: amountValue
				},
				type: 'post'
			}).done(function (responseData) {
				if (responseData) {
					let max = responseData.TotalItemAmount;

					let maxInputValue = $(`#${itemCardId}`);

					maxInputValue.prop('max', max);	

					document.getElementById(itemCardId + "_span").innerText = total;

					if (amountValue == max) {
						
							maxInputValue[0].classList.add('input-show-span');
							maxInputValue[0].style.border = '1px solid red';

					} else if (maxInputValue[0].classList.contains('input-show-span')) {
						maxInputValue[0].classList.remove('input-show-span');
						maxInputValue[0].style.border = '1px solid transparent';
						
						}

					


					$.get(`/umbraco/surface/shopapi/GetCartAmountAPI`, function (cartAm) {
						SetCartCount(cartAm);
					}).done(function () {
						if (+responseData.TotalItemAmount < +amountValue) {
		
							maxInputValue[0].classList.add('input-show-span');
							maxInputValue[0].style.border = '1px solid red';
							console.log('overflow')
							maxInputValue.val(max);
							document.getElementById(itemCardId + "_span").innerText = responseData.TotalItemAmount * productCost;

						}

					});

					$.get(`/umbraco/surface/shopapi/GetCartTotalCost`, function (cartCost) {
						$(".order-sum__price span").text(cartCost);
						$(".order-sum__price").attr(
							"data-price",
							cartCost
						);
					}).fail(function () { location.reload(); });

				}
				else {

                }
			}).fail(function () {
				console.log('Failed');
			});
		});
	}); 
	
		
		


	function PayStepByStep() {
		$('#to-pay').click(function (e) {
			e.preventDefault();
			$('.payment-contacts').css('display', 'none');
			$('.pay-delivery, .payment-det, .step-back').css('display', 'block');

			$('.step2').removeClass('step-in-process').addClass('step-done');
			$('.step-second-line').addClass('line-done');
			$('.step3').addClass('step-in-process');

		});

		$('#come-back-step').click(function (e) {
			e.preventDefault();
			$('.payment-contacts').css('display', 'block');
			$('.pay-delivery, .payment-det, .step-back').css('display', 'none');

			$('.step2').addClass('step-in-process').removeClass('step-done');
			$('.step-second-line').removeClass('line-done');
			$('.step3').removeClass('step-in-process');
		});
	}
	PayStepByStep();

	let SetCartCount = function (newValue) {
		$("#cartAmount").text(newValue);
	};

	$('.product-color__item').click(function (event) {
		$('.product-color__item').removeClass('product-color__item-active');
		$('.product-color__item').removeAttr('id');
		$(this).addClass('product-color__item-active');
		this.setAttribute('id', 'selected_color_id');

		let productItem = document.querySelector('.product_element');

		let prodItem = $(this).closest('.product_element')[0]
		console.log(prodItem)

		let thisColor = this.getAttribute('data-product_color');

		if (thisColor.includes("#")) {
			thisColor = thisColor.split('#')[1];
			thisColor = `%23${thisColor}`;
		}

		$.post(`/umbraco/surface/shopapi/SelectColor_ForItem?productId=${prodItem.getAttribute('data-id')}&color=${thisColor}`, data => {

			let sizesBlock = document.getElementById('product_item_sizes_block_id');

			if (sizesBlock) {
				sizesNodes = sizesBlock.children;
				for (let i = 0; i < sizesNodes.length; i++) {
					sizesNodes[i].classList.remove('prosuct-sizes__item-active');
					sizesNodes[i].classList.add('prosuct-sizes__item__disabled');
					sizesNodes[i].disabled = true;
					sizesNodes[i].removeAttribute('data-product_size');
				}
			}

			if (data) {
				if (data.length == 1 && (!data[0].size || data[0].size == '')) {
					$("#product_item_price_id").text(data[0].cost);
				}
				else {
					let sizeEl;
					data.forEach(d => {

						sizeEl = document.getElementById(`size_${d.size}`);
						sizeEl.classList.remove('prosuct-sizes__item__disabled');
						sizeEl.setAttribute('data-product_size', d.size);

						if (d.is_selected) {
							sizeEl.disabled = true;
							sizeEl.classList.add('prosuct-sizes__item-active');
							$("#product_item_price_id").text(d.cost);
						}
						else {
							sizeEl.disabled = false;
						}
					});
				}
			}
		})
	});

	$('.prosuct-sizes__item').click(function (event) {
		$('.prosuct-sizes__item-active').removeAttr('disabled');
		$('.prosuct-sizes__item').removeClass('prosuct-sizes__item-active');


		$(this).addClass('prosuct-sizes__item-active');
		$(this).attr('disabled', 'disabled');

		let productItem = document.querySelector('.product_element');

		let thisSize = this.getAttribute('data-product_size');

		let Color = document.getElementById('selected_color_id');



		if (Color) {

			let selectedColor = Color.getAttribute('data-product_color');

			if (selectedColor.includes("#")) {
				selectedColor = selectedColor.split('#')[1];
				selectedColor = `%23${selectedColor}`;
			}

			$.post(`/umbraco/surface/shopapi/SelectSize_ForItem?productId=${productItem.getAttribute('data-id')}&selectedColor=${selectedColor}&size=${thisSize}`, data => {

				if (data) {
					$("#product_item_price_id").text(data);
				}
			})
		}
		else {
			$.post(`/umbraco/surface/shopapi/SelectSize_ForItem?productId=${productItem.getAttribute('data-id')}&size=${thisSize}`, data => {

				if (data) {
					$("#product_item_price_id").text(data);
				}
			})
		}

	});

	$(".product_element").click(function ({ target }) {

		const self = this;
		if (
			target.className === "shop-item__to-cart" ||
			target.closest("button").className === "shop-item__to-cart" ||
			target.className === "product-cart-btn" ||
			target.closest("button").className === "product-cart-btn"
		) {
			var attrs = this.getAttribute("data-id");
			
			let currSize;
			let sizes = self.getElementsByClassName("prosuct-sizes__item");
			for (let i = 0; i < sizes.length; i++) {
				let dis = sizes[i].getAttribute("disabled");
				if (sizes[i].disabled === true) {
					currSize = sizes[i].innerText;
					break;
				}
				else {
					currSize = sizes[0].getAttribute("data-product_size");
				}
			}
			

			$.get(`/umbraco/surface/shopapi/AddToCart?itemId=${attrs}&itemSize=${currSize}`, function (
				data
			) {
				if (data) {
					$.get(`/umbraco/surface/shopapi/GetCartAmountAPI`, function (cartAm) {
						SetCartCount(cartAm);
					});
				}
			});
		} // Add to Cart


		if (
			target.className === "delete-from-cart" ||
			target.closest("button").className === "delete-from-cart"
		) {
			$.get(
				`/umbraco/surface/shopapi/DeleteFromCart?CartItemId=${this.getAttribute("data-CartItemId")}`,
				data => {
					if (data) {
						$.get(`/umbraco/surface/shopapi/GetCartAmountAPI`, function (cartAm) {
							SetCartCount(cartAm);

							let currentSum = document
								.querySelector(".order-sum__price")
								.getAttribute("data-price");

							let productAmount = self
								.querySelector(".price")
								.getAttribute("data-price");


							$(".order-sum__price span").text(+currentSum - +productAmount);
							$(".order-sum__price").attr(
								"data-price",
								+currentSum - +productAmount
							);

							self.remove();
						});
					}
				}
			);
		} // Delete from Cart

		if (target.className === "counter-btn plus-count" || target.closest("button").className === "counter-btn plus-count") {
			let input = $($(this).closest('div').find('input')[0]);
			if (+(input.val()) < +(input.attr('max'))) {
				let value = input.val();

				input.val(++value);
				input.change();


				//if (value >= input.attr('max')) {
				//	debugger;
				//	$(target.closest("button")).prop('disabled', true);
				//}
            } 
			
			//let $this = $(this);
			//let $input = $this.closest('div').find('input');
			//let value = parseInt($input.val());

			//$.post(`/umbraco/surface/shopapi/IncrementCartItem?cartItemId=${this.getAttribute("data-CartItemId")}`,
			//	function (data) {

			//		if (data) {
			//			if (value < 100) {
			//				value = value + 1;
			//			}
			//			else {
			//				value = 100;
			//			}
			//			$input.val(value);

			//			let currentSum = document
			//				.querySelector(".order-sum__price")
			//				.getAttribute("data-price");

			//			let productAmount;
			//			if (target.className === "counter-btn plus-count") {
			//				productAmount = target.getAttribute("data-CostPerOne");
			//			}
			//			else {
			//				productAmount = target.closest("button").getAttribute("data-CostPerOne");
			//			}



			//			$(".order-sum__price span").text(+currentSum + +productAmount);
			//			$(".order-sum__price").attr(
			//				"data-price",
			//				+currentSum + +productAmount
			//			);


			//			let productSumAmount = self
			//				.querySelector(".price");

			//			productSumAmount.setAttribute("data-price", (+productSumAmount.innerText + +productAmount));
			//			productSumAmount.innerText = (+productSumAmount.innerText + +productAmount);
			//		}
			//	});
		}
		else if (target.className === "counter-btn minus-count" || target.closest("button").className === "counter-btn minus-count") {

			let input = $($(this).closest('div').find('input')[0]);
			if (+(input.val()) > +(input.attr('min'))) {
				let value = input.val();
				input.val(--value);
				input.change();
			}

			//let $this = $(this);
			//let $input = $this.closest('div').find('input');
			//let value = parseInt($input.val());

			//$.post(`/umbraco/surface/shopapi/DecrementCartItem?cartItemId=${this.getAttribute("data-CartItemId")}`,
			//	function (data) {
			//		if (data) {

			//			let currentSum = document
			//				.querySelector(".order-sum__price")
			//				.getAttribute("data-price");

			//			let productAmount;
			//			if (target.className === "counter-btn minus-count") {
			//				productAmount = target.getAttribute("data-CostPerOne");
			//			}
			//			else {
			//				productAmount = target.closest("button").getAttribute("data-CostPerOne");
			//			}

			//			if (value > 1) {
			//				value = value - 1;

			//				$(".order-sum__price span").text(+currentSum - +productAmount);
			//				$(".order-sum__price").attr(
			//					"data-price",
			//					+currentSum - +productAmount
			//				);

			//				let productSumAmount = self
			//					.querySelector(".price");

			//				productSumAmount.setAttribute("data-price", (+productSumAmount.innerText - +productAmount));
			//				productSumAmount.innerText = (+productSumAmount.innerText - +productAmount);
			//			}
			//			else {
			//				value = 1;
			//			}

			//			$input.val(value);
			//		}
			//	});
		}
		

		if (target.className === "add-to-favour" ||
			target.className === "toFavour product-extra-btn") {
			$.get(`/umbraco/surface/shopapi/ToFavourites?itemId=${this.getAttribute("data-id")}`, function (data) {
				if (data) {
					if (target.style.backgroundColor !== "red") {
						target.style.backgroundColor = "red";
					} else {
						target.style.backgroundColor = "";
					}
				}
			});
		}
		else if (target.closest("button").className === "add-to-favour" ||
			target.closest("button").className === "toFavour product-extra-btn") {
			$.get(`/umbraco/surface/shopapi/ToFavourites?itemId=${this.getAttribute("data-id")}`, function (data) {
				if (data) {
					if (target.closest("button").style.backgroundColor !== "red") {
						target.closest("button").style.backgroundColor = "red";
					} else {
						target.closest("button").style.backgroundColor = "";
					}
				}
			});
		}// Add/remove favourite

		if (target.className === "delete-viewedItem delete-like" ||
			target.closest("button").className === "delete-viewedItem delete-like") {
			$.get(`/umbraco/surface/shopapi/DeleteViewedItem?itemId=${this.getAttribute('data-id')}`)

			self.remove();
			// Delete viewed item
		}

		if (
			target.className === "delete-like" ||
			target.closest("button").className === "delete-like"
		) {
			$.get(`/umbraco/surface/shopapi/ToFavourites?itemId=${this.getAttribute("data-id")}`);
			self.remove();
			// Delete from favourites
		}

		if (
			target.className === "add-to-comparison" ||
			target.className === "toCompar product-extra-btn"
		) {
			$.get(`/umbraco/surface/shopapi/ToComparisons?itemId=${this.getAttribute("data-id")}`, function (
				data
			) {
				if (data) {
					if (target.style.backgroundColor !== "green") {
						target.style.backgroundColor = "green";
					}
					else {
						target.style.backgroundColor = "";
					}
				}
			}); //Add/remove comparison
		}
		else if (
			target.closest("button").className === "add-to-comparison" ||
			target.closest("button").className === "toCompar product-extra-btn") {
			$.get(`/umbraco/surface/shopapi/ToComparisons?itemId=${this.getAttribute("data-id")}`, function (
				data
			) {
				if (data) {
					if (target.closest("button").style.backgroundColor !== "green") {
						target.closest("button").style.backgroundColor = "green";
					}
					else {
						target.closest("button").style.backgroundColor = "";
					}
				}
			}); //Add/remove comparison
		}

		if (
			target.className === "delete-comparison" ||
			target.closest("button").className === "delete-comparison"
		) {
			$.get(`/umbraco/surface/shopapi/ToComparisons?itemId=${this.getAttribute("data-id")}`);
			self.remove();
			//Delete from comparisons
		}

	});









	$(".filter-btn").click(function (e) {
		e.preventDefault();
		$(".filter-block").css("display", "block");
	});
	$(".close-filter").click(function (e) {
		e.preventDefault();
		$(".filter-block").css("display", "none");
	});


	var readURL = function (input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$(".profile-pic").attr("src", e.target.result);
			};
			reader.readAsDataURL(input.files[0]);
		}
	};
	$(".file-upload").on("change", function () {
		readURL(this);
	});
	$(".upload-button").on("click", function (e) {
		e.preventDefault();
		$(".file-upload").click();
	});




	$(".my").change(function () {
		if ($(this).val() != "")
			$(this)
				.prev()
				.text("Вибрано файлів: " + $(this)[0].files.length);
		else
			$(this)
				.prev()
				.text("Загрузити документи");
	});
	$("#check").click(function () {
		$(".edit-personal-data-choose").toggleClass("d-none");
	});

	$(".ham").click(() => {
		let menu = $(".header__menu");
		if (menu.hasClass("menu-active")) {
			menu.removeClass("menu-active");
			$("body").css("overflow", "unset");
		} else {
			menu.addClass("menu-active");
			$("body").css("overflow", "hidden");
		}
	});

	$(".hero-slider").slick({
		autoplay: true,
		centerMode: true,
		autoplaySpeed: 10000,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover: true,
		dots: true,
		pauseOnDotsHover: true,
		cssEase: "linear",
		fade: true,
		draggable: false,
		arrows: true,
		prevArrow: '<button class="prevSlick"><i class="fas fa-caret-left"></i></button>',
		nextArrow: '<button class="nextSlick"><i class="fas fa-caret-right"></i></button>',
		infinity: true,
		responsive: [{
			breakpoint: 992,
			settings: {
				arrows: false,
				slidesToShow: 1
			}
		}]
	});

	$(".my-reviews-slider").slick({
		autoplay: false,
		speed: 600,
		slidesToShow: 2,
		slidesToScroll: 1,
		dots: true,
		arrow: false,
		infinity: false,
		prevArrow: '<button class="prevSlick"><i class="fas fa-caret-left"></i></button>',
		nextArrow: '<button class="nextSlick"><i class="fas fa-caret-right"></i></button>',
		responsive: [
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					slidesToShow: 2
				}
			},
			{
				breakpoint: 650,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			}
		]
	});

	$(".hits-list").slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		prevArrow: '<button class="prevSlick"><i class="fas fa-caret-left"></i></button>',
		nextArrow: '<button class="nextSlick"><i class="fas fa-caret-right"></i></button>',
		responsive: [
			{
				breakpoint: 1300,
				settings: {
					//arrows: false,
					slidesToShow: 3
				}
			},
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					slidesToShow: 2
				}
			},
			{
				breakpoint: 576,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			}
		]
	});

	$(".do-comparison-items-list").slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		//autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		prevArrow: '<button class="prevSlick"><i class="fas fa-caret-left"></i></button>',
		nextArrow: '<button class="nextSlick"><i class="fas fa-caret-right"></i></button>',
		responsive: [
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			},
			{
				breakpoint: 576,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			}
		]
	});

	$(".customer-reviews").slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		prevArrow: '<button class="prevSlick"><i class="fas fa-caret-left"></i></button>',
		nextArrow: '<button class="nextSlick"><i class="fas fa-caret-right"></i></button>',
		responsive: [
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					slidesToShow: 2
				}
			},
			{
				breakpoint: 576,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			}
		]
	});

	$(".new-list").slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		// autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		prevArrow: '<button class="prevSlick"><i class="fas fa-caret-left"></i></button>',
		nextArrow: '<button class="nextSlick"><i class="fas fa-caret-right"></i></button>',
		responsive: [
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					slidesToShow: 2
				}
			},
			{
				breakpoint: 576,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			}
		]
	});
	$(".last-viewed-list").slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		// autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		responsive: [
			{
				breakpoint: 1300,
				settings: {
					arrows: false,
					slidesToShow: 3
				}
			},
			{
				breakpoint: 992,
				settings: {
					arrows: false,
					slidesToShow: 2
				}
			},
			{
				breakpoint: 576,
				settings: {
					arrows: false,
					slidesToShow: 1
				}
			}
		]
	});

	$(".stock-slider").slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1,
		fade: true,
		autoplay: true,
		arrows: false,
		autoplaySpeed: 5000,
		responsive: [
			{
				breakpoint: 576,
				settings: {
					dots: false
				}
			}
		]
	});
});


$(function () {
	$(".toggle-section").click(function (e) {
		e.preventDefault();
		$(`#${$(this).data("toggle-content")}`)
			.stop()
			.slideToggle();
	});
});

//$('.filter-check-wrapper label').click(function (e) {
//	e.preventDefault();
//})

$(function () {
	var goodsItem = $(".prod-rel");

	$(".catalog-mod-item").click(function (e) {
		e.preventDefault();
	});

	$(".four-col-mod").click(function (e) {
		goodsItem.removeClass("grid-mode-3");
		goodsItem.removeClass("grid-mode-2");
		goodsItem.removeClass("grid-mode-1");
		goodsItem.addClass("grid-mode-4");
		$(this).addClass("mod-active");
		$(".three-col-mod").removeClass("mod-active");
		$(".two-col-mod").removeClass("mod-active");
		$(".line-mode").removeClass("mod-active");
	});

	$(".three-col-mod").click(function (e) {
		goodsItem.removeClass("grid-mode-4");
		goodsItem.removeClass("grid-mode-2");
		goodsItem.removeClass("grid-mode-1");
		goodsItem.addClass("grid-mode-3");
		$(this).addClass("mod-active");
		$(".four-col-mod").removeClass("mod-active");
		$(".two-col-mod").removeClass("mod-active");
		$(".line-mode").removeClass("mod-active");
	});

	$(".two-col-mod").click(function (e) {
		goodsItem.removeClass("grid-mode-4");
		goodsItem.removeClass("grid-mode-3");
		goodsItem.removeClass("grid-mode-1");
		goodsItem.addClass("grid-mode-2");
		$(this).addClass("mod-active");
		$(".four-col-mod").removeClass("mod-active");
		$(".three-col-mod").removeClass("mod-active");
		$(".line-mode").removeClass("mod-active");
	});

	$(".line-mode").click(function (e) {
		goodsItem.removeClass("grid-mode-4");
		goodsItem.removeClass("grid-mode-3");
		goodsItem.removeClass("grid-mode-2");
		goodsItem.addClass("grid-mode-1");
		$(this).addClass("mod-active");
		$(".four-col-mod").removeClass("mod-active");
		$(".three-col-mod").removeClass("mod-active");
		$(".two-col-mod").removeClass("mod-active");
	});
});

// ------------------------

$(".slider").each(function (e) {
	var slider = $(this),
		width = slider.width(),
		handle,
		handleObj;

	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 " + width + " 83");

	slider.html(svg);
	slider.append(
		$("<div>")
			.addClass("active")
			.html(svg.cloneNode(true))
	);

	let GetMaxCost = function () {
		let res = +document.getElementById('second').textContent
		if (res) {
			return res;
		}
		return 10000;
	}

	let GetMinCost = function () {
		let res = +document.getElementById('first').textContent
		if (res) {
			return res;
		}
		return 0;
	}


	slider.slider({
		range: true,
		values: [GetMinCost(), GetMaxCost()],
		min: GetMinCost(),
		step: 1,
		// minRange: 300,
		max: GetMaxCost(),
		create(event, ui) {
			slider.find(".ui-slider-handle").append($("<div />"));

			$(slider.data("value-0")).html(
				slider
					.slider("values", 0)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, '')
			);
			$(slider.data("value-1")).html(
				slider
					.slider("values", 1)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, '')
			);
			$(slider.data("range")).html(
				(slider.slider("values", 1) - slider.slider("values", 0))
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, '')
			);

			setCSSVars(slider);
		},
		start(event, ui) {
			$("body").addClass("ui-slider-active");

			handle = $(ui.handle).data("index", ui.handleIndex);
			handleObj = slider.find(".ui-slider-handle");
		},
		change(event, ui) {



			let fR = document.querySelector('#first').textContent;
			let fL = document.querySelector('#second').textContent;

			let fRInp = document.querySelector('.firstR');
			let fLInp = document.querySelector('.secR');

			//fRInp.setAttribute("value", fR);
			//fLInp.setAttribute("value", fL);

			fRInp.value = fR;
			fLInp.value = fL;

			setCSSVars(slider);
		},
		slide(event, ui) {
			let min = slider.slider("option", "min"),
				minRange = slider.slider("option", "minRange"),
				max = slider.slider("option", "max");

			if (ui.handleIndex == 0) {
				if (ui.values[0] + minRange >= ui.values[1]) {
					slider.slider("values", 1, ui.values[0] + minRange);
				}
				if (ui.values[0] > max - minRange) {
					return false;
				}
			} else if (ui.handleIndex == 1) {
				if (ui.values[1] - minRange <= ui.values[0]) {
					slider.slider("values", 0, ui.values[1] - minRange);
				}
				if (ui.values[1] < min + minRange) {
					return false;
				}
			}

			$(slider.data("value-0")).html(
				ui.values[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '')
			);
			$(slider.data("value-1")).html(
				ui.values[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '')
			);
			$(slider.data("range")).html(
				(slider.slider("values", 1) - slider.slider("values", 0))
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, '')
			);

			let fR = document.querySelector('#first').textContent;
			let fL = document.querySelector('#second').textContent;

			let fRInp = document.querySelector('.firstR');
			let fLInp = document.querySelector('.secR');

			//fRInp.setAttribute("value", fR);
			//fLInp.setAttribute("value", fL);


			fRInp.value = fR;
			fLInp.value = fL;


			setCSSVars(slider);
		},
		stop(event, ui) {
			$("body").removeClass("ui-slider-active");

			let duration = 0.6,
				ease = Elastic.easeOut.config(1.08, 0.44);

			TweenMax.to(handle, duration, {
				"--y": 0,
				ease: ease
			});

			TweenMax.to(svgPath, duration, {
				y: 42,
				ease: ease
			});

			handle = null;
		}


	});


	var svgPath = new Proxy(
		{
			x: null,
			y: null,
			b: null,
			a: null
		},
		{
			set(target, key, value) {
				target[key] = value;
				if (
					target.x !== null &&
					target.y !== null &&
					target.b !== null &&
					target.a !== null
				) {
					slider
						.find("svg")
						.html(getPath([target.x, target.y], target.b, target.a, width));
				}
				return true;
			},
			get(target, key) {
				return target[key];
			}
		}
	);

	svgPath.x = width / 2;
	svgPath.y = 42;
	svgPath.b = 0;
	svgPath.a = width;

	$(document).on("mousemove touchmove", e => {
		if (handle) {
			let laziness = 4,
				max = 24,
				edge = 52,
				other = handleObj.eq(handle.data("index") == 0 ? 1 : 0),
				currentLeft = handle.position().left,
				otherLeft = other.position().left,
				handleWidth = handle.outerWidth(),
				handleHalf = handleWidth / 2,
				y = e.pageY - handle.offset().top - handle.outerHeight() / 2,
				moveY =
					y - laziness >= 0
						? y - laziness
						: y + laziness <= 0
							? y + laziness
							: 0,
				modify = 1;

			moveY = moveY > max ? max : moveY < -max ? -max : moveY;
			modify =
				handle.data("index") == 0
					? (currentLeft + handleHalf <= edge
						? (currentLeft + handleHalf) / edge
						: 1) *
					(otherLeft - currentLeft - handleWidth <= edge
						? (otherLeft - currentLeft - handleWidth) / edge
						: 1)
					: (currentLeft - (otherLeft + handleHalf * 2) <= edge
						? (currentLeft - (otherLeft + handleWidth)) / edge
						: 1) *
					(slider.outerWidth() - (currentLeft + handleHalf) <= edge
						? (slider.outerWidth() - (currentLeft + handleHalf)) / edge
						: 1);
			modify = modify > 1 ? 1 : modify < 0 ? 0 : modify;

			if (handle.data("index") == 0) {
				svgPath.b = (currentLeft / 2) * modify;
				svgPath.a = otherLeft;
			} else {
				svgPath.b = otherLeft + handleHalf;
				svgPath.a =
					(slider.outerWidth() - currentLeft) / 2 +
					currentLeft +
					handleHalf +
					((slider.outerWidth() - currentLeft) / 2) * (1 - modify);
			}

			svgPath.x = currentLeft + handleHalf;
			svgPath.y = moveY * modify + 42;

			handle.css("--y", moveY * modify);
		}
	});
});

function getPoint(point, i, a, smoothing) {
	let cp = (current, previous, next, reverse) => {
		let p = previous || current,
			n = next || current,
			o = {
				length: Math.sqrt(
					Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)
				),
				angle: Math.atan2(n[1] - p[1], n[0] - p[0])
			},
			angle = o.angle + (reverse ? Math.PI : 0),
			length = o.length * smoothing;
		return [
			current[0] + Math.cos(angle) * length,
			current[1] + Math.sin(angle) * length
		];
	},
		cps = cp(a[i - 1], a[i - 2], point, false),
		cpe = cp(point, a[i - 1], a[i + 1], true);
	return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, before, after, width) {
	let smoothing = 0.16,
		points = [
			[0, 42],
			[before <= 0 ? 0 : before, 42],
			update,
			[after >= width ? width : after, 42],
			[width, 42]
		],
		d = points.reduce(
			(acc, point, i, a) =>
				i === 0
					? `M ${point[0]},${point[1]}`
					: `${acc} ${getPoint(point, i, a, smoothing)}`,
			""
		);
	return `<path d="${d}" />`;
}

function setCSSVars(slider) {
	let handle = slider.find(".ui-slider-handle");
	slider.css({
		"--l": handle.eq(0).position().left + handle.eq(0).outerWidth() / 2,
		"--r":
			slider.outerWidth() -
			(handle.eq(1).position().left + handle.eq(1).outerWidth() / 2)
	});
}



//var App = (function() {
//  var gallery = $("#js-gallery");

//  var Gallery = {
//    zoom: function(imgContainer, img) {
//      var containerHeight = imgContainer.outerHeight(),
//        src = img.attr("src");
//          console.log(src)

//      if (src.indexOf("/products/normal/") != -1) {
//        imgContainer.css("height", containerHeight);

//        img.attr("src", src.replace("/products/normal/", "/products/zoom/"));

//        gallery.addClass("is-zoomed");

//        img.draggable({
//          drag: function(event, ui) {
//            ui.position.left = Math.min(100, ui.position.left);
//            ui.position.top = Math.min(100, ui.position.top);
//          }
//        });
//      } else {
//        imgContainer.css("height", "auto");

//        img.attr("src", src.replace("/products/zoom/", "/products/normal/"));

//        gallery.removeClass("is-zoomed");
//      }
//    },
//    switch: function(trigger, imgContainer) {
//      var src = trigger.attr("href"),
//        thumbs = trigger.siblings(),
//        img = trigger
//          .parent()
//          .prev()
//          .children();

//      trigger.addClass("product-img-is-active");

//      thumbs.each(function() {
//        if ($(this).hasClass("product-img-is-active")) {
//          $(this).removeClass("product-img-is-active");
//        }
//      });

//      if (gallery.hasClass("is-zoomed")) {
//        gallery.removeClass("is-zoomed");
//        imgContainer.css("height", "auto");
//      }

//      img.attr("src", src);
//    }
//  };

//  function init() {
//    gallery.delegate("a", "click", function(event) {
//      var trigger = $(this);
//      var triggerData = trigger.data("gallery");

//      if (triggerData === "zoom") {
//        var imgContainer = trigger.parent(),
//          img = trigger.siblings();
//        Gallery.zoom(imgContainer, img);
//      } else if (triggerData === "thumb") {
//        var imgContainer = trigger.parent().siblings();
//        Gallery.switch(trigger, imgContainer);
//      } else {
//        return;
//      }

//      event.preventDefault();
//    });
//  }

//  return {
//    init: init
//  };
//})();

//App.init();
let mainImg = $('.product-main-gallery__hero');
$('.product-main-gallery__thumbs-item').click(function (e) {
	e.preventDefault();

	$('.product-main-gallery__thumbs-item').removeClass('product-img-is-active')
	$(this).addClass('product-img-is-active')
	mainImg.children().attr('src', $(this).children().attr('src'));
})

function productNavigation() {
	$(".js-prodNav-all").click(function (e) {
		e.preventDefault();
		$(".js-prodNav-descr").removeClass("product-active-link");
		$(".js-prodNav-photo").removeClass("product-active-link");
		$(".js-prodNav-video").removeClass("product-active-link");
		$(".js-prodNav-feedbacks").removeClass("product-active-link");
		$(this).addClass("product-active-link");

		$(".js-toggle-section").removeClass("d-none");

		$(".product-characteristics-info-forJs").addClass("d-none");
		$(".product-main-photos-forjs").addClass("d-none");
		$(".player-js").addClass("d-none");
		$(".product-feedbacks-block-js").addClass("d-none");
	});

	$(".js-prodNav-descr").click(function (e) {
		e.preventDefault();
		$(".js-prodNav-all").removeClass("product-active-link");
		$(".js-prodNav-photo").removeClass("product-active-link");
		$(".js-prodNav-video").removeClass("product-active-link");
		$(".js-prodNav-feedbacks").removeClass("product-active-link");
		$(this).addClass("product-active-link");

		$(".js-toggle-section").addClass("d-none");

		$(".product-characteristics-info-forJs").removeClass("d-none");
		$(".product-main-photos-forjs").addClass("d-none");
		$(".player-js").addClass("d-none");
		$(".product-feedbacks-block-js").addClass("d-none");
	});

	$(".js-prodNav-photo").click(function (e) {
		e.preventDefault();
		$(".js-prodNav-all").removeClass("product-active-link");
		$(".js-prodNav-descr").removeClass("product-active-link");
		$(".js-prodNav-video").removeClass("product-active-link");
		$(".js-prodNav-feedbacks").removeClass("product-active-link");
		$(this).addClass("product-active-link");

		$(".js-toggle-section").addClass("d-none");

		$(".product-characteristics-info-forJs").addClass("d-none");
		$(".product-main-photos-forjs").removeClass("d-none");
		$(".player-js").addClass("d-none");
		$(".product-feedbacks-block-js").addClass("d-none");
	});

	$(".js-prodNav-video").click(function (e) {
		e.preventDefault();
		$(".js-prodNav-all").removeClass("product-active-link");
		$(".js-prodNav-descr").removeClass("product-active-link");
		$(".js-prodNav-photo").removeClass("product-active-link");
		$(".js-prodNav-feedbacks").removeClass("product-active-link");
		$(this).addClass("product-active-link");

		$(".js-toggle-section").addClass("d-none");

		$(".product-characteristics-info-forJs").addClass("d-none");
		$(".product-main-photos-forjs").addClass("d-none");
		$(".player-js").removeClass("d-none");
		$(".product-feedbacks-block-js").addClass("d-none");
	});

	$(".js-prodNav-feedbacks").click(function (e) {
		e.preventDefault();
		$(".js-prodNav-all").removeClass("product-active-link");
		$(".js-prodNav-photo").removeClass("product-active-link");
		$(".js-prodNav-video").removeClass("product-active-link");
		$(".js-prodNav-descr").removeClass("product-active-link");
		$(this).addClass("product-active-link");

		$(".js-toggle-section").addClass("d-none");

		$(".product-characteristics-info-forJs").addClass("d-none");
		$(".product-main-photos-forjs").addClass("d-none");
		$(".player-js").addClass("d-none");
		$(".product-feedbacks-block-js").removeClass("d-none");
	});
}

productNavigation();



//function prodCounter() {
//  let productCount = document.querySelector(".prod-count");
//  let minus = document.querySelector(".minus-count");
//  let plus = document.querySelector(".plus-count");
//  let price = document.querySelector(".price");

//  minus.onclick = function() {
//    if (productCount.value > 1) {
//      --productCount.value;
//      price.innerHTML = price.dataset.price * productCount.value;
//    } else {
//      return;
//    }
//  };

//  plus.onclick = function() {
//    ++productCount.value;
//    price.innerHTML = price.dataset.price * productCount.value;
//  };

//  price.innerHTML = price.dataset.price * productCount.value;
//}

//prodCounter();

lightbox.option({
	resizeDuration: 200,
	wrapAround: true
});


// validation

var myInput = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var confPass = document.getElementById("confirm-password");
var confMess = document.getElementById("conf-pass-message");
var submReg = document.getElementById("reg-submit");

let nameInput = document.getElementById('js-name-id');
let emailInput = document.getElementById('js-email-id');
let emailValidTip = document.getElementById('email-pass-message');

myInput.onfocus = function () {
	document.getElementById("pass-message").style.display = "block";
};

myInput.onblur = function () {
	document.getElementById("pass-message").style.display = "none";
};


confPass.onfocus = function () {
	document.getElementById("conf-pass-message-block").style.display = "block";
};
confPass.onblur = function () {
	document.getElementById("conf-pass-message-block").style.display = "none";
};

emailInput.onfocus = function () {
	document.getElementById("email-message-block").style.display = "block";
};
emailInput.onblur = function () {
	document.getElementById("email-message-block").style.display = "none";
};



let allFormInput = document.querySelectorAll('.signUp-form input');






nameInput.onkeyup = function () {
	if (nameInput.value == "" || nameInput.value == " ") {
		submReg.classList.add("submit-disabled");
	} else if (nameInput.value.length > 3) {
		submReg.classList.remove("submit-disabled");
	} else {
		submReg.classList.add("submit-disabled");
	}

	allFormInput.forEach(function (item) {
		if (item.value == '' || item.value == ' ') {
			submReg.classList.add("submit-disabled");
		}
	})
}


emailInput.onkeyup = function () {
	if (emailInput.value == '' || emailInput.value == ' ') {
		submReg.classList.add("submit-disabled");
		emailValidTip.classList.remove('valid');
		emailValidTip.classList.add('invalid');
	} else if (!emailInput.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g)) {
		submReg.classList.add("submit-disabled");
		emailValidTip.classList.remove('valid');
		emailValidTip.classList.add('invalid');
	} else {
		submReg.classList.remove("submit-disabled");
		emailValidTip.classList.remove('invalid');
		emailValidTip.classList.add('valid');
	}

	allFormInput.forEach(function (item) {
		if (item.value == '' || item.value == ' ') {
			submReg.classList.add("submit-disabled");
		}
	})
}

myInput.onkeyup = function () {
	var lowerCaseLetters = /[a-z]/g;
	var lowerCaseLettersUa = /[а-я]/g;
	if (
		myInput.value.match(lowerCaseLetters) ||
		myInput.value.match(lowerCaseLettersUa)
	) {
		letter.classList.remove("invalid");
		letter.classList.add("valid");
		submReg.classList.remove("submit-disabled");
	} else {
		letter.classList.remove("valid");
		letter.classList.add("invalid");
		submReg.classList.add("submit-disabled");
	}

	var upperCaseLetters = /[A-Z]/g;
	var upperCaseLettersUa = /[А-Я]/g;
	if (
		myInput.value.match(upperCaseLetters) ||
		myInput.value.match(upperCaseLettersUa)
	) {
		capital.classList.remove("invalid");
		capital.classList.add("valid");
		submReg.classList.remove("submit-disabled");
	} else {
		capital.classList.remove("valid");
		capital.classList.add("invalid");
		submReg.classList.add("submit-disabled");
	}

	var numbers = /[0-9]/g;
	if (myInput.value.match(numbers)) {
		number.classList.remove("invalid");
		number.classList.add("valid");
		submReg.classList.remove("submit-disabled");
	} else {
		number.classList.remove("valid");
		number.classList.add("invalid");
		submReg.classList.add("submit-disabled");
	}

	if (myInput.value.length >= 8) {
		length.classList.remove("invalid");
		length.classList.add("valid");
		submReg.classList.remove("submit-disabled");
	} else {
		length.classList.remove("valid");
		length.classList.add("invalid");
		submReg.classList.add("submit-disabled");
	}


	allFormInput.forEach(function (item) {
		if (item.value == '' || item.value == ' ') {
			submReg.classList.add("submit-disabled");
		}
	})
};

// function ConfirmPassword() {


confPass.onkeyup = function () {
	if (myInput.value != confPass.value) {
		confMess.classList.remove("valid");
		confMess.classList.add("invalid");
		submReg.classList.add("submit-disabled");
	} else if (myInput.value == "") {
		confMess.classList.remove("valid");
		confMess.classList.add("invalid");
		submReg.classList.add("submit-disabled");
	} else {
		confMess.classList.remove("invalid");
		confMess.classList.add("valid");
		submReg.classList.remove("submit-disabled");
	}

	allFormInput.forEach(function (item) {
		if (item.value == '' || item.value == ' ') {
			submReg.classList.add("submit-disabled");
		}
	})
};



// confPass.onkeyup = ConfirmPassword;





