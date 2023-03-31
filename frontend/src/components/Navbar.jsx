import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
	const styles = {
		container: {
			width: "100%",
			paddingLeft: "1.25rem",
			paddingRight: "1.25rem",
			boxSizing: "border-box",
		},
		navbar: {
			width: "100%",
			backgroundColor: "#E14D2A",
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
			fontWeight: "500",
			fontSize: "1.1rem",
			color: "white",
			textDecoration: "none",
			marginLeft: "1rem",
			marginRight: "1rem",
		},
		navlinkActive: {
			fontFamily: "Inter",
			fontWeight: "700",
			borderBottom: "1px solid white",
			fontSize: "1.1rem",
			color: "white",
			textDecoration: "none",
			marginLeft: "1rem",
			marginRight: "1rem",
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.navbar}>
				<div style={{ ...styles.navlink, cursor: "default" }}>
					COVID-19 Deaths
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
