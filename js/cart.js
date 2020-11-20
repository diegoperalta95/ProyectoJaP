var currency = "USD";
var statusDiscount = false;
var discountValue = 0;
var prodTotal = 0;
var productsArray = [];
var format = "en-US";
var prodSubTotal = [];
var totalProductsVal = 0;
var shippingVal = 0;
var cardType = null;
var cartQuantityItems = 0;
var localSV = false;

function formatNumber(num) {
    return new Intl.NumberFormat(format).format(num);
}

function loadProducts() {

    productsArray = [];
    let cart = JSON.parse(localStorage.getItem("Cart"));

    if (cart['Cars'].length == 0) {
        displayEmptyCart();
    }

    var productArray = cart['Cars'].length;
    var productArrayCheck = 0;

    cart['Cars'].forEach(element => {
        getJSONData(PRODUCT_INFO_URL + element.id + ".json").then(function (resultObj) {
            if (resultObj.status === "ok") {
                productsArray.push(resultObj.data);
                productsArray[productsArray.length - 1]['count'] = element.count;
                productArrayCheck++;
                if (productArray == productArrayCheck) {
                    showCart();
                };
            }
        });
    });
}

function showCart() {

    $('#cart-table-list').empty();

    cartQuantityItems = 0;

    for (let i = 0; i < productsArray.length; i++) {
        let product = productsArray[i];
        let content = '';

        if (product.currency != currency) {
            if (product.currency == "UYU") {
                product.cost = parseFloat(product.cost / 40).toFixed(2);
            } else {
                product.cost = parseInt(product.cost * 40).toFixed(1);
            };
            product.currency = currency;
        };

        if (product.count == 0) {
            product.count = 1;
        };

        prodSubTotal[i] = parseFloat((product.cost * product.count).toFixed(2));

        cartQuantityItems++;

        content = `
        <tr class="text-center">
            <td>
                <img class="img-fluid" src="${product.images[0]}" alt="${product.name}">
            </td>
            <td id="name${i}">
                ${product.name}
            </td>
            <td id="cost${i}">
                ${product.currency} ${product.cost} 
            </td>
            <td>
                <button class="addOrRemove" onclick="this.parentNode.querySelector('input[type=number]').stepDown();subTotal(${i},${product.cost});">-</button>
                <input id="quantityCart${i}" class="quantity cant" min="1" max="999" name="quantity" onchange="subTotal(${i},${product.cost});" value="${product.count}" type="number">
                <button class="addOrRemove" onclick="this.parentNode.querySelector('input[type=number]').stepUp();subTotal(${i},${product.cost});">+</button>
            </td>
            <td id="summary${i}">
                ${currency} ${formatNumber(prodSubTotal[i])}
            </td>
            <td>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${i})">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    <path fill-rule="evenodd" d="M6.646 5.646a.5.5 0 0 1 .708 0L8.5 6.793l1.146-1.147a.5.5 0 0 1 .708.708L9.207 7.5l1.147 1.146a.5.5 0 0 1-.708.708L8.5 8.207 7.354 9.354a.5.5 0 1 1-.708-.708L7.793 7.5 6.646 6.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                </button>
            </td>

        </tr>       
        `;

        $('#cart-table-list').append(content);
    }
    totalProducts();
    if (statusDiscount) {
        applyDiscount();
    }
}

function subTotal(i, cost) {
    if ($('#quantityCart' + i).val() <= 0) {
        $('#quantityCart' + i).val(1);
    } else if ($('#quantityCart' + i).val() > 999) {
        $('#quantityCart' + i).val(999);
    };

    prodSubTotal[i] = document.getElementById('quantityCart' + i).value * cost;
    document.getElementById("summary" + i).textContent = currency + ' ' + formatNumber(prodSubTotal[i]);

    let cart = JSON.parse(localStorage.getItem('Cart'));
    cart['Cars'][i]['count'] = document.getElementById('quantityCart' + i).value;
    localStorage.setItem('Cart', JSON.stringify(cart));

    totalProducts();

    if (statusDiscount) {
        applyDiscount();
    };
}

function totalProducts() {
    totalProductsVal = 0;
    for (let i = 0; i < productsArray.length; i++) {
        totalProductsVal += parseFloat(prodSubTotal[i]);
    }

    document.getElementById("currencyTotalProducts").innerText = currency;
    document.getElementById("totalProducts").innerText = formatNumber(totalProductsVal);

    shipping();
}

