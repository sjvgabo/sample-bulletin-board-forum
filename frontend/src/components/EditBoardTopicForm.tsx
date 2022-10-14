import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import Topic from "../models/Topic";
import { useStore } from "../stores";

type Props = {
  handleChangeTopic: (topicPk: number) => void;
  boardPk: number;
};
const EditBoardTopicForm: React.FC<Props> = ({
  handleChangeTopic,
  boardPk,
}) => {
  const store = useStore();
  const navigate = useNavigate();
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      topic: boardPk,
    },
    validationSchema: Yup.object({
      topic: Yup.number().required("Message must not be empty"),
    }),
    onSubmit: (values) => {
      handleChangeTopic(values.topic);
      navigate("/")
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
            <option key={topic.pk} className="border"  value={topic.pk}>
              {topic.name}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
};

export default observer(EditBoardTopicForm);
