import cssToObj from './css-to-obj';
import {hyphenToCamel, namespaceToCamel} from './camelize';
import template from 'babel-template'

const build = template(`
  import React from 'react'
  import styled from 'styled-components'

  export default class Icon extends React.Component {
    render() {
      const {className, size, small, large, ...rest} = this.props
      const size_ = size || large ? '2em' : small ? '1em' : '1.3em'
      const props = {
        ...rest,
        width: size_,
        className: 'icon ' + (className || ''),
      }
      return SOURCE
    }
  }

  const SVG = styled.svg\`
    \${p => p.button && \`
      cursor: pointer;
    \`}

    \${p => p.gray && \`
      color: #c6cbd1;
      &:hover { color: #959da5; }
    \`}
  \`
`, {
  sourceType: 'module',
  plugins: ['jsx', 'objectRestSpread'],
})

export default function (babel) {
  const t = babel.types;

  const attrVisitor = {
    JSXAttribute(path) {
      if (t.isJSXNamespacedName(path.node.name)) {
        // converts
        // <svg xmlns:xlink="asdf">
        // to
        // <svg xmlnsXlink="asdf">
        path.node.name = t.jSXIdentifier(
          namespaceToCamel(path.node.name.namespace.name, path.node.name.name.name)
        );
      } else if (t.isJSXIdentifier(path.node.name)) {
        // converts
        // <tag class="blah blah1"/>
        // to
        // <tag className="blah blah1"/>
        if (path.node.name.name === 'class') {
          //path.node.name.name = "className";
        }

        // converts
        // <tag style="text-align: center; width: 50px">
        // to
        // <tag style={{textAlign: 'center', width: '50px'}}>
        if (path.node.name.name === 'style') {
          let csso = cssToObj(path.node.value.value);
          let properties = Object.keys(csso).map(prop => t.objectProperty(
            t.identifier(hyphenToCamel(prop)),
            t.stringLiteral(csso[prop])
          ));
          path.node.value = t.jSXExpressionContainer(
            t.objectExpression(properties)
          );
        }

        if (path.node.name.name.indexOf('data-') !== 0) {
          // converts
          // <svg stroke-width="5">
          // to
          // <svg strokeWidth="5">
          path.node.name.name = hyphenToCamel(path.node.name.name);
        }
      }
    }
  };

  // converts
  // <svg>
  // to
  // <SVG {...this.props}>
  // after passing through attributes visitors
  const svgVisitor = {
    JSXOpeningElement(path) {
      if (path.node.name.name.toLowerCase() === 'svg') {
        path.node.name.name = 'SVG'
        // add spread props
        path.node.attributes.push(t.jSXSpreadAttribute(t.identifier('props')));
      }
    },

    JSXClosingElement(path) {
      if (path.node.name.name.toLowerCase() === 'svg') {
        path.node.name.name = 'SVG'
      }
    }
  };

  // converts
  // <svg/>
  // to
  // import React from 'react';
  // export default class SVG extends React.Component { render() { <svg/> }}
  // after passing through other visitors
  const svgExpressionVisitor = {
    ExpressionStatement(path) {
      if (!t.isJSXElement(path.node.expression)) return;
      if (path.node.expression.openingElement.name.name !== 'svg') return;
      const SOURCE = path.node.expression
      const nodes = build({SOURCE})
      path.replaceWithMultiple(nodes)
    }
  }

  return {
    visitor: Object.assign({}, svgExpressionVisitor, svgVisitor, attrVisitor)
  };
}
