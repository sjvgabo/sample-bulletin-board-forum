import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import * as Yup from "yup";
import User from "../models/User";
import { useStore } from "../stores";

type Props = {
  user: User;
  // handleEdit: ({value}: {value: boolean}) => void
  handleEdit: (value: boolean) => void;
};

const ProfileForm: React.FC<Props> = ({ user, handleEdit }) => {
  const store = useStore();
  const token = store.accountsStore.token;
  const handleCancel = () => {
    handleEdit(false);
  };

  const { handleSubmit, handleChange, values, touched, errors, resetForm } =
    useFormik({
      initialValues: {
        date_of_birth: user.date_of_birth.toString(),
        about_myself: user.about_myself,
        hometown: user.hometown,
        present_location: user.present_location,
        gender: user.gender,
        interests: user.interests,
        website: user.website,
      },
      validationSchema: Yup.object({
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
        await user.partialUpdateUser(values, token);
        await store.accountsStore.fetchUser(user.pk);
        resetForm();
        handleEdit(false);
      },
    });

  return (
    <form className="flex flex-col px-5" onSubmit={handleSubmit}>
      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="about_myself">
          About myself:
        </label>
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
      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="date_of_birth">
          Birthdate:
        </label>
        <input
          type="date"
          id="date_of_birth"
          name="date_of_birth"
          max="2022-10-10"
          min="1900-01-01"
          onChange={handleChange}
          value={values.date_of_birth}
          className="border-2 flex-1"
        />
      </div>
      {touched.date_of_birth && errors.date_of_birth ? (
        <div className="text-red-600 text-sm">{errors.date_of_birth}</div>
      ) : null}

      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="hometown">
          Hometown:
        </label>
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
      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="present_location">
          Present Location:
        </label>
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
      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="gender">
          Gender(optional):
        </label>
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
      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="interests">
          Interests(optional):
        </label>
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
      <div className="flex my-1.5">
        <label className="pr-2" htmlFor="website">
          Website(optional):
        </label>
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
      <div className="flex justify-center gap-2">
        <button
          className="bg-slate-600 hover:bg-slate-400 text-white px-2 py-1 rounded mt-1"
          type="submit"
        >
          Confirm Edit
        </button>
        <button
          className="bg-red-600 hover:bg-red-400 text-white px-2 py-1 rounded mt-1"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default observer(ProfileForm);
