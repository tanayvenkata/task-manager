import { useState } from "react";
import "./App.css";

const MainCard = ({ children }) => {
  return <div className="main-card">{children}</div>;
};

const ItemCard = ({ text, isCompleted, onToggle, onDelete, isEditing, editValue, onEditChange, onStartEdit, onSaveEdit }) => {
  return (
    <div className={`item-card ${isCompleted ? "completed" : ""}`}>
      {isEditing ? (
        <input
          className="edit-input"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveEdit();
          }}
          autoFocus
        />
      ) : (
        <span onClick={onToggle} className="item-text">
          {text}
        </span>
      )}
      <div className="button-group">
        <button onClick={isEditing ? onSaveEdit : onStartEdit} className="edit-button">
          {isEditing ? "save" : "edit"}
        </button>
        <button onClick={onDelete} className="delete-button">
          ×
        </button>
      </div>
    </div>
  );
};

const FilterBar = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <button 
        className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        all tasks
      </button>
      <button 
        className={`filter-button ${currentFilter === 'completed' ? 'active completed' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        completed tasks
      </button>
      <button 
        className={`filter-button ${currentFilter === 'incomplete' ? 'active incomplete' : ''}`}
        onClick={() => onFilterChange('incomplete')}
      >
        incomplete tasks
      </button>
    </div>
  );
};

function App() {
  const [items, setItems] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState('all');

  const handleAdd = () => {
    if (inputValue.trim()) {
      setItems([
        ...items,
        { id: nextId, text: inputValue.trim(), completed: false },
      ]);
      setNextId(nextId + 1);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const toggleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id) => {
    if (editValue.trim()) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, text: editValue.trim() } : item
        )
      );
    }
    setEditingId(null);
    setEditValue("");
  };

  const getFilteredItems = () => {
    switch(filter) {
      case 'completed':
        return items.filter(item => item.completed);
      case 'incomplete':
        return items.filter(item => !item.completed);
      default:
        return items;
    }
  };

  return (
    <>
      <MainCard>
        <h1 className="card-header">Task Manager</h1>
        <input
          type="text"
          placeholder="Enter text..."
          className="text-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="add-button" onClick={handleAdd}>
          Add
        </button>
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        <div style={{ marginTop: "1.5rem" }} className="item-list">
          {getFilteredItems().map((item) => (
            <ItemCard
              key={item.id}
              text={item.text}
              isCompleted={item.completed}
              isEditing={editingId === item.id}
              editValue={editValue}
              onEditChange={setEditValue}
              onToggle={() => toggleComplete(item.id)}
              onDelete={() => deleteItem(item.id)}
              onStartEdit={() => startEdit(item.id, item.text)}
              onSaveEdit={() => saveEdit(item.id)}
            />
          ))}
        </div>
      </MainCard>
    </>
  );
}

export default App;