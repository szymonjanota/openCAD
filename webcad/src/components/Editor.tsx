"use client";

import { useState } from "react";
import { repeat } from "@/components/repeat";
import clsx from "clsx";
import {
  EllipsisIcon,
  StackIcon,
  CubeIcon,
  DocumentIcon,
} from "@/components/icons";
import { ToolMenuSection, ToolAction } from "@/components/types";
import { Canvas } from "./Canvas";

const PANELS = [
  {
    name: "Layers",
    icon: <StackIcon />,

    action: "layers",
  },
  {
    name: "Blocks",
    icon: <CubeIcon />,
    action: "blocks",
  },
  {
    name: "Pages",
    icon: <DocumentIcon />,
    action: "pages",
  },
] as const;

const TOOL_MENU_SECTIONS: ToolMenuSection[] = [
  {
    id: "general",
    tools: [
      {
        id: "select",
        name: "Select",
        children: "S",
        tooltip: "Select",
      },
    ],
  },
  {
    id: "simple",
    tools: [
      {
        id: "line",
        name: "Draw Line",
        children: "DL",
        tooltip: "Draw Line",
      },
    ],
  },
  ...repeat(
    4,
    (sectionIndex): ToolMenuSection => ({
      id: `${sectionIndex}`,
      tools: repeat(
        7,
        (toolIndex): ToolAction => ({
          id: `${sectionIndex}:${toolIndex}`,
          name: `${sectionIndex}:${toolIndex}`,
          children: <EllipsisIcon />,
        })
      ),
    })
  ),
];

export const Editor = () => {
  const [selected, setSelected] = useState<{
    id: (typeof PANELS)[number]["action"];
    show: boolean;
  }>({
    id: "layers",
    show: false,
  });

  const activePanel = PANELS.find((panel) => panel.action === selected.id);
  if (!activePanel) {
    throw new Error("NO PANEL");
  }

  const updateMenu = (val: (typeof selected)["id"]) => {
    setSelected((prevState) =>
      prevState.id === val
        ? {
            id: val,
            show: !prevState.show,
          }
        : {
            id: val,
            show: true,
          }
    );
  };

  return (
    <div className="grid grid-cols-canvas-container w-full h-full">
      <div className="p-2 flex-shrink-0 divide-y divide-base-300 border-r border-base-300 bg-base-100">
        <div className="pb-2">
          <SquareButton tooltip="Home" tooltipClassName="tooltip-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </SquareButton>
        </div>
        <div className="pt-2 space-y-2">
          {PANELS.map(({ name, icon, action }, index) => (
            <div key={index}>
              <SquareButton
                active={selected.id === action && selected.show}
                tooltip={name}
                tooltipClassName="tooltip-right"
                onClick={() => updateMenu(action)}
              >
                {icon}
              </SquareButton>
            </div>
          ))}
        </div>
      </div>

      <div
        className={clsx(
          "bg-base-100 overflow-hidden",
          selected.show ? "w-64" : "w-0"
        )}
      >
        <div className="w-full h-full flex justify-center items-center">
          {activePanel?.name}
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-base-100 w-full h-full flex justify-center items-center border-base-300 border-x relative">
          {/* Maybe refactor this so UI is `position: fixed` on top of canvas (might be easier to solve resize issues by just using h-screen / w-screen) */}
          <Canvas className="border-2 border-red-400 w-full h-full"/>
          <div className="flex justify-center absolute left-0 right-0 bottom-4">
            <div className="flex divide-x bg-base-200 p-1 rounded-lg">
              {TOOL_MENU_SECTIONS.map(({ id: index, tools: items }) => {
                return (
                  <div
                    key={index}
                    className="flex px-2 first:pl-0 last:pr-0 space-x-2"
                  >
                    <div
                      className={`grid gap-1 grid-rows-2 first:pl-0 last:pr-0 ${getGridColumns(
                        items.length
                      )}`}
                    >
                      {...items.slice(0, 6).map((x) => (
                        <SquareButton key={x.id} tooltip={x.name}>
                          {x.children}
                        </SquareButton>
                      ))}
                    </div>
                    {items.length > 6 && (
                      <button className="btn btn-xs btn-ghost h-full btn-squar">
                        <svg
                          style={{
                            width: "1em",
                            height: "1em",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-64 bg-base-100"></div>
    </div>
  );
};

const SquareButton: React.FC<
  React.PropsWithChildren<{
    className?: string;
    tooltip?: string;
    tooltipClassName?: string;
    onClick?: () => void;
    active?: boolean;
  }>
> = ({
  className,
  children,
  tooltip,
  onClick,
  active,
  tooltipClassName: tooltipClass,
}) => {
  const button = (
    <button
      onClick={onClick}
      className={clsx(
        `btn btn-square btn-sm`,
        active ? "btn-primary" : "btn-ghost",
        className
      )}
    >
      {children}
    </button>
  );

  const tooltipText = tooltip
    ? onClick
      ? tooltip
      : `${tooltip} (N/A)`
    : onClick
    ? ""
    : "(N/A)";

  return tooltip ? (
    <div className={clsx("tooltip", tooltipClass)} data-tip={tooltipText}>
      {button}
    </div>
  ) : (
    button
  );
};

const getGridColumns = (size: number): string => {
  if (size < 3) {
    return "grid-cols-1";
  }
  if (size < 5) {
    return "grid-cols-2";
  }
  return "grid-cols-3";
};
