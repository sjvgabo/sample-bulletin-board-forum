import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import Topic from "../models/Topic";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";
import ErrorMessage from "./ErrorMessage";

type Props = {
  handleChangeTopic: (topicPk: number) => Promise<void>;
  topicPk: number;
};
const EditBoardTopicForm: React.FC<Props> = ({
  handleChangeTopic,
  topicPk,
}) => {
  const store = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      topic: topicPk,
    },
    validationSchema: Yup.object({
      topic: Yup.number().required("Message must not be empty"),
    }),
    onSubmit: async (values) => {
      try {
        await handleChangeTopic(values.topic);
        navigate("/");
      } catch (err) {
        setError(getErrorMessage(err));
      }
    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <label>
        <button
          className="text-xs bg-slate-600 text-white p-1 rounded-md"
          type="submit"
        >
          CHANGE TOPIC
        </button>
        <select name="topic" value={values.topic} onChange={handleChange}>
          {store.contentStore.topics.map((topic: Topic) => (
            <option key={topic.pk} className="border" value={topic.pk}>
              {topic.name}
            </option>
          ))}
        </select>
      </label>
      {error && <ErrorMessage message={error} />}
    </form>
  );
};

export default observer(EditBoardTopicForm);
