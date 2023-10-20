import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Chart from "react-apexcharts";

class App extends Component {
    constructor(props) {
        super(props);

        // Setting up state
        this.state = {
            taskName: "",
            taskStory: "",
            taskEstimation: "",
            taskPriority: "",
            taskAssignee: "",
            taskHoursWorked: "",
            taskDeadline: "",
            taskStatus: "",
            taskCategory: "", // New state for task category
            list: [],
            cardView: true,
            series: [], // Series for "Hours Worked Over Time" chart
            tasksCompletedByDate: {}, // New state for tasks completed by date
            tasksCompletedSeries: [], // Series for "Date vs. Tasks Done" chart
            options: {
                xaxis: {
                    type: "datetime",
                },
                chart: {
                    id: "hours-worked",
                    height: 350,
                    type: "line",
                },
                title: {
                    text: "Hours Worked Over Time",
                    align: "center",
                },
                yaxis: {
                    title: {
                        text: "Hours Worked",
                    },
                },
            },
        };
    }

    // Set a user input value
    updateTaskName(value) {
        this.setState({
            taskName: value,
        });
    }

    // Set a story value
    updateTaskStory(value) {
        this.setState({
            taskStory: value,
        });
    }

    // Set an estimation value
    updateTaskEstimation(value) {
        this.setState({
            taskEstimation: value,
        });
    }

    // Set a priority value
    updateTaskPriority(value) {
        this.setState({
            taskPriority: value,
        });
    }

    // Set an assignee value
    updateTaskAssignee(value) {
        this.setState({
            taskAssignee: value,
        });
    }

    // Set hours worked value
    updateTaskHoursWorked(value) {
        this.setState({
            taskHoursWorked: value,
        });
    }

    // Set deadline date value
    updateTaskDeadline(value) {
        this.setState({
            taskDeadline: value,
        });
    }

    // Set task status value
    updateTaskStatus(value) {
        this.setState({
            taskStatus: value,
        });
    }

    updateTaskCategory(value) {
        this.setState({
            taskCategory: value,
        });
    }

    prepareTasksCompletedSeries() {
        const { tasksCompletedSeries } = this.state;

        return [
            {
                name: "Tasks Completed",
                data: tasksCompletedSeries,
            },
        ];
    }
expandCard(index) {
        const updatedList = [...this.state.list];
        updatedList[index].expanded = true; // Set the "expanded" property to true for the clicked card

        this.setState({
            list: updatedList,
        });
    }


    // Add item if user input is not empty
    addItem() {
        const {
            taskName,
            taskStory,
            taskEstimation,
            taskPriority,
            taskAssignee,
            taskHoursWorked,
            taskDeadline,
            taskStatus,
            taskCategory, // Include task category in the state
        } = this.state;
        if (
            taskName !== "" &&
            taskStory !== "" &&
            taskEstimation !== "" &&
            taskPriority !== "" &&
            taskAssignee !== "" &&
            taskHoursWorked !== "" &&
            taskDeadline !== "" &&
            taskStatus !== "" &&
            taskCategory !== "" // Check if category is selected
        ) {
            const newTask = {
                id: Math.random(),
                name: taskName,
                story: taskStory,
                estimation: taskEstimation,
                priority: taskPriority,
                assignee: taskAssignee,
                hoursWorked: taskHoursWorked,
                deadline: taskDeadline,
                status: taskStatus,
                category: taskCategory,
            };

            // Update list
            const updatedList = [...this.state.list, newTask];

            // Update hours worked chart
            const series = this.updateHoursWorkedSeries(updatedList);

            // Add task to the "Date vs. Tasks Done" chart data
            this.updateTasksCompletedByDate(newTask);

            // Reset state
            this.setState({
                list: updatedList,
                taskName: "",
                taskStory: "",
                taskEstimation: "",
                taskPriority: "",
                taskAssignee: "",
                taskHoursWorked: "",
                taskDeadline: "",
                taskStatus: "",
                taskCategory: "", // Reset category
                series: series,
            });
        }
    }

    // Function to delete item from list using id to delete
    deleteItem(key) {
        const updatedList = [...this.state.list.filter((task) => task.id !== key)];

        // Update hours worked chart
        const series = this.updateHoursWorkedSeries(updatedList);

        this.setState({
            list: updatedList,
            series: series,
        });
    }

