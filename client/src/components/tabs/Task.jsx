import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "./firebase"; // Import Firebase config
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const Task = () => {
  const [task, setTask] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [tasks, setTasks] = useState([]);

  const users = [
    { id: "Alice", name: "Alice" },
    { id: "Bob", name: "Bob" },
    { id: "Charlie", name: "Charlie" },
  ];

  const statusOptions = ["All", "Pending", "Completed"];
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAssign = async () => {
    if (task && assignedUser) {
      await addDoc(collection(db, "tasks"), {
        task,
        assignedUser,
        status: "Pending",
      });
      setTask("");
      setAssignedUser("");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    await updateDoc(doc(db, "tasks", taskId), { status });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const filteredTasks = tasks.filter((t) => (filterStatus === "All" ? true : t.status === filterStatus));

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ width: { xs: "90vw", md: "60vw", lg: "50vw" }, height: "80vh", overflowY: "auto", padding: 3, boxShadow: 3 }}>
        <CardHeader title={<Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>Task Assignment</Typography>} />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField label="Enter task" value={task} onChange={(e) => setTask(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} fullWidth>
                <MenuItem value="" disabled>Select User</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="primary" onClick={handleAssign} fullWidth disabled={!task || !assignedUser}>Assign</Button>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Typography variant="subtitle1">Filter by Status:</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {statusOptions.map((status) => (
                <Chip key={status} label={status} onClick={() => setFilterStatus(status)} color={filterStatus === status ? "primary" : "default"} />
              ))}
            </Box>
          </Box>
          <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>Tasks</Typography>
          <AnimatePresence>
            {filteredTasks.map((t) => (
              <motion.div key={t.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card sx={{ marginBottom: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>{t.task}</Typography>
                    <Typography variant="body2">Assigned to: {t.assignedUser}</Typography>
                    <Typography variant="body2" sx={{ color: t.status === "Completed" ? "green" : "red", fontWeight: "bold" }}>Status: {t.status}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
                    <Button variant="contained" color="secondary" onClick={() => updateTaskStatus(t.id, "Completed")} disabled={t.status === "Completed"}>Mark Done</Button>
                    <Button variant="outlined" color="error" onClick={() => deleteTask(t.id)}>Delete</Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Task;
