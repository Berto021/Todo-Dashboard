import { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Row } from "antd";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaEdit } from "react-icons/fa";
import { MainHeader } from "./MainHeader";

type Task = { value: string; id: number | string; checked: boolean };
type FormValues = { task: string };

export const MainContainer = () => {
  const [selectedTask, setSelectedTask] = useState<string | number>("");
  const [editedValue, setEditedValue] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(
    JSON.parse(localStorage.getItem("tasks") || "[]")
  );

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function onFinish(values: FormValues) {
    const { task } = values;

    if (!task) return;

    const id = crypto.randomUUID();
    const currentTask = { value: task, id, checked: false };

    setTasks((prevValues) => [...prevValues, currentTask]);
    form.resetFields();
  }

  function finishEdit() {
    setTasks((prevValues) =>
      prevValues.map((item) => ({
        ...item,
        value: item.id === selectedTask ? editedValue : item.value,
      }))
    );
    setSelectedTask("");
    setEditedValue("");
  }

  function deleteTask(id: number | string) {
    setTasks((prevValues) => prevValues.filter((task) => task.id !== id));
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900">
      <MainHeader />
      <Form
        className="flex flex-row gap-4 w-[30rem]"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item name="task" required className="w-full">
          <Input
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring focus:ring-blue-500"
            placeholder="Digite sua tarefa..."
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="w-full p-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            Adicionar
          </Button>
        </Form.Item>
      </Form>

      <div className="w-[50rem] h-[25rem] overflow-auto border border-gray-700 rounded-lg p-4 bg-gray-800 mt-4 shadow-lg">
        {tasks?.map((task: Task) =>
          task.id === selectedTask ? (
            <Row
              key={task.id}
              className="p-2.5 bg-white border border-gray-300 rounded-lg shadow-md flex items-center justify-between mb-2.5"
            >
              <Input
                ref={(input) => {
                  if (input) {
                    input.focus();
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") finishEdit();
                }}
                value={editedValue}
                onChange={(event) => setEditedValue(event.target.value)}
                style={{ width: "40rem" }}
              />
              <Button
                className="ml-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                icon={<FaCheck />}
                onClick={finishEdit}
              />
            </Row>
          ) : (
            <Row
              key={task.id}
              className="p-2.5 gap-4 bg-gray-700 border border-gray-600 rounded-lg shadow-md flex items-center justify-between mb-2.5"
            >
              <div className="flex gap-2 flex-row items-center">
                <Checkbox
                  className="w-5 h-5"
                  checked={task.checked}
                  onChange={(event) => {
                    setTasks((prevValues) =>
                      prevValues?.map((item) => ({
                        ...item,
                        checked:
                          item.id === task.id
                            ? event.target.checked
                            : item.checked,
                      }))
                    );
                  }}
                />
                <p
                  className={`m-0 text-base font-medium ${
                    task.checked ? "text-gray-400 line-through" : "text-white"
                  }`}
                >
                  {task.value}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="p-2 transition"
                  onClick={() => deleteTask(task.id)}
                  icon={<MdDelete />}
                />
                <Button
                  className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  onClick={() => {
                    setSelectedTask(task.id);
                    setEditedValue(task.value);
                  }}
                  icon={<FaEdit />}
                />
              </div>
            </Row>
          )
        )}
      </div>
    </div>
  );
};
