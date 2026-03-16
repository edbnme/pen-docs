export const load = () => ({
  slug: "tool-development",
  title: "Adding Tools",
  section: "Contributors",
  description:
    "Step-by-step guide to adding a new tool to PEN, from input struct to registration.",
  headings: [
    { id: "architecture", text: "Architecture", depth: 2 },
    {
      id: "step-1-define-the-input-struct",
      text: "Step 1: Define the Input Struct",
      depth: 2,
    },
    { id: "step-2-define-the-tool", text: "Step 2: Define the Tool", depth: 2 },
    {
      id: "step-3-write-the-handler",
      text: "Step 3: Write the Handler",
      depth: 2,
    },
    {
      id: "step-4-register-the-tool",
      text: "Step 4: Register the Tool",
      depth: 2,
    },
    {
      id: "step-5-add-rate-limiting",
      text: "Step 5: Add Rate Limiting",
      depth: 2,
    },
    { id: "step-6-test-it", text: "Step 6: Test It", depth: 2 },
    {
      id: "patterns-worth-following",
      text: "Patterns Worth Following",
      depth: 2,
    },
    { id: "checklist", text: "Checklist", depth: 2 },
  ],
});
