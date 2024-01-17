import { RemirrorComponent } from "./components/MarkdownEditor/RemirrorComponent";
import { LocalFileSystem } from "./components/FileSystemAdapters/FileSystem/LocalFileSystem";

const App: React.FC = () => {
  return (
    <div className="App">
      <LocalFileSystem />
      <RemirrorComponent />
    </div>
  );
};

export default App;
