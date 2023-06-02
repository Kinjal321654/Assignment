import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormWrapper = styled.form`
  max-width: 400px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Error = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const App = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [check, setCheck] = useState();


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    questions.forEach((question) => {
      if (question.required && !formData[question.name]) {
        validationErrors[question.name] = 'This field is required';
      }
      if (question.pattern && !RegExp(question.pattern).test(formData[question.name])) {
        validationErrors[question.name] = 'Invalid format';
      }
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.entries(formData).map(([name, value]) => ({ name, value }))),
        });
        if (response.status === 200 || response.status === 201) {
          console.log('Form submitted successfully');
          setFormData({});
        } else {
          setCheck(response.status);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      {questions.map((question) => (
        <FormGroup key={question.id}>
          {question.label && <Label htmlFor={question.id}>{question.label}</Label>}
          {question.legend && <legend>{question.legend}</legend>}
          {question.type === 'radio' && (
            <fieldset>
              {question.options.map((option) => (
                <div key={option.id}>
                  <input
                    type="radio"
                    id={option.id}
                    name={question.name}
                    value={option.value}
                    checked={formData[question.name] === option.value}
                    onChange={handleChange}
                  />
                  <label htmlFor={option.id}>{option.label}</label>
                </div>
              ))}
            </fieldset>
          )}
          {question.type !== 'radio' && (
            <Input
              type={question.type}
              id={question.id}
              name={question.name}
              value={formData[question.name] || ''}
              onChange={handleChange}
              required={question.required}
              pattern={question.pattern}
              aria-invalid={errors[question.name] ? 'true' : 'false'}
              aria-describedby={`${question.id}-error`}
            />
          )}
          {errors[question.name] && (
            <Error id={`${question.id}-error`} role="alert">
              {errors[question.name]}
            </Error>
          )}
        </FormGroup>
      ))}
      <Button type="submit">Submit</Button>
      {check === 404 && <div>Internal server Error Api Not Responding</div>}
    </FormWrapper>
  );
};

export default App;