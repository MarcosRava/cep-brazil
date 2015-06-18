var url = 'http://m.correios.com.br/movel/buscaCepConfirma.do';
var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');

function get(zipCode) {
  var deferred = Q.defer();
  zipCode = String(zipCode);
  if (zipCode.length !== 8) {
    deferred.reject({error: true, errorMsg: 'Zipcode must be a string with 8 characters!'});
    return;
  }
  var form = { metodo: 'buscarCep', cepEntrada: zipCode};
  request.post({url: url, form: form, encoding: 'binary'}, function (err, response, body) {
    if (err || (response && response.statusCode > 300)) {
      deferred.reject({error: true, errorMsg: response ? response.body : err});
      return;
    }
    var $ = cheerio.load(body.replace(/\r?\n/g, ""), {
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: true
    });
    if ($('.erro').length > 0) {
      deferred.reject({error: true, errorMsg: $('.erro').text().trim()});
      return;
    }
    var resp = $('.caixacampobranco .respostadestaque');
    if (resp.length === 0) {
      deferred.reject({error: true, errorMsg: 'Response error'});
      return;
    }
    var data = {};
    if (resp.length == 2) {
       data = {
        "city": $(resp[0]).text().split('\t/')[0].trim(),
        "state": $(resp[0]).text().split('\t/')[1].trim(),
        "zipCode": $(resp[1]).text().trim()
      };

    } else {
       data = {
        "street": $(resp[0]).text().trim(),
        "district": $(resp[1]).text().trim(),
        "city": $(resp[2]).text().split('/')[0].trim(),
        "state": $(resp[2]).text().split('/')[1].trim(),
        "zipCode": $(resp[3]).text().trim()
      };
    }
    deferred.resolve(data);
  });
  
  return deferred.promise;
}
if (process.argv[2]) {
  get(process.argv[2])
  .then(function (data) {
    console.log(data);
  }).fail(function(err) {
      console.log(err);
      return;
  });
}

exports.get = get;
