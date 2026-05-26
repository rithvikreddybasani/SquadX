import { PipelineToolbar } from "./toolbar.jsx";
import { PipelineUI } from "./ui.jsx";
import { SubmitButton } from "./submit.jsx";

function AiCalculator() {
    return (
        <div className="flex h-screen w-screen flex-col bg-white">
          <PipelineToolbar />
          <PipelineUI />
          <SubmitButton />
        </div>
    );
}

export default AiCalculator;
