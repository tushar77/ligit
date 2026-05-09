"use client";

import { useState } from "react";

export default function Home() {
  const [contractType, setContractType] = useState("");
  const [parties, setParties] = useState("");
  const [clauses, setClauses] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateContract = async () => {
    setLoading(true);

    const prompt = `
Draft a professional legal contract under Indian jurisdiction.

Contract Type:
${contractType}

Parties Involved:
${parties}

Special Clauses:
${clauses}

Generate:
1. Title
2. Definitions
3. Obligations
4. Confidentiality
5. Liability
6. Termination
7. Governing Law
`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      setOutput(data.result);
    } catch (error) {
      setOutput("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white p-6 hidden md:block">
        <h1 className="text-3xl font-bold mb-10">LIGIT</h1>

        <nav className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            Contract Drafting
          </div>

          <div className="hover:bg-gray-800 p-3 rounded-lg">
            Legal Research
          </div>

          <div className="hover:bg-gray-800 p-3 rounded-lg">
            LOD Generator
          </div>

          <div className="hover:bg-gray-800 p-3 rounded-lg">
            Translation
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900">
            AI Legal Assistant
          </h2>

          <p className="text-gray-600 mt-2">
            Draft contracts, generate legal notices, perform legal research,
            and translate legal documents using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">
              Contract Drafting
            </h3>

            <div className="space-y-4">
              <input
                className="w-full border rounded-lg p-3"
                placeholder="Contract Type"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
              />

              <input
                className="w-full border rounded-lg p-3"
                placeholder="Parties Involved"
                value={parties}
                onChange={(e) => setParties(e.target.value)}
              />

              <textarea
                className="w-full border rounded-lg p-3 h-40"
                placeholder="Special Clauses / Requirements"
                value={clauses}
                onChange={(e) => setClauses(e.target.value)}
              />

              <button
                onClick={generateContract}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
              >
                {loading ? "Generating..." : "Generate Contract"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">
              Generated Output
            </h3>

            <div className="border rounded-xl p-4 h-[500px] overflow-y-auto bg-gray-50 whitespace-pre-wrap">
              {output || "AI-generated legal document will appear here..."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}