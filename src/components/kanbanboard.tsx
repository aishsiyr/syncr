import PlusIcon from "../icons/plusicons";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColoumnContainer from "./coloumncontainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./taskcard";
// const defaultCols: Column[] = [
//   {
//     id: "todo",
//     title: "Todo",
//   },
//   {
//     id: "doing",
//     title: "Work in progress",
//   },
//   {
//     id: "done",
//     title: "Done",
//   },
// ];

// const defaultTasks: Task[] = [
//   {
//     id: "1",
//     columnId: "todo",
//     content:
//       "Explore and implement state-of-the-art natural language processing (NLP) techniques for text analysis",
//   },
//   {
//     id: "2",
//     columnId: "todo",
//     content:
//       "Research and integrate advanced computer vision algorithms for image recognition",
//   },
//   {
//     id: "3",
//     columnId: "doing",
//     content:
//       "Experiment with reinforcement learning algorithms to enhance model training and decision-making processes",
//   },
//   {
//     id: "4",
//     columnId: "doing",
//     content:
//       "Investigate and implement anomaly detection mechanisms for identifying unusual patterns in data",
//   },
//   {
//     id: "5",
//     columnId: "done",
//     content:
//       "Develop and deploy a recommendation system for personalized user experiences",
//   },
//   {
//     id: "6",
//     columnId: "done",
//     content:
//       "Conduct research on emerging ML frameworks and libraries for potential adoption",
//   },
//   {
//     id: "7",
//     columnId: "done",
//     content:
//       "Optimize and fine-tune existing ML models for improved accuracy and efficiency",
//   },
//   {
//     id: "8",
//     columnId: "todo",
//     content:
//       "Implement a secure and scalable infrastructure for handling large-scale ML datasets",
//   },
//   {
//     id: "9",
//     columnId: "todo",
//     content:
//       "Explore and implement federated learning approaches for privacy-preserving model training",
//   },
//   {
//     id: "10",
//     columnId: "todo",
//     content:
//       "Integrate machine learning models with edge computing devices for real-time processing",
//   },
//   {
//     id: "11",
//     columnId: "doing",
//     content:
//       "Design and implement a continuous integration/continuous deployment (CI/CD) pipeline for ML models",
//   },
//   {
//     id: "12",
//     columnId: "doing",
//     content:
//       "Collaborate with domain experts to gather labeled data and refine model training datasets",
//   },
// ];

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]); // Start with an empty array
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColoumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-cyan-500
      hover:ring-2
      flex
      gap-2 font-gabarito
    
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColoumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
  
    setColumns((prevColumns) => [...prevColumns, columnToAdd]);
  }
  
  

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    //handle task to drop a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // handle task dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