function shipping() {
    let porcen = $("input[name='shipping']:checked").val();

    $('#shipping, #shippingInfo').empty();
    $('#shipping').append("El costo por el envío será de " + porcen + "% y no se contará sobre el cupón.");

    let shippingInfo = "";
    if (porcen == 5) {
        shippingInfo = "12 y 15 días."
        $('#shippingInfo').css({ 'color': '#212529' });
    } else if (porcen == 7) {
        shippingInfo = "5 y 8 días."
        $('#shippingInfo').css({ 'color': '#212529' });
    } else {
        shippingInfo = "2 y 5 días.";
        $('#shippingInfo').css({ 'color': 'green' });
    }

    $('#shippingInfo').append("El envío demorara entre " + shippingInfo);

    shippingVal = 0;
    shippingVal = (porcen * totalProductsVal) / 100;

    document.getElementById("currencyShipping").innerText = currency;
    $('#shippingCost').text(formatNumber(shippingVal));
    total();
}

function total() {
    let total = "";
    if (discountValue == 0) {
        total = (parseFloat(shippingVal) + parseFloat(totalProductsVal));
    } else {
        total = (parseFloat(shippingVal) + parseFloat(prodTotal)).toFixed(2);
    };
    document.getElementById("currencyTotal").innerText = currency;
    document.getElementById('total').innerText = formatNumber(total);

    $('#totalModal')[0].innerText = currency + ' ' + formatNumber(total);

}

function deleteProduct(i) {
    if (confirm("¿Está seguro que desea eliminar el item?")) {
        let cart = JSON.parse(localStorage.getItem("Cart"));
        cart['Cars'].splice(i, 1);
        localStorage.setItem('Cart', JSON.stringify(cart));
        loadProducts();
    }

}

function discount() {
    let code = $('#discount-code').val();
    if (code != "jaimito") {
        $('#discount-code').addClass('is-invalid');
    } else {
        validDiscount(20);
    }
}

function validDiscount(num) {
    $('#discount-code').removeClass('is-invalid').addClass('is-valid').attr('disabled', 'disabled');
    $("#totalProducts, #currencyTotalProducts").addClass('crossOut');
    $('#currencyDiscountTotalProducts, #discountTotalProducts').css({ 'color': 'green' });

    document.getElementById("discount").innerText = num + "%!";

    discountValue = num;
    applyDiscount();
}

function applyDiscount() {
    statusDiscount = true;

    let disc = 0 + "." + discountValue;
    let discountPrice = parseFloat(totalProductsVal) * parseFloat(disc);

    prodTotal = parseFloat(parseFloat(totalProductsVal) - discountPrice);

    document.getElementById('discountTotalProducts').innerText = formatNumber(prodTotal);
    document.getElementById('currencyDiscountTotalProducts').innerText = currency;
    total();
}

function displayEmptyCart() {
    $('#cart-table-list, #totalProducts, #total, #shippingCost, #currencyTotalProducts, #currencyShipping, #currencyTotal').empty();

    $('#radioEnvio').attr('Disabled', 'Disabled');
    $('#option1, #option2, #option3').parent().removeClass('active');

    $('#discount-code').val("");
    $('#discount, #discountTotalProducts, #currencyDiscountTotalProducts').empty();

    $('#discount-code, #confirmButton').attr('Disabled', 'Disabled');
    $('#discount-code').removeClass('is-valid is-invalid');

    $('#totalModal, #shipping, #shippingInfo').empty();

    $('#shipping').append("Debe tener algo en el carrito para poder seleccionar el tipo de envío.");
    $('#shipping').css({ 'color': 'red' })

    $('#shippingBox').css({ 'display': 'none' });

    $('#noItems').addClass('show');
}

function verifyShippingInfo() {
    $('#shippingNumber, #shippingAddress, #shippingAddress2, #shippingCountries').on('change keyup focusout', function (e) {
        if ($('#shippingNumber')[0].checkValidity() && $('#shippingAddress')[0].checkValidity() && $('#shippingAddress2')[0].checkValidity()
            && $('#shippingCountries')[0].checkValidity()) {
            $('#errorShipping').css({ 'display': 'none' });
        } else {
            $('#errorShipping').css({ 'display': 'block' });
        }
    });

    $('#confirmButton').on('click', function (e) {
        if (!($('#shippingNumber')[0].checkValidity() && $('#shippingAddress')[0].checkValidity() && $('#shippingAddress2')[0].checkValidity()
            && $('#shippingCountries')[0].checkValidity())) {
            e.preventDefault();
            e.stopPropagation();
            $('#errorShipping').css({ 'display': 'block' });
        } else {
            $('#errorShipping').css({ 'display': 'none' });
        }
    });
}

