import { useFormik } from "formik";
import React from "react";
import { useStore } from "../stores";
import * as Yup from 'yup';
import { useNavigate } from "react-router";


const LoginForm = () => {
  let navigate = useNavigate();
  const store = useStore();
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(8, "Atleast 8 characters").required('Required'),
      password: Yup.string().min(8, "Atleast 8 characters").required('Required'),
    }),
    onSubmit: async(values) => {
      let loginSuccess = await store.accountsStore.authUser(values);
      if (loginSuccess) {
        navigate('/');
      }
    },
  });
  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex my-1">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleChange}
              value={values.username}
              className="border-2 flex-1"
            />
          </div>
          {touched.username && errors.username ? <div className="text-red-600 text-sm">{errors.username}</div> : null}
          <div className="flex my-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={values.password}
              className="border-2 flex-1"
            />
          </div>
          {touched.password && errors.password ? <div className="text-red-600 text-sm">{errors.password}</div> : null}
          <button className="bg-slate-400 text-white px-2 py-1 rounded mt-1" type="submit">Login</button>
        </form>
  )
}

export default LoginForm;