import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilePickerTable } from "./table";
import { fn } from "@storybook/test";

const meta: Meta<typeof FilePickerTable> = {
  title: "Components/FilePicker/Table",
  component: FilePickerTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onFolderClick: fn(),
    onImport: fn(),
    onRemove: fn(),
    isActionPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof FilePickerTable>;

const mockResources = [
  {
    resource_id: "1",
    inode_type: "directory" as const,
    inode_path: { path: "/Documents" },
  },
  {
    resource_id: "2",
    inode_type: "file" as const,
    inode_path: { path: "/Documents/report.pdf" },
  },
  {
    resource_id: "3",
    inode_type: "file" as const,
    inode_path: { path: "/Documents/data.csv" },
  },
  {
    resource_id: "4",
    inode_type: "directory" as const,
    inode_path: { path: "/Images" },
  },
];

export const Loading: Story = {
  args: {
    resources: [],
    isLoading: true,
    indexedPaths: new Set(),
  },
};

export const Empty: Story = {
  args: {
    resources: [],
    isLoading: false,
    indexedPaths: new Set(),
  },
};

export const WithData: Story = {
  args: {
    resources: mockResources,
    isLoading: false,
    indexedPaths: new Set(["/Documents/report.pdf"]),
  },
};

export const ActionPending: Story = {
  args: {
    resources: mockResources,
    isLoading: false,
    indexedPaths: new Set(["/Documents/report.pdf"]),
    isActionPending: true,
  },
};