function detectedSelectedCard() {
    new Cleave('.cardNumber', {
        creditCard: true,
        delimiter: '-',
        onCreditCardTypeChanged: function (type) {
            let creditCards = ".fa-cc-visa,.fa-cc-mastercard,.fa-cc-amex,.fa-cc-diners-club,.fa-cc-jcb,.fa-cc-discover"
            $(creditCards).removeClass('active');
            if (type === 'visa') {
                $('.fa-cc-visa').addClass('active');
                cardType = "visa";
            } else if (type === 'mastercard') {
                $('.fa-cc-mastercard').addClass('active');
                cardType = "mastercard";
            } else if (type === 'amex') {
                $('.fa-cc-amex').addClass('active');
                cardType = "amex";
            } else if (type === 'diners') {
                $('.fa-cc-diners-club').addClass('active');
                cardType = "diners";
            } else if (type === 'jcb') {
                $('.fa-cc-jcb').addClass('active');
                cardType = "jcb";
            } else if (type === 'discover') {
                $('.fa-cc-discover').addClass('active');
                cardType = "discover";
            } else {
                $(creditCards).removeClass('active');
                cardType = null;
            };
        }
    });
}

function checkCardPaymentMethodAvailable() {
    if (cardType == 'visa' || cardType == 'mastercard' || cardType == 'jcb' || cardType == 'discover') {
        $('#cardNumber').attr('pattern', '[0-9-]{19}');
    } else if (cardType == 'diners') {
        $('#cardNumber').attr('pattern', '[0-9-]{16}');
    } else if (cardType == 'amex') {
        $('#cardNumber').attr('pattern', '[0-9-]{17}');
    } else {
        $('#cardNumber').attr('pattern', '[0-9-]{30}');
    };
}

