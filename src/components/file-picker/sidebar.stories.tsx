import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilePickerSidebar } from "./sidebar";
import { ConnectorType } from "@/lib/api";
import { fn } from "@storybook/test";

const meta: Meta<typeof FilePickerSidebar> = {
  title: "Components/FilePicker/Sidebar",
  component: FilePickerSidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onConnectionSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex h-[600px] border rounded-lg overflow-hidden">
        <Story />
        <div className="flex-1 bg-background p-8 flex items-center justify-center text-muted-foreground italic">
          Content Area
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilePickerSidebar>;

const mockConnections = [
  {
    connection_id: "conn-123",
    connector_id: "ctor-789",
    provider_id: "gdrive",
    connector_type_id: ConnectorType.GDRIVE,
    auth_method: "oauth",
    org_id: "org-456",
    name: "My Drive",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    connection_id: "conn-456",
    connector_id: "ctor-789",
    provider_id: "gdrive",
    connector_type_id: ConnectorType.GDRIVE,
    auth_method: "oauth",
    org_id: "org-456",
    name: "Work Drive",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

export const Empty: Story = {
  args: {
    connections: [],
    currentConnectionId: null,
  },
};

export const WithConnections: Story = {
  args: {
    connections: mockConnections,
    currentConnectionId: null,
  },
};

export const WithSelection: Story = {
  args: {
    connections: mockConnections,
    currentConnectionId: "conn-123",
  },
};
