import { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    let imageUrl = "";
    if (file) {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
    }
    await addDoc(collection(db, "posts"), {
      username: "Roy Kim",
      content,
      imageUrl,
      timestamp: serverTimestamp(),
      likes: [],
      comments: [],
    });
    setContent("");
    setFile(null);
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <textarea
        className="border p-2 w-full rounded-lg"
        placeholder="무슨 생각을 하고 있나요?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "업로드 중..." : "게시하기"}
      </button>
    </div>
  );
}
