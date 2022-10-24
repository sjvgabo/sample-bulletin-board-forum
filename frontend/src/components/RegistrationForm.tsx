import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import * as Yup from "yup";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";
import ErrorMessage from "./ErrorMessage";

type Props = {
  handleNavigate: () => void;
};
const RegistrationForm: React.FC<Props> = ({ handleNavigate }) => {
  const store = useStore();
  const [error, setError] = useState<string>();

  const { handleSubmit, handleChange, values, touched, errors, resetForm } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        about_myself: "",
        hometown: "",
        present_location: "",
        gender: "",
        interests: "",
        website: "",
      },
      validationSchema: Yup.object({
        username: Yup.string()
          .min(8, "Atleast 8 characters")
          .required("Required"),
        password: Yup.string()
          .min(8, "Atleast 8 characters")
          .required("Required")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Password too weak. Include a special character, number, and both lowercase and uppercase"
          ),
        first_name: Yup.string().trim().required("Required"),
        last_name: Yup.string().trim().required("Required"),
        email: Yup.string().email().required("Required"),
        date_of_birth: Yup.string().trim().required("Required"),
        about_myself: Yup.string().trim().required("Required"),
        hometown: Yup.string()
          .trim()
          .max(50, "Max of 50 characters")
          .required("Required"),
        present_location: Yup.string()
          .trim()
          .max(100, "Max of 100 characters")
          .required("Required"),
        gender: Yup.string().max(10, "Max of 10 characters").notRequired(),
        interests: Yup.string().max(200, "Max of 200 characters").notRequired(),
        website: Yup.string().max(50, "Max of 50 characters").notRequired(),
      }),
      onSubmit: async (values) => {
        try {
          await store.accountsStore.createUser(values);
          resetForm();
          handleNavigate();
        } catch (error) {
          setError(getErrorMessage(error));
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
      {touched.username && errors.username ? (
        <div className="text-red-600 text-sm">{errors.username}</div>
      ) : null}
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
      {touched.password && errors.password ? (
        <div className="text-red-600 text-sm">{errors.password}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="first_name">First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          onChange={handleChange}
          value={values.first_name}
          className="border-2 flex-1"
        />
      </div>
      {touched.first_name && errors.first_name ? (
        <div className="text-red-600 text-sm">{errors.first_name}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          onChange={handleChange}
          value={values.last_name}
          className="border-2 flex-1"
        />
      </div>
      {touched.last_name && errors.last_name ? (
        <div className="text-red-600 text-sm">{errors.last_name}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={handleChange}
          value={values.email}
          className="border-2 flex-1"
        />
      </div>
      {touched.email && errors.email ? (
        <div className="text-red-600 text-sm">{errors.email}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="date_of_birth">Birthdate:</label>
        <input
          type="date"
          max="2022-10-12"
          id="date_of_birth"
          name="date_of_birth"
          onChange={handleChange}
          value={values.date_of_birth}
          className="border-2 flex-1"
        />
      </div>
      {touched.date_of_birth && errors.date_of_birth ? (
        <div className="text-red-600 text-sm">{errors.date_of_birth}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="about_myself">About myself:</label>
        <textarea
          id="about_myself"
          name="about_myself"
          onChange={handleChange}
          value={values.about_myself}
          className="border-2 flex-1"
        />
      </div>
      {touched.about_myself && errors.about_myself ? (
        <div className="text-red-600 text-sm">{errors.about_myself}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="hometown">Hometown:</label>
        <input
          type="text"
          id="hometown"
          name="hometown"
          onChange={handleChange}
          value={values.hometown}
          className="border-2 flex-1"
        />
      </div>
      {touched.hometown && errors.hometown ? (
        <div className="text-red-600 text-sm">{errors.hometown}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="present_location">Present Location:</label>
        <input
          type="text"
          id="present_location"
          name="present_location"
          onChange={handleChange}
          value={values.present_location}
          className="border-2 flex-1"
        />
      </div>
      {touched.present_location && errors.present_location ? (
        <div className="text-red-600 text-sm">{errors.present_location}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="gender">Gender(optional):</label>
        <input
          type="text"
          id="gender"
          name="gender"
          onChange={handleChange}
          value={values.gender}
          className="border-2 flex-1"
        />
      </div>
      {touched.gender && errors.gender ? (
        <div className="text-red-600 text-sm">{errors.gender}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="interests">Interests(optional):</label>
        <textarea
          id="interests"
          name="interests"
          onChange={handleChange}
          value={values.interests}
          className="border-2 flex-1"
        />
      </div>
      {touched.interests && errors.interests ? (
        <div className="text-red-600 text-sm">{errors.interests}</div>
      ) : null}
      <div className="flex my-1">
        <label htmlFor="website">Website(optional):</label>
        <input
          type="text"
          id="website"
          name="website"
          onChange={handleChange}
          value={values.website}
          className="border-2 flex-1"
        />
      </div>
      {touched.website && errors.website ? (
        <div className="text-red-600 text-sm">{errors.website}</div>
      ) : null}
      <button
        className="bg-slate-400 text-white px-2 py-1 rounded mt-1"
        type="submit"
      >
        Create Account
      </button>
      {error && <ErrorMessage message={error} />}
    </form>
  );
};

export default observer(RegistrationForm);
