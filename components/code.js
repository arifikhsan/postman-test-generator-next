import React, { Component } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import CopyToClipboard from 'react-copy-to-clipboard';

class CodeSnippet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeHtml: '',
      copied: false,
    };
  }
  componentDidMount() {
    Prism.highlightAll();

    var Normalizer = require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
    var nw = new Normalizer({
      'remove-trailing': true,
      'remove-indent': true,
      'left-trim': true,
      'right-trim': true,
      // 'break-lines': 80,
      // indent: 2,
      'remove-initial-line-feed': false,
      'tabs-to-spaces': 4,
      'spaces-to-tabs': 4,
    });
    let code = nw.normalize(this.props.code);
    let codeHtml = Prism.highlight(code, Prism.languages.javascript);
    this.setState({
      codeHtml,
    });
  }

  copyToClipboard = (e) => {
    const a = this.code;
    a.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    this.setState({ copied: 'Copied!' });
  };

  onCopy = () => {
    this.setState({ copied: true });
  };

  render() {
    return (
      <div className='w-full my-6'>
        <h2>Step 3: Copy this tests to Postman</h2>
        {/* <button onClick={this.copyToClipboard}>Copy</button> */}

        <pre
          ref={(code) => {
            this.code = code;
          }}
          className='w-full mt-4 text-left border line-numbers'>
          <code
            className='language-javascript'
            dangerouslySetInnerHTML={{
              __html: this.state.codeHtml,
            }}></code>
        </pre>
      </div>
    );
  }
}

export default CodeSnippet;
