import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeScr from "./screens/HomeScr";
import VisualizationScr from "./screens/VisualizationScr";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<HomeScr />} />
				<Route path="visualization">
					<Route index element={<VisualizationScr />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
