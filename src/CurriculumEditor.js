import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialData = [
    {
        id: "1",
        content: "Chapter 1",
        children: [
            { id: "2", content: "Topic 1.1", children: [] },
            { id: "3", content: "Topic 1.2", children: [] },
        ],
    },
    {
        id: "4",
        content: "Chapter 2",
        children: [{ id: "5", content: "Topic 2.1", children: [] }],
    },
];

const CurriculumEditor = () => {
    const [data, setData] = useState(initialData);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const source = result.source;
        const destination = result.destination;

        const newData = [...data];
        const [removed] = newData[source.droppableId].children.splice(source.index, 1);
        newData[destination.droppableId].children.splice(destination.index, 0, removed);

        setData(newData);
    };

    const handleDelete = (parentId, index) => {
        const newData = [...data];
        newData[parentId].children.splice(index, 1);
        setData(newData);
    };

    const renderNode = (parentId, node, index) => {
        return (
            <Draggable key={node.id} draggableId={node.id} index={index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, paddingLeft: "20px" }}>
                        <div>
                            <input type="text" value={node.content} onChange={(e) => handleContentChange(parentId, index, e.target.value)} />
                            <button onClick={() => handleDelete(parentId, index)}>Delete</button>
                        </div>
                        {node.children.length > 0 && (
                            <Droppable droppableId={node.id} type="TASK">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {node.children.map((childNode, childIndex) => renderNode(node.id, childNode, childIndex))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}
                    </div>
                )}
            </Draggable>
        );
    };

    const handleContentChange = (parentId, index, value) => {
        const newData = [...data];
        newData[parentId].children[index].content = value;
        setData(newData);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="curriculum" type="COLUMN" direction="vertical">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {data.map((node, index) => renderNode(null, node, index))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default CurriculumEditor;
