import Tiptap from "./Tiptap.jsx";
import "./App.css";
import { useParams } from "react-router-dom";
const App = () => {
  const { id } = useParams();

  return (
    <div className="App">
      <Tiptap id={id} />
    </div>
  );
};

export default App;
