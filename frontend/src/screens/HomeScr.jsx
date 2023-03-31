import Navbar from "../components/Navbar";

const HomeScr = () => {
	return (
		<div
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				paddingTop: "0.5rem",
			}}
		>
			<Navbar active={"Home"} />
		</div>
	);
};

export default HomeScr;
