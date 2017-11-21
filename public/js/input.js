
const MAX_CURRENCIES = 10
const MAX_INVESTMENT = 1


var inputs = new Vue({
    el: '#controller',
    data: {
        MAX_CURRENCIES,
        MAX_INVESTMENT,
        inputs: [{
            ticker: '',
            amount: 0
        }]
    },
    methods: {
        newInp: function () {
            if (this.inputs.length > this.MAX_CURRENCIES) {
                return false
            }
            this.inputs.push({
                ticker: '',
                amount: 0
            })
        }
    }
})
