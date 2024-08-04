import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { CopyToClipboard } from "react-copy-to-clipboard";
<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
  rel="stylesheet"
></link>;

// Ensure you've added REACT_APP_GEMINI_API_KEY to your .env file
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

interface Passphrase {
  phrase: string;
  movie: string;
  actor: string;
  year: string;
  scene: string;
}

const SafeWordAI: React.FC = () => {
  const [genre, setGenre] = useState<string>("Action");
  const [length, setLength] = useState<number>(4);
  const [complexity, setComplexity] = useState<number>(2);
  const [passphrase, setPassphrase] = useState<Passphrase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const generatePassphrase = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const model: GenerativeModel = genAI.getGenerativeModel({
        model: "gemini-pro",
      });

      const prompt = `Generate a unique, memorable dialouge or line or quote from Hollywood movies or TV Shows released after 2000 year based on a ${genre} genre. 
        This line should be strictly equal to ${length} words long and have a complexity level of ${complexity} out of 5. 
        Also provide the movie title, actor who said it, and release year. 
        Format the response as JSON with keys: phrase, movie, actor, year, scene.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("text: ", text);
      // Remove Markdown formatting
      const cleanText = text
        .replace(/```json/, "")
        .replace(/```JSON/, "")
        .replace(/```/, "");

      // Parse the clean text as JSON
      const generatedContent: Passphrase = JSON.parse(cleanText);

      console.log("generatedContent: ", generatedContent);
      setPassphrase(generatedContent);
    } catch (err) {
      setError("Error generating passphrase. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // You can perform any initialization here if needed
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white-900 text-black">
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-mono text-center">SafeWord AI</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-white-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-medium font-mono text-gray-700 mb-1">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setGenre(e.target.value)
              }
              className="w-full font-mono p-2 border rounded"
            >
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">
              Length
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={length}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLength(parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-sm text-gray-500 font-mono">
              I'll try {length} words
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 font-mono">
              Complexity
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={complexity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComplexity(parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-sm text-gray-500 font-mono">
              Level {complexity}
            </span>
          </div>
          <button
            onClick={generatePassphrase}
            className="w-full p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2">&#9696;</span>
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Generate Passphrase
          </button>
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
        {passphrase && (
          <div className="bg-gray-100 p-4 rounded-md mt-4">
            <h2 className="text-lg font-semibold mb-2 ">
              Generated Passphrase:
            </h2>
            <p className="text-xl font-mono mb-2">{passphrase.phrase}</p>
            <CopyToClipboard text={passphrase.phrase} onCopy={handleCopy}>
              <button>{copied ? "✅ Copied" : "📋 Copy "}</button>
            </CopyToClipboard>
            <p className="text-sm text-gray-600">
              From: {passphrase.movie} ({passphrase.year})<br />
              Actor: {passphrase.actor} <br />
              Scene: {passphrase.scene}
            </p>
          </div>
        )}
      </main>
      <footer className="bg-emerald-600 text-white p-4 text-sm text-center font-mono">
        <p>
          Developed by{" "}
          <a
            href="https://linkedin.com/in/iamphanisairam"
            className="text-white-400 hover:bg-blue-600"
          >
            <u>Phani Sai Ram M</u>
          </a>{" "}
          - Powered by Google's Gemini-Pro Model
        </p>
      </footer>
    </div>
  );
};

export default SafeWordAI;
