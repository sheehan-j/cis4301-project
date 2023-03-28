import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeScr from "./screens/HomeScr";
import DataScr from "./screens/DataScr";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomeScr />} />
				<Route path="data">
					<Route index element={<DataScr />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
