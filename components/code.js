import React, { Component } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

class CodeSnippet extends Component {
  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    return (
      <div className='w-full my-6'>
        <h2>Step 3: Copy this tests to Postman</h2>
        <pre className='w-full mt-4 text-left border line-numbers'>
          <code className='language-javascript'>{this.props.code}</code>
        </pre>
      </div>
    );
  }
}

export default CodeSnippet;
