import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
	const styles = {
		container: {
			width: "100%",
			paddingLeft: "1.25rem",
			paddingRight: "1.25rem",
			paddingTop: "1rem",
			boxSizing: "border-box",
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 99,
		},
		navbar: {
			width: "100%",
			// backgroundColor: "#E14D2A",
			backgroundColor: "#3a5a40",
			borderRadius: "10px",
			paddingTop: "1.5rem",
			paddingBottom: "1.5rem",
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			paddingLeft: "1.25rem",
			paddingRight: "1.25rem",
			boxSizing: "border-box",
		},
		navlink: {
			fontFamily: "Inter",
			fontWeight: "400",
			fontSize: "1.1rem",
			color: "white",
			textDecoration: "none",
			marginLeft: "1rem",
			marginRight: "1rem",
			padding: "0.5rem",
		},
		navlinkActive: {
			fontFamily: "Inter",
			fontWeight: "600",
			borderRadius: "5px",
			fontSize: "1.1rem",
			color: "white",
			paddingTop: "0.5rem",
			paddingBottom: "0.5rem",
			paddingLeft: "0.75rem",
			paddingRight: "0.75rem",
			backgroundColor: "rgba(0,0,0,0.3)",
			marginLeft: "1rem",
			marginRight: "1rem",
		},
	};

	return (
		<div style={styles.container} id="navbar-container">
			<div style={styles.navbar}>
				<div
					style={{
						...styles.navlink,
						cursor: "default",
						fontWeight: "700",
					}}
				>
					U.S. COVID-19 Deaths
				</div>

				{/* Wrapper for Controls on the Right Side of the Navbar */}
				<div style={{ display: "flex", flexDirection: "row" }}>
					<Link to="/" style={{ textDecoration: "none" }}>
						<div
							style={
								active === "Home"
									? styles.navlinkActive
									: styles.navlink
							}
						>
							Home
						</div>
					</Link>

					<Link
						to="/visualization"
						style={{ textDecoration: "none" }}
					>
						<div
							style={
								active === "Visualizations"
									? styles.navlinkActive
									: styles.navlink
							}
						>
							Visualizations
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