function paymentMethodValidation() {
    let formCreditCard = document.getElementById('needs-validation');

    $('#cardNumber').on('change keyup', function (e) {
        checkCardPaymentMethodAvailable();
    });

    formCreditCard.addEventListener('submit', function (event) {
        if (formCreditCard.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else if (localSV) {
            event.preventDefault();
            event.stopPropagation();
            getDataFromCart("card");
        } else {
            createCart(true);
        };
        formCreditCard.classList.add('was-validated');
    });

    let formAcc = document.getElementById('needs-validation-acc');

    formAcc.addEventListener('submit', function (event) {
        if (formAcc.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else if (localSV) {
            event.preventDefault();
            event.stopPropagation();
            getDataFromCart("acc");
        } else {
            createCart(true);
        };
        formAcc.classList.add('was-validated');
    });

    let formPaypal = document.getElementById('needs-validation-paypal');

    formPaypal.addEventListener('submit', function (event) {
        if (formPaypal.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else if (localSV) {
            event.preventDefault();
            event.stopPropagation();
            getDataFromCart("paypal");
        } else {
            createCart(true);
        };
        formPaypal.classList.add('was-validated');
    });
}

function changeCurrency() {
    $('#moneda').on('click', function (e) {
        if (currency == "USD") {
            currency = "UYU";
            format = "de-DE";
            $('#moneda').html('Cambiar a USD <i class="fa fa-dollar-sign"></i>');
        } else {
            currency = "USD";
            format = "en-US";
            $('#moneda').html('Cambiar a UYU <i class="fa fa-dollar-sign"></i>');
        }
        loadProducts();
    });
}

function detectDiscountCodeInput() {

    $('#discount-code').bind("enter", function (e) {
        discount();
    });

    $('#discount-code').on('keyup focusout', function (e) {
        if (e.type != "focusout") {
            if (e.keyCode == 13) {
                $(this).trigger("enter");
            }
        } else {
            discount();
        }
    });
}

function getDataFromCart(type) {

    let Orden = {
        Productos: [],
        Envio: {},
        Pago: {}
    };

    for (let i = 0; i < cartQuantityItems; i++) {
        let Auto = {};
        Auto['Nombre'] = document.getElementById('name' + i).innerText;
        Auto['Costo'] = document.getElementById('cost' + i).innerText;
        Auto['Cantidad'] = document.getElementById('quantityCart' + i).value;
        Auto['Total'] = document.getElementById('summary' + i).innerText;
        Orden.Productos.push(Auto);
    };

    if ($("input[name='shipping']:checked").val() == 5) {
        Orden.Envio['Tipo de envío'] = "Estándar";
        Orden.Envio['Porcentaje de cobro'] = 5;
    } else if ($("input[name='shipping']:checked").val() == 7) {
        Orden.Envio['Tipo de envío'] = "Express";
        Orden.Envio['Porcentaje de cobro'] = 7;
    } else {
        Orden.Envio['Tipo de envío'] = "Premium";
        Orden.Envio['Porcentaje de cobro'] = 15;
    }

    Orden.Envio['País'] = $('#shippingCountries').val();
    Orden.Envio['Dirección'] = $('#shippingAddress').val();
    Orden.Envio['Dirección segunda línea'] = $('#shippingAddress2').val();
    Orden.Envio['Número de puerta'] = $('#shippingNumber').val();

    if (statusDiscount) {
        Orden.Envio['Código de descuento'] = $('#discount-code').val();
    } else {
        Orden.Envio['Código de descuento'] = "Sin código";
    };

    Orden.Envio['Total'] = $('#total').html();

    if (type == "paypal") {

        Orden.Pago['Tipo de pago'] = "Paypal";
        Orden.Pago['Email de pago'] = $('#email').val();

    } else if (type == "acc") {

        Orden.Pago['Tipo de pago'] = "Cuenta bancaria";
        Orden.Pago['Banco'] = $('#bankName :selected').val();
        Orden.Pago['Número de cuenta'] = $('#accNumber').val();

    } else {

        Orden.Pago['Tipo de pago'] = "Tarjeta de crédito";
        Orden.Pago['Número de tarjeta'] = $('#cardNumber').val();
        Orden.Pago['Fecha de vencimiento'] = $('#expiryMonth').val();
        Orden.Pago['Código de seguridad'] = $('#code').val();
        Orden.Pago['Nombre'] = $('#name').val();
        Orden.Pago['Apellidos'] = $('#surnames').val();
        Orden.Pago['Dirección de facturación'] = $('#address').val();
        Orden.Pago['Dirección de facturación 2da línea'] = $('#address2').val();
        Orden.Pago['País'] = $('#countries :selected').val();
        Orden.Pago['Teléfono'] = $('#phoneNumber').val();
        Orden.Pago['Código postal'] = $('#postalCode').val();
        Orden.Pago['Localidad'] = $('#local').val();

    };

    savePayout(Orden);
}

function savePayout(Orden) {

    postJSONData(CART_CONFIRM_ORDER, Orden).then(function (resultObj) {
        if (resultObj.status === "ok") {
            createCart(true);
            alert(resultObj.data.mensaje);
            location.reload();
        };
    });

}

document.addEventListener("DOMContentLoaded", function (e) {

    checkLoggedUser();

    loadProducts();

    changeCurrency();

    $("input[name='shipping']").on('change', function (e) {
        shipping();
    });

    detectDiscountCodeInput()

    detectedSelectedCard();

    new Cleave('.expiryMonth', {
        date: true,
        datePattern: ['m', 'y']
    });

    $('#countries').on('change', function (e) {
        getJSONData(COUNTRY + $('#countries').val()).then(function (resultObj) {
            if (resultObj.status === "ok") {
                new Cleave('.phoneNumber', {
                    phone: true,
                    phoneRegionCode: resultObj.data[0].alpha2Code
                });
                $('#phoneNumber').prop('disabled', false);
            } else {
                $('#phoneNumber').prop('disabled', true);
            }
        });
    });

    getJSONData(COUNTRIES).then(function (resultObj) {
        if (resultObj.status === "ok") {
            resultObj.data.forEach(country => {
                $('#countries').append(`<option value="${country.name}" name="country">${country.name}</option>`);
                $('#shippingCountries').append(`<option value="${country.name}" name="country">${country.name}</option>`);
            });
        }
    });

    paymentMethodValidation();

    verifyShippingInfo();
});