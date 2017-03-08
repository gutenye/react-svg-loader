#!/usr/bin/env babel-node

import { transform } from 'babel-core'
import generate from 'babel-generator'
import plugin from '../src/plugin'
import template from 'babel-template'
import * as t from 'babel-types'
global.pd = console.log.bind(console)

var code = `
<svg style='text-align: center; width: 100px;height:100px' fill="#ddd" pointer-events="stroke">
  <circle cx="50" cy="50" r="25" style="text-align: center; stroke: #000000;" stroke-width="5" />
</svg>
`

pd(transform(code, {
  babelrc: false,
  plugins: ['syntax-jsx', plugin]
}).code)
