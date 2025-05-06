import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Handle,
  Position,
} from '@xyflow/react';
import {
  Card,
  DropdownMenu,
  Slider,
  Select,
  TextField,
  Flex,
  Button,
  Text,
} from '@radix-ui/themes';
import {
  MixerHorizontalIcon,
  DotsHorizontalIcon,
  PaperPlaneIcon,
  TrashIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'llm',
    position: { x: 100, y: 100 },
    data: { label: 'AI Model 1' },
  },
  {
    id: '2',
    type: 'api',
    position: { x: 400, y: 100 },
    data: { label: 'API Call 1' },
  },
  {
    id: '3',
    type: 'conditional',
    position: { x: 700, y: 100 },
    data: {
      label: 'Condition 1',
      conditions: [
        { source: 'API Response', operator: 'contains', value: 'success' },
      ],
      addCondition: () => {},
      removeCondition: () => {},
    },
  },
  {
    id: '4',
    type: 'llm',
    position: { x: 100, y: 300 },
    data: { label: 'AI Model 2' },
  },
  {
    id: '5',
    type: 'api',
    position: { x: 400, y: 300 },
    data: { label: 'API Call 2' },
  },
  {
    id: '6',
    type: 'conditional',
    position: { x: 700, y: 300 },
    data: {
      label: 'Condition 2',
      conditions: [
        { source: 'API Response', operator: 'equals', value: 'error' },
      ],
      addCondition: () => {},
      removeCondition: () => {},
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Process Data' },
  { id: 'e2-3', source: '2', target: '3', label: 'Check Response' },
  { id: 'e4-5', source: '4', target: '5', label: 'Process Data' },
  { id: 'e5-6', source: '5', target: '6', label: 'Check Response' },
  { id: 'e3-6', source: '3', target: '6', label: 'Merge Results' },
];

const LLMNode = ({}) => {
  return (
    <Card>
      <div>
        <span className="text-blue-10 mr-2">🤖</span>
        <span className="font-medium text-gray-12">AI Model</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="ml-auto">
            <DotsHorizontalIcon className="text-gray-10 hover:text-gray-12" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="min-w-[160px]">
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-11">Model</label>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="w-full flex items-center justify-between px-2 py-1 text-sm bg-gray-3 rounded">
              <div>
                GPT-4
                <MixerHorizontalIcon className="text-gray-10" />
              </div>
            </DropdownMenu.Trigger>
          </DropdownMenu.Root>
        </div>

        {/* Temperature Control */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-11">Temperature</span>
            <span className="text-gray-12">0.7</span>
          </div>
          <Slider defaultValue={[0.7]} max={1} step={0.1} />
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-blue-8"
        />
        <Handle type="target" position={Position.Top} className="!bg-green-8" />
      </div>
    </Card>
  );
};

const APINode = ({ data }) => (
  <Card className="w-72 bg-gray-2 rounded-lg shadow-sm border border-gray-6">
    <div className="flex items-center px-3 py-2 border-b border-gray-6">
      <span className="text-green-10 mr-2">🌐</span>
      <span className="font-medium text-gray-12">API Integration</span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="ml-auto">
          <DotsHorizontalIcon className="text-gray-10 hover:text-gray-12" />
        </DropdownMenu.Trigger>
      </DropdownMenu.Root>
    </div>

    <div className="p-3 space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-11">
          Request Configuration
        </label>
        <Select.Root defaultValue="GET">
          <Select.Trigger className="w-full" />
          <Select.Content>
            <Select.Item value="GET">GET</Select.Item>
            <Select.Item value="POST">POST</Select.Item>
            <Select.Item value="PUT">PUT</Select.Item>
          </Select.Content>
        </Select.Root>

        <TextField.Root placeholder="https://api.example.com/endpoint" />
      </div>

      <div className="space-y-2">
        <details className="group">
          <summary className="flex items-center text-xs font-medium text-gray-11 cursor-pointer">
            Advanced Settings
            <span className="ml-auto transform transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="mt-2 space-y-2">
            <TextField.Root placeholder="Headers (JSON)" />
            <TextField.Root placeholder="Request Body (JSON)" />
          </div>
        </details>
      </div>

      <Flex justify="between" align="center">
        <Button variant="soft" size="1" onClick={data.onTest}>
          <PaperPlaneIcon className="mr-1" />
          Test Connection
        </Button>
        <span className="text-xs text-gray-10">Last tested: 2m ago</span>
      </Flex>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-green-8"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-8"
      />
    </div>
  </Card>
);

const ConditionalNode = ({ data = [] }) => {
  return (
    <Card className="w-64 bg-gray-2 rounded-lg shadow-sm border border-gray-6">
      <div className="flex items-center px-3 py-2 border-b border-gray-6">
        <span className="text-purple-10 mr-2">⚖️</span>
        <span className="font-medium text-gray-12">Condition</span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="ml-auto">
            <DotsHorizontalIcon className="text-gray-10 hover:text-gray-12" />
          </DropdownMenu.Trigger>
        </DropdownMenu.Root>
      </div>

      <div className="p-3 space-y-3">
        <div className="space-y-2">
          {data?.conditions?.map((condition, index) => (
            <Flex key={index} gap="2" align="center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger variant="soft">
                  <Text size="1">{condition.source || 'Select input'}</Text>
                </DropdownMenu.Trigger>
              </DropdownMenu.Root>

              <Select.Root defaultValue="contains">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="contains">contains</Select.Item>
                  <Select.Item value="==">equals</Select.Item>
                  <Select.Item value=">">greater than</Select.Item>
                </Select.Content>
              </Select.Root>

              <TextField.Root placeholder="Value" size="2" />

              <Button
                variant="ghost"
                size="1"
                onClick={() => data.removeCondition(index)}
              >
                <TrashIcon className="text-red-9" />
              </Button>
            </Flex>
          ))}
        </div>

        {/* <Flex justify="between" align="center">
          <Button variant="soft" size="1" onClick={data.addCondition}>
            <PlusIcon className="mr-1" />
            Add Condition
          </Button>
          <Select.Root defaultValue="AND">
            <Select.Trigger size="1" />
            <Select.Content>
              <Select.Item value="AND">ALL (AND)</Select.Item>
              <Select.Item value="OR">ANY (OR)</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex> */}

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-purple-8"
        />
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-orange-8"
        />
      </div>
    </Card>
  );
};

const nodeTypes = {
  llm: LLMNode,
  api: APINode,
  conditional: ConditionalNode,
};

function HelloApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Theme>
      <div style={{ width: '90vw', height: '90vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          minZoom={0.25}
          maxZoom={2}
        >
          <Background gap={24} variant="dots" size={1} />

          <Controls />
        </ReactFlow>
      </div>
    </Theme>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloApp />} />
      </Routes>
    </Router>
  );
}
