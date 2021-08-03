import { ErrorMessage, Field, Form, Formik } from 'formik';
import { has, isPlainObject, keys, values } from 'lodash';
import Head from 'next/head';
import { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      output: '',
      done: false,
    };
  }

  generateTests = () => {
    this.state.done = false;
    this.state.output = '';
    let input = this.state.input;

    let jsonInput = JSON.parse(this.state.input);
    // if (!isPlainObject(input)) {
    //   alert(`This data type of "${typeof input}" is not supported yet :(`);
    //   return;
    // }

    const vals = values(jsonInput);
    vals.forEach((val) => {
      if (typeof val === 'object') {
        alert(`This data type of "${typeof val}" is not supported yet :(`);
        return;
      }
    });

    // this.state.output += 'is object\n';
    this.state.output += `
      pm.test('response body should be an object', () => {
        const responseJson = pm.response.json();
        pm.expect(responseJson).to.be.an('object');
      });
      `;

    const properties = keys(jsonInput);
    properties.forEach((property) => {
      // this.state.output += `has ${property}\n`;
      this.state.output += `
      pm.test('response body should have the correct property of "${property}"', () => {
        const responseJson = pm.response.json();

        pm.expect(responseJson).to.have.ownProperty('${property}');
      });
      `;

      const datatype = typeof jsonInput[property];
      // this.state.output += `property ${property} is ${datatype}\n`;
      this.state.output += `
      pm.test('response body should have the correct data type for "${property}"', () => {
        const responseJson = pm.response.json();

        pm.expect(responseJson.${property}).to.be.an('${datatype}');
        pm.expect(responseJson.${property}).not.eq(undefined);
        pm.expect(responseJson.${property}).not.eq(null);
      });
      `;

      if (jsonInput[property]) {
        // this.state.output += `property ${property} has value of \"${jsonInput[property]}\"\n`;
        this.state.output += `
        pm.test('response body should have the correct and value for "${property}"', () => {
          const responseJson = pm.response.json();

          pm.expect(responseJson.${property}).to.equals('${jsonInput[property]}');
        });
        `;
      }
    });

    console.log(this.state.output);
    this.state.done = true;
  };

  renderResult = () => {
    const { output } = this.state;

    return (
      <div className='w-full my-6'>
        <h2>Step 3: Copy this tests to Postman</h2>
        <textarea
          className='w-full mt-4 border'
          rows='10'
          id='output'
          value={output}
          readOnly></textarea>
      </div>
    );
  };

  render() {
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

          <div className='w-full mt-6'>
            <h2>Step 1: Paste your response here</h2>
            <Formik
              initialValues={{ input: '' }}
              validate={(values) => {
                const errors = {};
                if (!values.input) {
                  errors.input = 'Response body is required';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                this.setState({
                  input: values.input,
                });
                this.generateTests();
                setSubmitting(false);
              }}>
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <Field
                      name='input'
                      as='textarea'
                      className='w-full mt-4 border'
                      rows='10'
                      placeholder="{'message': 'Hello World'}"
                    />
                    <ErrorMessage
                      name='input'
                      className='text-red-500'
                      component='div'
                    />
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='px-4 py-2 mt-6 border'>
                      Step 2: 💪 Click to generate test cases 💪
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>

          {this.state.done && this.renderResult()}
        </main>

        <footer className='flex items-center justify-center w-full h-24 border-t'>
          <a
            className='flex items-center justify-center'
            href='https://www.github.com/arifikhsan/postman-test-generator-next'
            target='_blank'
            rel='noopener noreferrer'>
            GitHub Repository
          </a>
        </footer>
      </div>
    );
  }
}

export default Home;
