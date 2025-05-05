import './App.css';
import './css/UserType.css';
import CustomRouter from './router/customRouter';
import { AppContext, AppProvider } from './provider/appProvider';

function App() {
  return (
    <AppProvider>
      <CustomRouter />
    </AppProvider>
  );
}

export default App;
