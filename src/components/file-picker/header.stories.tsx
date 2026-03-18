import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilePickerHeader } from "./header";
import { fn } from "@storybook/test";

const meta: Meta<typeof FilePickerHeader> = {
  title: "Components/FilePicker/Header",
  component: FilePickerHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSearchChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FilePickerHeader>;

export const Default: Story = {
  args: {
    providerName: "Google Drive",
    searchQuery: "",
  },
};

export const Searching: Story = {
  args: {
    providerName: "Google Drive",
    searchQuery: "my document",
  },
};
