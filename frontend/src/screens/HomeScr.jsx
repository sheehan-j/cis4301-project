import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./VisualizationScr.css";

const HomeScr = () => {
	// Get the height of the navbar to size the ocntent area
	const [navbarHeight, setNavbarHeight] = useState(0);
	useEffect(() => {
		const handleResize = () => {
			setNavbarHeight(
				document.getElementById("navbar-container").offsetHeight
			);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div style={styles.container}>
			<Navbar active={"Home"} />
			<div
				style={{
					...styles.contentArea,
					marginTop: `${navbarHeight}px`,
				}}
			>
				<div style={styles.contentContainer}>
					<div style={styles.title}>
						U.S. COVID-19 Deaths Visualizer
					</div>
					<div style={styles.description}>
						This is a website for visualizing COVID-19 deaths data
						in the United States. Visualizations can be customized
						around specific factors, including age groups, state,
						and conditions or condition groups related to COVID-19
						deaths.
					</div>
					<Link to="visualization" style={{ textDecoration: "none" }}>
						<div
							style={styles.visualizationButton}
							className="buttonScale"
						>
							View Visualizations
							<div className="hoverFade"></div>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

const styles = {
	container: {
		width: "100vw",
		height: "100vh",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		display: "flex",
		boxSizing: "border-box",
	},
	contentArea: {
		flex: 1,
		display: "flex",
		position: "relative",
		boxSizing: "border-box",
		alignItems: "center",
	},
	contentContainer: {
		width: "45vw",
		backgroundColor: "white",
		borderRadius: "15px",
		padding: "2rem",
		textAlign: "start",
	},
	title: {
		fontFamily: "Inter",
		fontWeight: "700",
		fontSize: "2rem",
		color: "#292929",
	},
	description: {
		fontFamily: "Inter",
		fontWeight: "400",
		marginTop: "0.5rem",
		fontSize: "1rem",
		lineHeight: "1.5rem",
		color: "#2b2b2b",
	},
	visualizationButton: {
		width: "100%",
		backgroundColor: "#3a5a40",
		borderRadius: "5px",
		fontFamily: "Inter",
		fontWeight: "600",
		marginTop: "2rem",
		padding: "0.8rem",
		color: "white",
		textAlign: "center",
		textDecoration: "none",
		position: "relative",
		overflow: "hidden",
	},
};

export default HomeScr;
