import Footer from "../../components/Home/Footer";
import Navbar from "../../components/Home/Navbar";

export default function RootLayout({ children }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
