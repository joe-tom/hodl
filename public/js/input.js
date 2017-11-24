
const MAX_CURRENCIES = 10
const MAX_INVESTMENT = 1


var inputs = new Vue({
    el: '#controller',
    data: {
        MAX_CURRENCIES,
        MAX_INVESTMENT,
        inputs: [{
            ticker: '',
            amount: 0,
            price: 0,
            prop: 0,
            bad: false
        }],
        name: ""
    },
    methods: {
        newInp: function () {
            if (this.inputs.length > this.MAX_CURRENCIES) {
                return false
            }
            this.inputs.push({
                ticker: '',
                amount: 0,
                price: 0,
                prop: 0,
                bad: false
            })
        },
        propSum: function () {
            var value = (this.inputs.reduce(function (a,c) {
                return a+(+c.prop)
            }, 0))

            value /= 100

            return (MAX_INVESTMENT - value)
        },
        price: function (inp) {
            var self = this

            inp.amount = 0
            var request = new XMLHttpRequest()
            request.open('GET', '/api/price/'+inp.ticker, true)


            // Set up the amount we bought and the price.
            request.onload = function() {
              if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText)

                if (data.error) {
                    inp.bad = true
                } else  {
                    inp.bad = false
                    inp.price = data.data
                    inp.amount = self.amount(inp)
                }
              }
            }

            request.send()
        },
        amount: function (inp) {
            var amount = (inp.prop / 100) / inp.price

            return (!isFinite(amount) || isNaN(amount))
                ? 0
                : amount
        },
        remove: function (index) {
            this.inputs.splice(index, 1)
        },
    }
})


function done(token) {
    var request = new XMLHttpRequest()
    request.open('POST', '/api/post', true)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send([
        "token=", token, "&",
        "inps=", JSON.stringify(inputs.inputs), "&",
        "name=", inputs.name
    ].join(''))
}