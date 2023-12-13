// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import Backend from 'react-dnd-html5-backend';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// const Node: React.FC = () => {

//   type NodeTypes = 'CSV_UPLOAD' | 'MONGODB';

//   interface DragItem {
//     type: NodeTypes;
//     id: string;
//   }

//   const CsvUploadNode: React.FC = () => {
//     const [, ref] = useDrag({
//       type: 'CSV_UPLOAD',
//       item: { type: 'CSV_UPLOAD', id: 'CSV_UPLOAD' }
//     });

//     return <div ref={ref}>CSV Upload</div>;
//   }

//   const MongoDBNode: React.FC = () => {
//     const [, ref] = useDrag({
//       type: 'MONGODB',
//       item: { type: 'MONGODB', id: 'MONGODB' }
//     });

//     return <div ref={ref}>MongoDB Push</div>;
//   }

//   interface DropZoneProps {
//     onDrop: (type: NodeTypes) => void;
//   }

//   const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
//     const [, drop] = useDrop({
//       accept: ['CSV_UPLOAD', 'MONGODB'],
//       drop: (item: DragItem) => onDrop(item.type)
//     });

//     return (
//       <div ref={drop} style={{ height: '200px', width: '200px', border: '1px solid black' }}>
//         Drop here
//       </div>
//     );
//   }

//   const [nodes, setNodes] = useState<NodeTypes[]>([]);
//   const [workflowName, setWorkflowName] = useState<string>('');

//   const handleDrop = (type: NodeTypes) => {
//     setNodes(prevNodes => [...prevNodes, type]);
//   };

//   const saveWorkflow = () => {
//     // send nodes and workflowName to backend
//     fetch('/api/saveWorkflow', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ nodes, workflowName })
//     });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <h1>Workflow Builder</h1>
//       <CsvUploadNode />
//       <MongoDBNode />
//       <DropZone onDrop={handleDrop} />
//       <input value={workflowName} onChange={e => setWorkflowName(e.target.value)} placeholder="Workflow Name" />
//       <button onClick={saveWorkflow}>Save Workflow</button>
//       {nodes.map((node, index) => <div key={index}>{node}</div>)}
//     </DndProvider>
//   );
// }

// export default Node;


// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// type NodeTypes = 'CSV_UPLOAD' | 'MONGODB';

// interface DragItem {
//   type: NodeTypes;
//   id: string;
//   config?: any;
// }

// const Node: React.FC = () => {
//   // Component for CSV Upload
//   const CsvUploadNode: React.FC = () => {
//     const [, ref] = useDrag({
//       type: 'CSV_UPLOAD',
//       item: { type: 'CSV_UPLOAD', id: 'CSV_UPLOAD' },
//     });
//     return <div ref={ref}>CSV Upload</div>;
//   };

//   // Component for MongoDB
//   const MongoDBNode: React.FC = () => {
//     const [, ref] = useDrag({
//       type: 'MONGODB',
//       item: { type: 'MONGODB', id: 'MONGODB' },
//     });
//     return <div ref={ref}>MongoDB Push</div>;
//   };

//   const [selectedNode, setSelectedNode] = useState<number | null>(null);
//   const [nodes, setNodes] = useState<DragItem[]>([]);
//   const [workflowName, setWorkflowName] = useState<string>('');

//   const DropZone: React.FC = () => {
//     const [, drop] = useDrop({
//       accept: ['CSV_UPLOAD', 'MONGODB'],
//       drop: (item: DragItem) => {
//         setNodes(prevNodes => [...prevNodes, { ...item, config: {} }]);
//       },
//     });

//     return (
//       <div ref={drop} style={{ height: '200px', width: '200px', border: '1px solid black' }}>
//         {nodes.map((node, index) => (
//           <div key={index} onClick={() => setSelectedNode(index)}>
//             {node.type}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const saveNodeConfig = (config: any) => {
//     if (selectedNode !== null) {
//       const updatedNodes = [...nodes];
//       updatedNodes[selectedNode].config = config;
//       setNodes(updatedNodes);
//       setSelectedNode(null); // unselect the node
//     }
//   };

