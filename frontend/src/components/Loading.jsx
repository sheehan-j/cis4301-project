import { DotWave } from "@uiball/loaders";

const Loading = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				// backgroundColor: "rgba(100,100,100,0.05)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<DotWave size={47} speed={1.5} color="rgba(20,20,20,0.8)" />
		</div>
	);
};

export default Loading;
