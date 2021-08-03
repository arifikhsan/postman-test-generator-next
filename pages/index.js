import { has, isPlainObject, keys, values } from 'lodash';
import Head from 'next/head';
import { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '{"message": "hello"}',
      output: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  generateTests = () => {
    this.state.output = '';
    const input = JSON.parse(this.state.value);

    if (Array.isArray(input)) {
      alert('Array is not supported yet :(');
    }

    if (!isPlainObject(input)) {
      alert(`This data type of ${typeof input} is not supported yet :(`);
    }

    const vals = values(input);
    vals.forEach((val) => {
      if (typeof val === 'object') {
        alert(`This data type of ${typeof val} is not supported yet :(`);
      }
    });

    // this.state.output += 'is object\n';
    this.state.output += `
      pm.test('response body should be an object', () => {
        const responseJson = pm.response.json();
        pm.expect(responseJson).to.be.an('object');
      });
      \n\n`;

    const properties = keys(input);
    properties.forEach((property) => {
      // this.state.output += `has ${property}\n`;
      this.state.output += `
      pm.test('response body should have the correct property of "${property}"', () => {
        const responseJson = pm.response.json();

        pm.expect(responseJson).to.have.ownProperty('${property}');
      });
      \n\n`;

      const datatype = typeof input[property];
      // this.state.output += `property ${property} is ${datatype}\n`;
      this.state.output += `
      pm.test('response body should have the correct data type for "${property}"', () => {
        const responseJson = pm.response.json();

        pm.expect(responseJson.${property}).to.be.an('${datatype}');
        pm.expect(responseJson.${property}).not.eq(undefined);
        pm.expect(responseJson.${property}).not.eq(null);
      });
      \n\n`;

      if (input[property]) {
        // this.state.output += `property ${property} has value of \"${input[property]}\"\n`;
        this.state.output += `
        pm.test('response body should have the correct and value for "${property}"', () => {
          const responseJson = pm.response.json();

          pm.expect(responseJson.${property}).to.equals('${input[property]}');
        });
        \n\n`;
      }
    });

    console.log(this.state.output);
  };

  render() {
    const { output } = this.state;

    return (
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <Head>
          <title>Postman Test Generator</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className='flex flex-col items-center flex-1 w-full px-4 text-center md:px-20 md:justify-center'>
          <h1 className='text-4xl font-bold md:text-6xl'>
            Postman Test Generator
          </h1>

          <p className='mt-3 text-2xl'>Generate test case by json response.</p>

          <div className='mt-6'>
            <h2>Step 1: Paste your response here</h2>
            <textarea
              value={this.state.value}
              onChange={this.handleChange}
              className='w-full mt-4 border'
              rows='5'
              placeholder="{'message': 'Hello World'}"></textarea>
          </div>
          <button
            className='px-4 py-2 mt-6 border'
            onClick={this.generateTests}>
            Generate test cases 🎆
          </button>
          <div className='mt-6'>
            <h2>Step 2: Copy this tests to Postman {output}</h2>
            {/* <p>{this.state.value}</p>
            <p>{this.state.output}</p> */}
            <textarea className='mt-4' value={output} readOnly></textarea>
          </div>
        </main>

        <footer className='flex items-center justify-center w-full h-24 border-t'>
          <a
            className='flex items-center justify-center'
            href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'>
            Powered by{' '}
            <img src='/vercel.svg' alt='Vercel Logo' className='h-4 ml-2' />
          </a>
        </footer>
      </div>
    );
  }
}

export default Home;
