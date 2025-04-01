import { useState } from "react";
import "./App.css";
import { Button, Checkbox, Form, Input, Row } from "antd";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaEdit } from "react-icons/fa";

type Task = { value: string; id: number | string; checked: boolean };

type FormValues = { task: string };

function App() {
  const [selectedTask, setSelectedTask] = useState<string | number>("");
  const [editedValue, setEditedValue] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [form] = Form.useForm<FormValues>();

  function onFinish(values: FormValues) {
    const { task } = values;
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
    <div>
      <h1>Tarefas Diárias</h1>
      <h2>Adicione uma tarefa</h2>
      <Form className="add-task-container" onFinish={onFinish} form={form}>
        <Form.Item name="task" required>
          <Input
            style={{
              width: "30rem",
              backgroundColor: "black",
              color: "white",
              borderRadius: "4px",
              padding: 8,
            }}
          />
        </Form.Item>
        <Form.Item>
          <button className="custom-button">Adicionar</button>
        </Form.Item>
      </Form>
      <div className="container">
        {tasks?.map((task: Task) =>
          task.id === selectedTask ? (
            <Row
              style={{
                padding: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
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
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#333",
                  width: "90%",
                }}
                onChange={(event) => {
                  setEditedValue(event.target.value);
                }}
              />
              <Button icon={<FaCheck />} onClick={finishEdit} />
            </Row>
          ) : (
            <Row
              key={task.id}
              style={{
                padding: "10px",
                gap: "16px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Checkbox
                  className="custom-checkbox"
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
                  className={task.checked ? "checked" : ""}
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {task.value}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  onClick={() => deleteTask(task.id)}
                  icon={<MdDelete />}
                  type="primary"
                  danger
                />
                <Button
                  onClick={() => {
                    setSelectedTask(task.id);
                    setEditedValue(task.value);
                  }}
                  icon={<FaEdit />}
                  type="default"
                />
              </div>
            </Row>
          )
        )}
      </div>
    </div>
  );
}

export default App;
