# language-divoc [<img src="https://avatars2.githubusercontent.com/u/9555108?s=200&v=4)" alt="alt text" height="20">](https://www.openfn.org) [![Build Status](https://travis-ci.org/OpenFn/language-divoc.svg?branch=master)](https://travis-ci.org/OpenFn/language-divoc)

An OpenFn **_adaptor_** for building integration jobs for use with the
[DIVOC API](https://divoc.egov.org.in/tech-docs#developer-docs).

## Documentation

- View the documentation at https://openfn.github.io/adaptor/
- To update the documentation site, run:
  `./node_modules/.bin/jsdoc --readme ./README.md ./lib -d docs`

### sample configuration

```json
{
  "baseUrl": "https://divoc.sub.io",
  "token": "some-super-long-token-shhhhhhhhhhh"
}
```

### generate a DIVOC vaccine certificate

N.B., the body should contain all data required for the certificate, including
preEnrollmentCode with a unique identifier.

```js
certify({
  ...stuff,
  preEnrollmentCode: 'some-uuid',
});
```

### Fetch the PDF for a generated DIVOC Certificate

N.B. the identifier should be the preEnrollmentCode sent when generating the
certificate.

```js
getCertificate({
  id: dataValue('preEnrollmentCode'),
});
```

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
