import type { CoursePart } from "../App";

const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`
	);
};

const Part = ({ part }: { part: CoursePart }) => {
	switch (part.kind) {
		case "basic":
			return (
				<div>
					<strong>{part.name}</strong> ({part.exerciseCount} exercises)
					<br />
					<em>{part.description}</em>
				</div>
			);
		case "group":
			return (
				<div>
					<strong>{part.name}</strong> ({part.exerciseCount} exercises)
					<br />
					Group projects: {part.groupProjectCount}
				</div>
			);
		case "background":
			return (
				<div>
					<strong>{part.name}</strong> ({part.exerciseCount} exercises)
					<br />
					<em>{part.description}</em>
					<br />
					Background material:{" "}
					<a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
				</div>
			);
		case "special":
			return (
				<div>
					<strong>{part.name}</strong> ({part.exerciseCount} exercises)
					<br />
					<em>{part.description}</em>
					<br />
					Requirements: {part.requirements.join(", ")}
				</div>
			);
		default:
			return assertNever(part as never);
	}
};

export default Part;
