#!/usr/bin/env babel-node

import { transform } from 'babel-core'
import generate from 'babel-generator'
import plugin from './src/plugin'
import template from 'babel-template'
import * as t from 'babel-types'
global.pd = console.log.bind(console)

var code1 = `
<svg xmlns:xlink="asdf">
  <path d="m16.6 33.4h-8.2v-13.4h-5l16.6-15 16.6 15h-5v13.4h-8.2v-10h-6.8v10z"/>
</svg>
`


var code = `
<svg style='text-align: center; width: 100px;height:100px' fill="#ddd" pointer-events="stroke">
  <circle cx="50" cy="50" r="25" style="text-align: center; stroke: #000000;" stroke-width="5" />
</svg>
`

//pd(1, t.binaryExpression("*", t.numberLiteral(1), t.numberLiteral(2)))
//pd(2, template(`export default 1`, {sourceType: 'module'})())


pd(transform(code, {
  babelrc: false,
  plugins: ['syntax-jsx', plugin]
}).code)

/*
pd(generate(template(`
  <div>{FOO}</div>
`, {
  plugins: ['jsx']
})({
  FOO: 'a'
})).code)

*/
