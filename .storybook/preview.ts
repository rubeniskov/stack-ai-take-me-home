import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { Inter } from "next/font/google";
import "../src/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        "div",
        { className: `font-sans ${inter.variable}` },
        React.createElement(Story),
      ),
  ],
};

export default preview;