    editTask = (index) => {
        let updatedList = [...this.state.list];
        const itemToEdit = updatedList[index];

        const editedName = prompt('Edit the task name:', itemToEdit.name);
        if (editedName !== null && editedName.trim() !== '') {
            itemToEdit.name = editedName;
        }

        const editedStory = prompt('Edit the task story:', itemToEdit.story);
        if (editedStory !== null) {
            itemToEdit.story = editedStory;
        }

        const editedEstimation = prompt('Edit the task estimation value:', itemToEdit.estimation);
        if (editedEstimation !== null && !isNaN(Number(editedEstimation))) {
            itemToEdit.estimation = Number(editedEstimation);
        }

        const editedPriority = prompt('Edit the task priority value:', itemToEdit.priority);
        if (editedPriority !== null) {
            itemToEdit.priority = editedPriority;
        }

        const editedAssignee = prompt('Edit the task assignee:', itemToEdit.assignee);
        if (editedAssignee !== null) {
            itemToEdit.assignee = editedAssignee;
        }

        const editedHoursWorked = prompt('Edit the hours worked:', itemToEdit.hoursWorked);
        if (editedHoursWorked !== null && !isNaN(Number(editedHoursWorked))) {
            itemToEdit.hoursWorked = Number(editedHoursWorked);
        }

        const editedDeadline = prompt('Edit the deadline date:', itemToEdit.deadline);
        if (editedDeadline !== null) {
            itemToEdit.deadline = editedDeadline;
        }

        const editedStatus = prompt('Edit the task status:', itemToEdit.status);
        if (editedStatus !== null) {
            itemToEdit.status = editedStatus;
        }

        // Update hours worked chart
        const series = this.updateHoursWorkedSeries(updatedList);

        this.setState({
            list: updatedList,
            series: series,
        });
    }

    toggleView() {
        this.setState((prevState) => ({
            cardView: !prevState.cardView,
        }));
    }

    // Function to update the "Hours Worked" series for the chart
    updateHoursWorkedSeries(list) {
        const seriesData = list.reduce((acc, task) => {
            const taskDate = new Date(task.deadline).getTime();
            return [...acc, [taskDate, task.hoursWorked]];
        }, []);

        return [
            {
                name: "Hours Worked",
                data: seriesData,
            },
        ];
    }

    // Function to update tasks completed by date for the "Date vs. Tasks Done" chart
    updateTasksCompletedByDate(task) {
        const { deadline, status } = task;
        if (status === "Completed") {
            const taskDate = new Date(deadline).toDateString();
            this.setState((prevState) => {
                const updatedTasksCompletedByDate = { ...prevState.tasksCompletedByDate };
                updatedTasksCompletedByDate[taskDate] = (updatedTasksCompletedByDate[taskDate] || 0) + 1;
                const tasksCompletedSeries = Object.entries(updatedTasksCompletedByDate).map(([date, count]) => [new Date(date).getTime(), count]);
                return {
                    tasksCompletedByDate: updatedTasksCompletedByDate,
                    tasksCompletedSeries: tasksCompletedSeries,
                };
            });
        }
    }

