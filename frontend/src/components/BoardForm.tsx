import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import * as Yup from "yup";
import { useStore } from "../stores";

type Props = {
  topicPk: number;
};
const BoardForm: React.FC<Props> = ({ topicPk }) => {
  const store = useStore();

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name must not be empty"),
      description: Yup.string().required("Description must not be empty"),
    }),
    onSubmit: async (values) => {
      await store.contentStore.createBoard(
        values.name,
        values.description,
        topicPk
      );
    },
  });

  return (
    <form className="flex flex-col py-20 pr-32" onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        className="border-2 h-10 mb-2"
        type="text"
        id="name"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      <label>Description</label>
      <input
        className="border-2 h-20 mb-2"
        type="text"
        id="description"
        name="description"
        value={values.description}
        onChange={handleChange}
      />
      <button
        className="bg-slate-400 text-white px-2 py-1 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default observer(BoardForm);
