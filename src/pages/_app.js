import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "@/components/layouts/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/services/AuthContext";
export default function App({ Component, pageProps }) {
  return (
  <>
  <AuthProvider>
  <Header />
  <Component {...pageProps} />;
  <ToastContainer position="top-center"/>
  </AuthProvider>
  </>
  );
}
