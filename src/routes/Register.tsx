import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FormikErrors, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input, Error, Divider } from '../components/Form';
import { SocialProviders } from '../components/SocialProviders';
import { auth } from '../firebase';

type FormValues = {
  email: string;
  password: string;
  confirm: string;
};

export function Register() {
  const navigate = useNavigate();

  // Set up formik for login.
  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
      confirm: '',
    },
    validate(values) {
      const errors: FormikErrors<FormValues> = {};
      if (!values.email) errors.email = 'Please provide an email address.';
      if (!values.password) errors.password = 'Please provide a password.';
      if (values.password && values.password !== values.confirm) errors.confirm = 'Passwords do not match.';
      return errors;
    },
    async onSubmit(values, helpers) {
      try {
        console.log('Submitting form with values: ', values);
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        navigate('/');
      } catch (e) {
        // TODO(ehesp): switch on code to provide user friendly error messages.
        console.error(e);
        helpers.setStatus(e.message);
      }
    },
  });

  return (
    <section className="max-w-xl mx-auto my-20">
      <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900">Create a new account</h1>
      <p className="text-center mb-4 italic text-gray-600">
        Already have account?{' '}
        <Link to="/signin" className="text-indigo-700 hover:underline">
          Sign in
        </Link>
        .
      </p>
      <Card>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <Input
            id="email"
            label="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.dirty ? formik.errors.email : undefined}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.dirty ? formik.errors.password : undefined}
          />
          <Input
            type="password"
            id="confirm"
            label="Confirm Password"
            value={formik.values.confirm}
            onChange={formik.handleChange}
            error={formik.dirty ? formik.errors.confirm : undefined}
          />
          {!!formik.status && <Error>{formik.status}</Error>}
          <button
            disabled={!formik.isValid}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <Divider>Or continue with</Divider>
        <div className="mt-6">
          <SocialProviders />
        </div>
      </Card>
    </section>
  );
}
