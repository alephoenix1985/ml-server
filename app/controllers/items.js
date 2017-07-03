'use strict';

const apiMLSearch = 'https://api.mercadolibre.com/sites/MLA/search';
const apiMLItem = 'https://api.mercadolibre.com/items/';
const apiMLItemDescription = 'https://api.mercadolibre.com/items/:id/description';

var request = require('request');

module.exports = {
    search: search,
    get: get
};

function search(req, res) {
    var r = req.query;
    request.get({url: apiMLSearch, qs: {q: r.q}}, function (error, response, body) {
            var final;
            var result = JSON.parse(body);
            if (result) {
                var topCat = {results: 0};
                final = {
                    author: {
                        name: "Alejandro",
                        lastname: "Hernandez"
                    }
                };
                if (result['available_filters']) {
                    var categoryFilter = result['available_filters'].find(function (af) {
                        return af.id === "category"
                    });
                    final.categories = categoryFilter && categoryFilter.values && categoryFilter.values.length ? categoryFilter.values.map(function (c) {
                        if (c.results >= topCat.results) {
                            topCat = c
                        }
                        return c.name
                    }) : [];
                    final.topCategory = topCat.name;
                }
                if (result.results) {
                    final.items = result.results.slice(0, 4).map(function (i) {
                        function getDecimalsFromPrice(p) {
                            var s = (p + "").split('.');
                            return s && s.length >= 2 ? s[1].length : 0
                        }

                        return {
                            id: i.id,
                            title: i.title,
                            price: {
                                currency: i.currency_id,
                                amount: i.price,
                                decimals: getDecimalsFromPrice(i.price)
                            },
                            picture: i.thumbnail,
                            condition: i.condition,
                            free_shipping: i.shipping.free_shipping
                        }
                    })
                }

                return res.send(final);
            }
        }
    )
}

function get(req, res) {
    var r = req.params;
    request.get(apiMLItem + r.id, function (error, response, body) {
        var final;
        var result = JSON.parse(body);
        if (result) {

            final = {
                author: {
                    name: "Alejandro",
                    lastname: "Hernandez"
                }
            };
            final.category = result.category_id;
            final.item = {
                id: result.id,
                title: result.title,
                price: {
                    currency: result.price,
                    amount: result.price,
                    decimals: getDecimalsFromPrice(result.price)
                },
                picture: result.thumbnail,
                condition: result.condition,
                free_shipping: result.shipping.free_shipping,
                sold_quantity: result.sold_quantity,
                description: result.descriptions.join(',')
            };
            request.get(apiMLItemDescription.replace(':id', r.id), function (error, response, body) {
                var result = JSON.parse(body);
                if (result) {
                    final.item.description = result.text;
                    return res.send(final);
                }
            })
        }

    })
}

function getDecimalsFromPrice(p) {
    var s = (p + "").split('.');
    return s && s.length >= 2 ? s[1].length : 0
}