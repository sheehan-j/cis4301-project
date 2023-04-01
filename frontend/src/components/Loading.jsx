import { DotWave } from "@uiball/loaders";

const Loading = () => {
	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
			}}
		>
			<DotWave size={47} speed={1.5} color="rgba(20,20,20,0.8)" />
		</div>
	);
};

export default Loading;
