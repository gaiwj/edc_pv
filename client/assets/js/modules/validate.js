var tms = tms || {};

(function($) {
    var me = this;
    me.validate = me.validate || {};

    this.validate.isRequired = function (value) {
        if(!$.trim(value)) {
            return false;
        }
        return true;
    }

    this.validate.isMobile = function (mobile) {
        if (!mobile) {
            return false;
        } else {
            var reg = new RegExp(/^1[3|4|5|8|7|9][0-9]\d{8}$/);
            if (!reg.test(mobile)) {
                return false;
            }
        }
        return true;
    };

    this.validate.isEmail = function (email) {
        if (!email) {
            return false;
        } else {
            var reg = new RegExp(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i);
            if (!reg.test(email)) {
                return false;
            }
        }
        return true;
    };

    this.validate.isPwd=function(pwd){
        if (!pwd) {
            return false;
        } else {
            var reg = new RegExp(/(?=.*[a-zA-Z])(?=.*\d)^[\w\-~!@,#$%^&*/\.\'\;()+{}[ \]:]{6,20}$/i);
            if (!reg.test(pwd)) {
                return false;
            }
        }
        return true;
    }

    this.validate.isDate = function (date) {
        if (!date) {
            return false;
        } else {
            var reg = new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (!reg.test(date)) {
                return false;
            }
        }
        return true;
    };

    this.validate.isTelephone = function (telephone) {
        if(!telephone) {
            return false;
        } else {
            var reg = new RegExp(/^((\d{3,4}-)?\d{7,8})$|^(1[3|4|5|8|7|9][0-9]\d{8})$/);
            if (!reg.test(telephone)) {
                return false;
            }
        }
        return true;
    }

    this.validate.errorMessage = function (text) {
        var errorEl =  $('.error-message');
        if(errorEl.length == 0) {
            errorEl = $('<div class="error-message"></div>');
            $("form").prepend(errorEl);
        }
        if(text){
            $('.error-message')
                .show()
                .addClass('form-message form-message-error')
                .text(text);

        }else{
            $('.error-message').hide()
        }
    }
}).call(tms, jQuery);
