function Validator(options) {
    let selectorRules = {};
    console.log("2")
    //ham thuc hien validate
    function validate(inputElement, rule) {
        console.log("3")
        const errElement = inputElement.parentElement.querySelector(options.errSelector);

        let errorMessage;
        //lay ra cac rule cua selector
        const rules = selectorRules[rule.selector];
        //lap qua tung rule  & kiem tra
        //neu co loi thi dung kiem tra
        for (let i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);

            if (errorMessage) break;
        }

        if (errorMessage) {
            console.log("4")

            errElement.innerText = errorMessage;
            errElement.style.color = 'red'
            inputElement.style.border = "1px solid red";
            // inputElement.parentElement.classList.add('is-invalid');
        } else {
            errElement.innerText = "";
            inputElement.style.border = "1px solid #D2D2D2";
            // inputElement.parentElement.classList.remove('is-invalid');
        }
        return !errorMessage;
    }

    //lay element cua form can validate
    const formElement = document.querySelector(options.form);

    if (formElement) {
        console.log("1")
        formElement.onsubmit = function (e) {
            e.preventDefault();

            let isFormValid = true;

            //Lap qua tung rule va validate luon
            options.rules.forEach(function (rule) {
                const inputElement = formElement.querySelector(rule.selector);
                const isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                //truong hop submit vs js
                if (typeof options.onSubmit === 'function') {
                    const enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                    const formValues = Array.from(enableInputs).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues);
                }// truong hop submit voi hanh vi mac dinh
                else {
                    formElement.submit();
                }
            }

        }
        //lap qua moi rule va xu ly(lang nghe su kien blur, input...)
        options.rules.forEach(function (rule) {
            // luu lai cac rule trong moi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            const inputElement = formElement.querySelector(rule.selector);

            // console.log(inputElement)
            if (inputElement) {
                //xu ly truong hop blur khoi input
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }

                //xu ly moi khi nguoi dung nhap
                inputElement.oninput = function () {
                    const errElement = inputElement.parentElement.querySelector(options.errSelector);
                    errElement.innerText = "";
                    inputElement.style.border = "1px solid #D2D2D2";
                }
            }
        })
    }
}

// khi co loi tra ra mess loi
//khi hop le => ko tra cai gi ca(undefine)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || "Vui long nhap truong nay"
        }
    }
}
Validator.isPhone = function (selector,message) {
    return {
        selector: selector,
        test: function (value) {
            const regexPhone = /^[0-9]+$/;
            console.log(regexPhone)
            return regexPhone.test(value) ? undefined : message || "Vui long nhap truong nay"
        }

    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui long nhap vao toi thieu ${min} ki tu`;
        }

    }
}