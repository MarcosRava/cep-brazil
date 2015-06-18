# cep-brazil

Get zip-code info

## Usage

``` js
var cep = require('cep-brazil');
cep.get('04193020')
  .then(function (data) {
    console.log(data);
    /*
      { street: 'Rua Doutor Benedito Tolosa',
        district: 'Parque Bristol',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04193020' 
      }

    */
  }).fail(function(err) {
      console.log(err);
      return;
  });

```