import { DrawingContextProvider } from "@/components/DrawingContextProvider";
import { Editor } from "@/components/Editor";

export const WebCAD = () => {
  return (
    <DrawingContextProvider>
      <Editor />
    </DrawingContextProvider>
  );
};