//   const saveWorkflow = () => {
//     fetch('/api/saveWorkflow', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ nodes, workflowName }),
//     });
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <h1>Workflow Builder</h1>
//       <div style={{ display: 'flex' }}>
//         <div>
//           <CsvUploadNode />
//           <MongoDBNode />
//         </div>
//         <DropZone />
//         <div>
//           {selectedNode !== null && nodes[selectedNode].type === 'CSV_UPLOAD' && (
//             <div>
//               <h2>CSV Upload Config</h2>
//               <input placeholder="Enter File URL" onChange={e => saveNodeConfig({ fileUrl: e.target.value })} />
//             </div>
//           )}
//           {selectedNode !== null && nodes[selectedNode].type === 'MONGODB' && (
//             <div>
//               <h2>MongoDB Config</h2>
//               <input placeholder="Enter Collection URL" onChange={e => saveNodeConfig({ collectionUrl: e.target.value })} />
//             </div>
//           )}
//         </div>
//       </div>
//       <input value={workflowName} onChange={e => setWorkflowName(e.target.value)} placeholder="Workflow Name" />
//       <button onClick={saveWorkflow}>Save Workflow</button>
//     </DndProvider>
//   );
// };

// export default Node;


import axios from 'axios';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import authHeader from '../services/auth-header';

type NodeTypes = 'CSV_UPLOAD' | 'MONGODB';

interface DragItem {
  type: NodeTypes;
  id: string;
  config?: any;
}

const Node: React.FC = () => {
  const CsvUploadNode: React.FC = () => {
    const [, ref] = useDrag({
      type: 'CSV_UPLOAD',
      item: { type: 'CSV_UPLOAD', id: 'CSV_UPLOAD' },
    });
    return <div ref={ref}>CSV Upload</div>;
  };

  const MongoDBNode: React.FC = () => {
    const [, ref] = useDrag({
      type: 'MONGODB',
      item: { type: 'MONGODB', id: 'MONGODB' },
    });
    return <div ref={ref}>MongoDB Push</div>;
  };

  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [nodes, setNodes] = useState<DragItem[]>([]);
  const [workflowName, setWorkflowName] = useState<string>('');

  const saveNodeConfig = (key: string, value: string) => {
    if (selectedNode !== null) {
      const updatedNodes = [...nodes];
      updatedNodes[selectedNode].config = { ...updatedNodes[selectedNode].config, [key]: value };
      setNodes(updatedNodes);
    }
  };

  const DropZone: React.FC = () => {
    const [, drop] = useDrop({
      accept: ['CSV_UPLOAD', 'MONGODB'],
      drop: (item: DragItem) => {
        setNodes(prevNodes => [...prevNodes, { ...item, config: {} }]);
      },
    });
    return (
      <div ref={drop} style={{ height: '200px', width: '200px', border: '1px solid black' }}>
        {nodes.map((node, index) => (
          <div key={index} onClick={() => setSelectedNode(index)}>
            {node.type}
          </div>
        ))}
      </div>
    );
  };

  const saveWorkflow = async () => {
    await axios.post("http://localhost:8080/api/saveWorkflow", JSON.stringify({ nodes, workflowName }),
     { headers:{  'Content-Type': 'application/json',...authHeader()
       } });  
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>Workflow Builder</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <CsvUploadNode />
          <MongoDBNode />
        </div>
        <DropZone />
        <div>
          {selectedNode !== null && nodes[selectedNode].type === 'CSV_UPLOAD' && (
            <div>
              <h2>CSV Upload Config</h2>
              <input 
                defaultValue={nodes[selectedNode].config?.fileUrl || ''} 
                placeholder="Enter File URL" 
                onChange={e => saveNodeConfig('fileUrl', e.target.value)} 
              />
            </div>
          )}
          {selectedNode !== null && nodes[selectedNode].type === 'MONGODB' && (
            <div>
              <h2>MongoDB Config</h2>
              <input 
                defaultValue={nodes[selectedNode].config?.collectionUrl || ''} 
                placeholder="Enter Collection URL" 
                onChange={e => saveNodeConfig('collectionUrl', e.target.value)} 
              />
            </div>
          )}
        </div>
      </div>
      <input value={workflowName} onChange={e => setWorkflowName(e.target.value)} placeholder="Workflow Name" />
      <button onClick={saveWorkflow}>Save Workflow</button>
    </DndProvider>
  );
};

export default Node;
