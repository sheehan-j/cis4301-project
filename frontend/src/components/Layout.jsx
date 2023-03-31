import { Outlet } from "react-router-dom";
import "../App.css";

const Layout = () => {
	return (
		<div className="App">
			<Outlet />
		</div>
	);
};

export default Layout;
