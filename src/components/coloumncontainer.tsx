import React, { useState, useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types";
import TrashIcon from "../icons/trashicon";
import PlusIcon from "../icons/plusicons";
import TaskCard from "./taskcard";
import { SortableContext } from "@dnd-kit/sortable";

interface Props {
column: Column;
deleteColumn: (id: Id) => void;
updateColumn: (id: Id, value: string) => void;
createTask: (columnId: Id) => void;
deleteTask: (id: Id) => void;
updateTask: (id: Id, value:string) => void;
tasks: Task[];
}

function ColoumnContainer({ column, updateTask,  tasks, deleteTask, deleteColumn, createTask, updateColumn }: Props) {
const [editMode, setEditMode] = useState(false);

const handleDeleteColumn = () => {
    deleteColumn(column.id);
};

const {
    setNodeRef,
    isDragging,
    attributes,
    listeners,
    transform,
    transition,
} = useSortable({
    id: column.id,
    data: {
    type: "column",
    column,
    },
    disabled: editMode,
});

const containerStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
};

const columnContainerClass = isDragging
    ? "bg-coloumnBackground opacity-60 border-2 border-cyan-500"
    : "";

const handleContainerClick = () => {
    if (!editMode) setEditMode(true);
};

const handleTrashButtonClick = () => {
    handleDeleteColumn();
};

const handleInputBlur = () => {
    setEditMode(false);
};

const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Enter") {
    setEditMode(false);
    }
};

const renderTitle = () =>
    editMode ? (
    <input
        className="bg-black focus:border-cyan-500 border-rounded outline-none px-2"
        autoFocus
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        onChange={(e) => updateColumn(column.id, e.target.value)}
    />
    ) : (
    <div>{column.title}</div>
    );

    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id);
    }, [tasks]);
    
return (
    <div
    ref={setNodeRef}
    {...attributes}
    {...listeners}
    onClick={handleContainerClick}
    style={containerStyle}
    className={`${columnContainerClass} w-[350px] h-[500px] rounded-md flex flex-col`}
    >
    <div className="bg-coloumnBackground w-[300px] h-[400px] max-h-[500px] flex flex-col">
        <div className="bg-mainBackgroundColor text-md rounded-md flex items-center justify-between  font-semibold h-[60px] p-3 cursor-grab">
        <div className="flex gap-2">
            {/* <div className="flex rounded-full justify-center items-center bg-coloumnBackground px-2 py-1 text-sm">
            0
            </div> */}
        </div>
        {/* {renderTitle()} */}
        <div>
  <button
    onClick={handleTrashButtonClick}
    className={` bg-coloumnBackground  text-white shadow-md rounded-full px-1 py-1  hover:from-cyan-600 hover:to-lime-500 hover:shadow-lg focus:outline-none ml-56 focus:ring focus:border-blue-300`}
  >
    <TrashIcon className="w-5 h-5 " />
  </button>
</div>
        <div className="flex flex-grow"></div>
        </div>

        <div className="flex flex-grow flex-col gap-4 p-3 overflow-x-hidden">
       
        <SortableContext items={tasksIds}>
        {tasks &&
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
      </SortableContext>
        </div>
   
        <button
        className="flex gap-2 items-center font-gabarito border-coloumnBackground rounded-md border-2 p-4 border-x-coloumnBackground hover:bg-mainBackgroundColor hover:text-cyan-500 active:bg-black rounded-md"
        onClick={() => createTask(column.id)}
        >
        <PlusIcon /> Add Task
        </button>
    </div>
    </div>
);
}

export default ColoumnContainer;
