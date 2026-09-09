import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import TaskCard from '../components/TaskCard';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [quote, setQuote] = useState("Loading today's motivation...");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const loadedTasks = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
        setTasks(loadedTasks);
      },
      (error) => {
        console.error('Firestore listener error:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch(() => setQuote('Believe in yourself and get it done!'));
  }, []);

  async function handleAddTask() {
    if (taskText.trim() === '') {
      setErrorMessage('Please type a task before adding it.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setErrorMessage('User session not found. Please log in again.');
      return;
    }
    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskText,
        done: false,
        ownerId: user.uid,
      });
      setTaskText('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleToggleTask(id, currentDone) {
    try {
      await updateDoc(doc(db, 'tasks', id), { done: !currentDone });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteTask(id) {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleLogout() {
    signOut(auth).catch((error) => setErrorMessage(error.message));
  }

  return (
    <View style={styles.container}>
      <Button title="Log Out" onPress={handleLogout} />
      <Text style={styles.quote}>💡 {quote}</Text>

      <Button
        title="New Quote"
        onPress={() => {
          fetch('https://api.quotable.io/random')
            .then((response) => response.json())
            .then((data) => setQuote(data.content));
        }}
      />

      <Text style={styles.heading}>Add a Task</Text>

      <TextInput
        style={styles.input}
        placeholder="What do you need to do?"
        value={taskText}
        onChangeText={setTaskText}
      />

      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      <Button
        title="Add Task"
        onPress={handleAddTask}
      />

      <Text>You have {tasks.length} task(s)</Text>

      {tasks.length > 0 && tasks.every((t) => t.done) && (
        <Text style={styles.celebration}>🎉 All done! Great work!</Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            done={item.done}
            onToggle={() => handleToggleTask(item.id, item.done)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet — add one above! 📝</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D8DEE9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  error: {
    color: '#B23A48',
    marginBottom: 10,
  },

  celebration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8A7A',
    textAlign: 'center',
    marginVertical: 12,
  },

  quote: {
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },

  list: {
    marginTop: 16,
  },

  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
  },

  separator: {
    height: 8,
  },
});
