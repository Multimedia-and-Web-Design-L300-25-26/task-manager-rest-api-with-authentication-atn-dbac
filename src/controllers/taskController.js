import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      title,
      description,
      owner: req.user._id
    });

    const savedTask = await task.save();

    res.status(201).json(savedTask);
  }
  catch (error) {
    res.status(500).json({message: error.message});
  }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user._id
    });
    res.status(200).json(tasks);
  }
  catch (error) {
    res.status(500).json({message: error.message});
  }
};

//delete a task belonging to an authenticated user
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({message: "Task deleted" });
  }
  catch (error) {
    res.status(500).json({message: error.message});
  }
}
