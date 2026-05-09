"use client";
import Link from "next/link"

import { useEffect, useState, useRef } from "react";
import { Copy } from "lucide-react";

export default function Home() {
  const [contractType, setContractType] = useState("");
  const [parties, setParties] = useState("");
  const [clauses, setClauses] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("contract")
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [templateText, setTemplateText] = useState("")
  const [templateName, setTemplateName] = useState("")
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

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
    } catch {
      setOutput("Something went wrong.");
    }

    setLoading(false);
  };

  const copyGeneratedOutput = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleTemplateUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    setTemplateName(file.name)

    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      setTemplateText(text)
    }

    reader.readAsText(file)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-black text-white p-6 hidden md:block">
        <Link href="/">
          <div className="flex justify-center cursor-pointer">
            <img
              src="/ligit-logo.png"
              alt="LIGIT Logo"
              className="w-40 object-contain"
            />
          </div>
        </Link>

        <nav className="space-y-4">
          <div
            onClick={() => setActiveTab("contract")}
            className={`p-3 rounded-lg cursor-pointer ${activeTab === "contract"
              ? "bg-gray-800"
              : "hover:bg-gray-800"
              }`}
          >
            Contract Drafting
          </div>

          <div
            onClick={() => setActiveTab("redline")}
            className={`p-3 rounded-lg cursor-pointer ${activeTab === "redline"
              ? "bg-gray-800"
              : "hover:bg-gray-800"
              }`}
          >
            Redlining
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

        {activeTab === "contract" && (

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

                <div className="flex gap-4 items-center flex-wrap">
                  <button
                    onClick={generateContract}
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
                  >
                    {loading ? "Generating..." : "Generate Contract"}
                  </button>

                  <label className="bg-gray-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-300">
                    Upload Template
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleTemplateUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {templateName && (
                  <p className="text-sm text-gray-600 mt-2">
                    Template uploaded: {templateName}
                  </p>
                )}

              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-2xl font-semibold">Generated Output</h3>

                <button
                  type="button"
                  onClick={copyGeneratedOutput}
                  disabled={!output}
                  aria-label={output ? "Copy generated output" : "No output to copy"}
                  className="shrink-0 inline-flex items-center justify-center rounded-lg border bg-white px-2.5 py-2 text-sm text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <span className="font-medium">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="h-[500px] overflow-y-auto rounded-xl border bg-white p-6 shadow-sm">
                <pre className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-gray-900">
                  {output || "AI-generated legal document will appear here..."}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "redline" && (
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900">
                AI Contract Redlining
              </h2>

              <p className="text-gray-600 mt-2">
                Upload original and reviewed contracts to identify key changes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl shadow-md p-6">

                <h3 className="text-2xl font-semibold mb-6">
                  Upload Contracts
                </h3>

                <div className="space-y-6">

                  <div>
                    <label className="block mb-2 font-medium">
                      Original Contract
                    </label>

                    <input
                      type="file"
                      accept=".txt"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      Reviewed Contract
                    </label>

                    <input
                      type="file"
                      accept=".txt"
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <button
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
                  >
                    Compare Contracts
                  </button>

                </div>

              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">

                <h3 className="text-2xl font-semibold mb-6">
                  Redlining Summary
                </h3>

                <div className="border rounded-xl p-4 h-[500px] overflow-y-auto whitespace-pre-wrap leading-7">

                  AI-generated contract comparison will appear here...

                </div>

              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}