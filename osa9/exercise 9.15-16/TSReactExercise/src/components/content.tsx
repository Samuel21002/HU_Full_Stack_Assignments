import Part from "./part";
import type { CoursePart } from "../App";

const Content = ({ parts }: { parts: Array<CoursePart> }) => {
	return (
		<div>
			{parts.map((part) => (
				<div key={part.name}>
					<Part part={part} />
					<br />
				</div>
			))}
		</div>
	);
};

export default Content;