    render() {
        const filteredTasks = this.state.list;

        return (
            <Container>
                <Row
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "4rem",
                        fontWeight: "lighter",
                    }}
                >
                    PROJECT MANAGEMENT TOOL
                </Row>
                <Row
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "2rem",
                        fontWeight: "lighter",
                    }}
                >
                    FOR FIT2101 BY TEAM 22
                </Row>

                <hr />
                <Row>
                    <Col md={{ span: 9, offset: 1 }}>
                        <InputGroup className="mb-3">
                            <FormControl
                                type="text"
                                placeholder="Task Name"
                                value={this.state.taskName}
                                onChange={(item) =>
                                    this.updateTaskName(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                type="text"
                                placeholder="Task Description"
                                value={this.state.taskStory}
                                onChange={(item) =>
                                    this.updateTaskStory(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                type="number"
                                pattern="[0-9]*"
                                placeholder="Task Difficulty Estimation"
                                value={this.state.taskEstimation}
                                onChange={(item) =>
                                    this.updateTaskEstimation(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                type="number"
                                pattern="[0-9]*"
                                placeholder="Task Priority"
                                value={this.state.taskPriority}
                                onChange={(item) =>
                                    this.updateTaskPriority(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                type="text"
                                placeholder="Assignee"
                                value={this.state.taskAssignee}
                                onChange={(item) =>
                                    this.updateTaskAssignee(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                type="number"
                                pattern="[0-9]*"
                                placeholder="Hours Worked"
                                value={this.state.taskHoursWorked}
                                onChange={(item) =>
                                    this.updateTaskHoursWorked(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                type="date"
                                placeholder="Deadline Date"
                                value={this.state.taskDeadline}
                                onChange={(item) =>
                                    this.updateTaskDeadline(item.target.value)
                                }
                            />
                            <br />
                            <FormControl
                                as="select"
                                placeholder="Task Status"
                                value={this.state.taskStatus}
                                onChange={(item) =>
                                    this.updateTaskStatus(item.target.value)
                                }
                            >
                                <option value="">Select Status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </FormControl>
                            <FormControl
                                as="select"
                                placeholder="Category"
                                value={this.state.taskCategory}
                                onChange={(item) =>
                                    this.updateTaskCategory(item.target.value)
                                }
                            >
                                <option value="">Select Category</option>
                                <option value="Backend">Backend</option>
                                <option value="Frontend">Frontend</option>
                                {/* Add more categories as needed */}
                            </FormControl>
                            <InputGroup>
                                <Button
                                    variant="outline-primary"
                                    className="mt-2"
                                    onClick={() => this.addItem()}
                                >
                                    ADD A TASK TO THE BACKLOG
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    className="mt-2 ml-2"
                                    onClick={() => this.toggleView()}
                                >
                                    Toggle View: {this.state.cardView ? "Card" : "List"}
                                </Button>
                            </InputGroup>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.state.cardView ? (
                         <div className="card-deck">
                                {filteredTasks.map((item, index) => {
                                    const isExpanded = item.expanded || false;

                                    return (
                                        <Card key={item.id} style={{ width: "18rem", margin: "10px" }}>
                                            <Card.Header>
                                                <strong>Name:</strong> {item.name}
                                            </Card.Header>
                                            <Card.Body>
                                                    {isExpanded ? (
                                                <Card.Text>
                                                    <p><strong>Story:</strong> {item.story}</p>
                                                    <p><strong>Estimation:</strong> {item.estimation}</p>
                                                    <p><strong>Priority:</strong> {item.priority}</p>
                                                    <p><strong>Assignee:</strong> {item.assignee}</p>
                                                    <p><strong>Hours Worked:</strong> {item.hoursWorked}</p>
                                                    <p><strong>Deadline Date:</strong> {item.deadline}</p>
                                                    <p><strong>Status:</strong> {item.status}</p>
                                                    <p><strong>Category:</strong> {item.category}</p>
                                                </Card.Text>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => this.expandCard(index)}
                                                >
                                                    Show Details
                                                </Button>
                                            )}
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button
                                                variant="light"
                                                onClick={() => this.editTask(index)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="light"
                                                onClick={() => this.deleteItem(item.id)}
                                            >
                                                Delete
                                            </Button>
                                            </Card.Footer>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <ListGroup>
                                {filteredTasks.map((item, index) => {
                                    return (
                                        <div key={item.id}>
                                            <ListGroup.Item
                                                variant="dark"
                                                action
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <div>
                                                    <p><strong>Name:</strong> {item.name}</p>
                                                    <p><strong>Story:</strong> {item.story}</p>
                                                    <p><strong>Estimation:</strong> {item.estimation}</p>
                                                    <p><strong>Priority:</strong> {item.priority}</p>
                                                    <p><strong>Assignee:</strong> {item.assignee}</p>
                                                    <p><strong>Hours Worked:</strong> {item.hoursWorked}</p>
                                                    <p><strong>Deadline Date:</strong> {item.deadline}</p>
                                                    <p><strong>Status:</strong> {item.status}</p>
                                                    <p><strong>Category:</strong> {item.category}</p> {/* Display category here */}
                                                </div>
                                                <span>
                                                    <Button
                                                        style={{ marginRight: "15px" }}
                                                        variant="light"
                                                        onClick={() => this.deleteItem(item.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="light"
                                                        onClick={() => this.editTask(index)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </span>
                                            </ListGroup.Item>
                                        </div>
                                    );
                                })}
                            </ListGroup>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="line"
                            height={350}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Chart
    options={{
        xaxis: {
            type: "datetime",
        },
        chart: {
            id: "tasks-done",
            height: 350,
            type: "line",
        },
        title: {
            text: "Tasks Done Vs Time", // Change the title to "Tasks Done"
            align: "center",
        },
        yaxis: {
            title: {
                text: "Tasks Done", // You can customize the y-axis title here
            },
        },
    }}
    series={this.prepareTasksCompletedSeries()}
    type="line"
    height={350}
/>

                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;